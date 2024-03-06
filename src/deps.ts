export { loadSync } from "https://deno.land/std@0.214.0/dotenv/mod.ts";
export { parseArgs } from "https://deno.land/std@0.214.0/cli/mod.ts";
export { readAll } from "https://deno.land/std@0.214.0/io/mod.ts";
export { fileTypeFromFile } from "npm:file-type";
export { extname } from "https://deno.land/std@0.214.0/path/mod.ts";
export { default as ora } from "npm:ora";

export {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "npm:@aws-sdk/client-s3";
export {
  DeleteTranscriptionJobCommand,
  GetTranscriptionJobCommand,
  LanguageCode,
  MediaFormat,
  StartTranscriptionJobCommand,
  TranscribeClient,
  TranscriptionJobStatus,
} from "npm:/@aws-sdk/client-transcribe";
export { default as AmazonS3URI } from "npm:amazon-s3-uri";

export { OpenAI } from "https://deno.land/x/openai@v4.28.4/mod.ts";
