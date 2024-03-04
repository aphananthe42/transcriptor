import { GetObjectCommand, PutObjectCommand, S3Client } from "../deps.ts";
import { AmazonS3URI } from "../deps.ts";

export class S3Service {
  private shared: S3Client;

  constructor() {
    this.shared = new S3Client({
      region: Deno.env.get("AWS_REGION") ?? "",
      credentials: {
        accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") ?? "",
        secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "",
      },
    });
  }

  async putObject(
    key: string,
    body: Uint8Array,
    mimeType: string,
  ) {
    const params = new PutObjectCommand({
      Bucket: Deno.env.get("AWS_S3_BUCKET_NAME"),
      Key: key,
      Body: body,
      ContentType: mimeType,
    });
    await this.shared.send(params);
  }

  async getObject(transcriptFileUri: string) {
    const { region, bucket, key } = AmazonS3URI(transcriptFileUri);
    const params = new GetObjectCommand({
      Bucket: Deno.env.get("AWS_S3_BUCKET_NAME"),
      Key: key ?? "",
    });
    return await this.shared.send(params);
  }
}
