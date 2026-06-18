import type { MetadataRoute } from "next";

import {
  getGalleryImages,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const images = isCloudinaryConfigured() ? await getGalleryImages() : [];

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
      images: images.map((image) => image.src),
    },
  ];
}
