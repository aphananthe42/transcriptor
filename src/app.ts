import { loadSync } from "./deps.ts";
import { parseArgs } from "./deps.ts";
import { readAll } from "./deps.ts";
import { fileTypeFromFile } from "./deps.ts";
import { extname } from "./deps.ts";
import { ora } from "./deps.ts";
import { S3Service } from "./Service/S3Service.ts";
import { TranscribeService } from "./Service/TranscribeService.ts";
import { DateService } from "./Service/DateService.ts";
import { FormatService } from "./Service/FormatService.ts";
import { TranscriptionResult } from "./Entity/TranscriptionResult.ts";
import { OpenAIService } from "./Service/OpenAIService.ts";

loadSync({
  export: true,
  envPath: "./.env",
});

const flags = parseArgs(Deno.args, {
  string: ["file", "lang", "model", "speakerCount"],
});
const filePath = flags.file ?? "";
const transcriptionLang = flags.lang ?? "ja-JP";
const languageModelName = flags.model;
const speakerCount = Number(flags.speakerCount ?? 1);

const file = await Deno.open(filePath);
const fileCotent = await readAll(file);
const fileExtension = extname(filePath).replace(".", "");
const fileType = await fileTypeFromFile(filePath);

const s3Service = new S3Service();
const transcribeService = new TranscribeService();
const openAIService = new OpenAIService();

const s3ObjectKey = ((fileExtension: string) => {
  return `${DateService.createCurrentDateString()}.${fileExtension}`;
})(fileExtension);

const spinner = ora("");
try {
  spinner.start("Uploading audio data to S3...");
  await s3Service.putObject(
    s3ObjectKey,
    fileCotent,
    fileType?.mime ?? "",
  );
  spinner.succeed();

  spinner.start("Transcribing audio data into text...");
  const transcriptionJobName = await transcribeService.startTranscriptionJob(
    s3ObjectKey,
    fileExtension,
    transcriptionLang,
    speakerCount,
    languageModelName,
  );

  const transcriptFileUri = await transcribeService.checkTranscriptionJobStatus(
    transcriptionJobName,
  );
  await transcribeService.deleteTranscriptionJob(transcriptionJobName);
  spinner.succeed();

  spinner.start("Formatting transcription result...");
  const getObjectResult = await s3Service.getObject(transcriptFileUri);
  const transcriptionJSON = await getObjectResult.Body?.transformToString();
  const transcriptionResult: TranscriptionResult = JSON.parse(
    transcriptionJSON,
  );
  const formattedTranscriptionResult = FormatService.format(
    transcriptionResult,
  );
  spinner.succeed();

  spinner.start("Summarizing via GPT...");
  const summaryResult = await openAIService.sendPrompt(
    formattedTranscriptionResult,
  );
  spinner.succeed();
  console.log(summaryResult);
} catch (error) {
  spinner.fail();
  console.log(error);
} finally {
  file.close();
  Deno.exit();
}
