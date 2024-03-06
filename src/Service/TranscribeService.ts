import {
  DeleteTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  LanguageCode,
  MediaFormat,
  StartTranscriptionJobCommand,
  TranscribeClient,
  TranscriptionJobStatus,
} from "../deps.ts";
import { DateService } from "./DateService.ts";

export class TranscribeService {
  private shared: TranscribeClient;

  constructor() {
    this.shared = new TranscribeClient({
      region: Deno.env.get("AWS_REGION"),
    });
  }

  async startTranscriptionJob(
    targetObjectKey: string,
    mediaFormat: string,
    languageCode: string,
    speakerCount: number,
    languageModelName?: string,
  ): Promise<string> {
    const params = new StartTranscriptionJobCommand({
      TranscriptionJobName: DateService.createCurrentDateString(),
      LanguageCode: languageCode as LanguageCode,
      MediaFormat: mediaFormat as MediaFormat ?? "wav",
      Media: {
        MediaFileUri: `https://${Deno.env.get("AWS_S3_BUCKET_NAME")}.s3.${
          Deno.env.get("AWS_REGION")
        }.amazonaws.com/${targetObjectKey}`,
      },
      ModelSettings: {
        LanguageModelName: languageModelName,
      },
      OutputBucketName: Deno.env.get("AWS_S3_BUCKET_NAME"),
      Settings: {
        ShowSpeakerLabels: !(speakerCount === 1),
        MaxSpeakerLabels: (speakerCount === 1) ? undefined : speakerCount,
      },
    });

    const output = await this.shared.send(params);
    return output.TranscriptionJob?.TranscriptionJobName ?? "";
  }

  async checkTranscriptionJobStatus(
    transcriptionJobName: string,
  ): Promise<string> {
    const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
    const params = new GetTranscriptionJobCommand({
      TranscriptionJobName: transcriptionJobName,
    });
    while (true) {
      const output = await this.shared.send(params);
      switch (output.TranscriptionJob?.TranscriptionJobStatus) {
        case TranscriptionJobStatus.IN_PROGRESS:
          await sleep(30000);
          continue;
        case TranscriptionJobStatus.COMPLETED:
          return output.TranscriptionJob.Transcript?.TranscriptFileUri ?? "";
        case TranscriptionJobStatus.FAILED:
          throw Error(output.TranscriptionJob.FailureReason);
        default:
          throw Error("TranscriptionJob unexpectedly terminated.");
      }
    }
  }

  async deleteTranscriptionJob(transcriptionJobName: string) {
    const params = new DeleteTranscriptionJobCommand({
      TranscriptionJobName: transcriptionJobName,
    });
    await this.shared.send(params);
  }
}
