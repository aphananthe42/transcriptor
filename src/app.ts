import { loadSync } from "./deps.ts";
import { parseArgs } from "./deps.ts";
import { readAll } from "./deps.ts";
import { fileTypeFromFile } from "./deps.ts";
import { extname } from "./deps.ts";
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
const transcriptionLang = flags.lang;
const languageModelName = flags.model;
const speakerCount = Number(flags.speakerCount);

// ファイル読み込み or S3putObjectが遅い
const file = await Deno.open(filePath);
const fileCotent = await readAll(file);
const fileExtension = extname(filePath).replace(".", "");
const fileType = await fileTypeFromFile(filePath);

const s3Service = new S3Service();
const transcribeService = new TranscribeService();
const openAIService = new OpenAIService();

try {
  const s3ObjectKey = ((fileExtension: string) => {
    return `${DateService.createCurrentDateString()}.${fileExtension}`;
  })(fileExtension);

  await s3Service.putObject(
    s3ObjectKey,
    fileCotent,
    fileType?.mime ?? "",
  );

  const transcriptionJobName = await transcribeService.startTranscriptionJob(
    s3ObjectKey,
    fileExtension,
    transcriptionLang,
    languageModelName,
    speakerCount,
  );

  const transcriptFileUri = await transcribeService.checkTranscriptionJobStatus(
    transcriptionJobName,
  );
  await transcribeService.deleteTranscriptionJob(transcriptionJobName);

  const getObjectResult = await s3Service.getObject(transcriptFileUri);
  const transcriptionJSON = await getObjectResult.Body?.transformToString();
  const transcriptionResult: TranscriptionResult = JSON.parse(
    transcriptionJSON,
  );
  const formattedTranscriptionResult = FormatService.format(
    transcriptionResult,
  );

  const summaryResult = await openAIService.sendPrompt(
    formattedTranscriptionResult,
  );
  console.log(summaryResult);
} catch (error) {
  console.log(error);
} finally {
  file.close();
}
