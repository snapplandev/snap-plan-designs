import { randomUUID } from "node:crypto";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getR2Bucket, getR2Client } from "@/lib/r2/client";

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.\-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export function buildProjectStoragePath(projectId: string, fileName: string): string {
  return `projects/${projectId}/${randomUUID()}-${sanitizeFileName(fileName)}`;
}

export async function createPresignedUploadUrl(input: {
  storagePath: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: getR2Bucket(),
    Key: input.storagePath,
    ContentType: input.contentType,
  });

  return getSignedUrl(getR2Client(), command, {
    expiresIn: input.expiresInSeconds ?? 15 * 60,
  });
}
