// @vitest-environment node

import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  UploadBatchError,
  isSupportedImage,
  listImageFiles,
  uploadDirectory,
} from "./upload-cloudinary";

const temporaryDirectories: string[] = [];

async function createTemporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(join(tmpdir(), "museum-upload-"));
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

describe("isSupportedImage", () => {
  it.each(["photo.JPG", "scan.jpeg", "note.PNG", "memory.HeIc", "page.tiff"])(
    "accepts supported image extension %s case-insensitively",
    (pathname) => expect(isSupportedImage(pathname)).toBe(true),
  );

  it.each(["video.mov", "metadata.json", "README"])(
    "rejects unsupported file %s",
    (pathname) => expect(isSupportedImage(pathname)).toBe(false),
  );
});

describe("listImageFiles", () => {
  it("discovers nested images in stable order and skips other files", async () => {
    const root = await createTemporaryDirectory();
    await mkdir(join(root, "nested"));
    await Promise.all([
      writeFile(join(root, "z.jpg"), "z"),
      writeFile(join(root, "a.txt"), "a"),
      writeFile(join(root, "nested", "B.PNG"), "b"),
    ]);

    expect(await listImageFiles(root)).toEqual([
      join(root, "nested", "B.PNG"),
      join(root, "z.jpg"),
    ]);
  });
});

describe("uploadDirectory", () => {
  it("uploads every supported file with duplicate-safe folder options", async () => {
    const root = await createTemporaryDirectory();
    await Promise.all([
      writeFile(join(root, "one.jpg"), "one"),
      writeFile(join(root, "two.png"), "two"),
    ]);
    const uploader = vi.fn().mockResolvedValue(undefined);

    await expect(uploadDirectory(root, uploader)).resolves.toEqual({
      uploaded: 2,
      failed: 0,
      skipped: 0,
    });
    expect(uploader).toHaveBeenCalledTimes(2);
    expect(uploader).toHaveBeenCalledWith(
      join(root, "one.jpg"),
      expect.objectContaining({
        asset_folder: "museum-of-my-mind",
        unique_filename: true,
        use_filename: true,
      }),
    );
  });

  it("throws a batch error when any upload fails", async () => {
    const root = await createTemporaryDirectory();
    await writeFile(join(root, "broken.jpg"), "broken");
    const uploader = vi.fn().mockRejectedValue(new Error("upload rejected"));

    const error = await uploadDirectory(root, uploader).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(UploadBatchError);
    expect((error as UploadBatchError).summary).toEqual({
      uploaded: 0,
      failed: 1,
      skipped: 0,
    });
  });

  it("preserves Cloudinary errors returned as plain objects", async () => {
    const root = await createTemporaryDirectory();
    await writeFile(join(root, "broken.jpg"), "broken");
    const uploader = vi.fn().mockRejectedValue({
      error: { message: "cloud_name mismatch", http_code: 401 },
    });

    await expect(uploadDirectory(root, uploader)).rejects.toThrow(
      "cloud_name mismatch (HTTP 401)",
    );
  });
});
