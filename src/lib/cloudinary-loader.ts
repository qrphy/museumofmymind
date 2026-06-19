"use client";

type CloudinaryLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps): string {
  try {
    const url = new URL(src);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "res.cloudinary.com" ||
      !url.pathname.includes("/image/upload/")
    ) {
      return src;
    }

    const transformation = [
      "f_auto",
      quality ? `q_${quality}` : "q_auto:good",
      "c_limit",
      `w_${width}`,
    ].join(",");

    url.pathname = url.pathname.replace(
      "/image/upload/",
      `/image/upload/${transformation}/`,
    );

    return url.toString();
  } catch {
    return src;
  }
}
