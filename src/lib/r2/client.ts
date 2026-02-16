import { S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (client) {
    return client;
  }

  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing required R2 credentials");
  }

  client = new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return client;
}

export function getR2Bucket(): string {
  const bucket = process.env.R2_BUCKET;
  if (!bucket) {
    throw new Error("Missing R2_BUCKET");
  }
  return bucket;
}
