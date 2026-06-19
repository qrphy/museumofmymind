import { createHash } from "node:crypto";
import { readFile, readdir, stat } from "node:fs/promises";
import { basename, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { v2 as cloudinary, type UploadApiOptions } from "cloudinary";

import { resolveCloudinaryConfig } from "../src/lib/cloudinary-config";

export const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".heic",
  ".heif",
  ".gif",
  ".tif",
  ".tiff",
]);

const MAX_FREE_IMAGE_BYTES = 10 * 1024 * 1024;

export const EAGER_IMAGE_WIDTHS = [384, 828, 1200, 1920] as const;
export const EAGER_TRANSFORMATIONS = EAGER_IMAGE_WIDTHS.flatMap((width) => [
  `f_avif,q_auto:good,c_limit,w_${width}`,
  `f_webp,fl_awebp,q_auto:good,c_limit,w_${width}`,
  `f_jpg,q_auto:good,c_limit,w_${width}`,
]);

export type UploadSummary = {
  uploaded: number;
  failed: number;
  skipped: number;
};

export type UploadFile = (
  pathname: string,
  options: UploadApiOptions,
) => Promise<unknown>;

export class UploadBatchError extends Error {
  constructor(
    message: string,
    public readonly summary: UploadSummary,
  ) {
    super(message);
    this.name = "UploadBatchError";
  }
}

export function isSupportedImage(pathname: string): boolean {
  return SUPPORTED_EXTENSIONS.has(extname(pathname).toLowerCase());
}

function formatUploadError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error !== "object" || error === null) return "unknown upload error";

  const record = error as Record<string, unknown>;
  const nested =
    typeof record.error === "object" && record.error !== null
      ? (record.error as Record<string, unknown>)
      : record;
  const message =
    typeof nested.message === "string" ? nested.message : "unknown upload error";
  const httpCode =
    typeof nested.http_code === "number" ? ` (HTTP ${nested.http_code})` : "";

  return `${message}${httpCode}`;
}

export async function listImageFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const pathname = join(root, entry.name);
    if (entry.isDirectory()) files.push(...(await listImageFiles(pathname)));
    if (entry.isFile() && isSupportedImage(pathname)) files.push(pathname);
  }

  return files;
}

async function buildPublicId(pathname: string): Promise<string> {
  const content = await readFile(pathname);
  const stem = basename(pathname, extname(pathname))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "asset";
  const hash = createHash("sha256").update(content).digest("hex").slice(0, 10);
  return `${stem}-${hash}`;
}

const cloudinaryUploader: UploadFile = (pathname, options) =>
  cloudinary.uploader.upload(pathname, options);

export async function uploadDirectory(
  root: string,
  uploader: UploadFile = cloudinaryUploader,
): Promise<UploadSummary> {
  const files = await listImageFiles(root);
  const summary: UploadSummary = { uploaded: 0, failed: 0, skipped: 0 };
  const failures: string[] = [];

  for (const pathname of files) {
    const file = await stat(pathname);
    if (file.size > MAX_FREE_IMAGE_BYTES) {
      summary.skipped += 1;
      failures.push(`${pathname} exceeds the 10 MB Cloudinary Free image limit`);
      continue;
    }

    try {
      const publicId = await buildPublicId(pathname);
      await uploader(pathname, {
        asset_folder: "museum-of-my-mind",
        eager: EAGER_TRANSFORMATIONS,
        eager_async: true,
        public_id: publicId,
        resource_type: "image",
        unique_filename: true,
        use_filename: true,
      });
      summary.uploaded += 1;
    } catch (error) {
      summary.failed += 1;
      failures.push(`${pathname}: ${formatUploadError(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new UploadBatchError(failures.join("\n"), summary);
  }

  return summary;
}

function configureCloudinary(): void {
  const { cloudName, apiKey, apiSecret } = resolveCloudinaryConfig(process.env);

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

async function main(): Promise<void> {
  configureCloudinary();
  const root = resolve(process.argv[2] ?? ".photos-export");
  const files = await listImageFiles(root);
  console.log(`Found ${files.length} supported image files in ${root}`);

  try {
    const summary = await uploadDirectory(root);
    console.log(`Uploaded ${summary.uploaded}; skipped ${summary.skipped}; failed 0.`);
  } catch (error) {
    if (error instanceof UploadBatchError) {
      console.error(error.message);
      console.error(
        `Uploaded ${error.summary.uploaded}; skipped ${error.summary.skipped}; failed ${error.summary.failed}.`,
      );
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  }
}

const entrypoint = process.argv[1]
  ? pathToFileURL(resolve(process.argv[1])).href
  : "";

if (import.meta.url === entrypoint) {
  void main();
}
