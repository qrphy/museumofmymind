import "server-only";

import { v2 as cloudinary } from "cloudinary";
import { unstable_cache } from "next/cache";

import { resolveCloudinaryConfig } from "@/lib/cloudinary-config";

export type GalleryImage = {
  id: string;
  publicId: string;
  width: number;
  height: number;
  alt: string;
  src: string;
};

type CloudinaryResource = {
  asset_id: string;
  public_id: string;
  width: number;
  height: number;
  secure_url: string;
  created_at?: string;
  resource_type?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCloudinaryResource(resource: unknown): resource is CloudinaryResource {
  if (!isRecord(resource)) return false;

  return (
    typeof resource.asset_id === "string" &&
    resource.asset_id.length > 0 &&
    typeof resource.public_id === "string" &&
    resource.public_id.length > 0 &&
    Number.isInteger(resource.width) &&
    Number(resource.width) > 0 &&
    Number.isInteger(resource.height) &&
    Number(resource.height) > 0 &&
    typeof resource.secure_url === "string" &&
    (resource.resource_type === undefined || resource.resource_type === "image")
  );
}

function buildDeliveryUrl(secureUrl: string): string | null {
  try {
    const url = new URL(secureUrl);

    if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
      return null;
    }

    if (!url.pathname.includes("/image/upload/")) return null;

    url.pathname = url.pathname.replace(
      "/image/upload/",
      "/image/upload/f_auto,q_auto,c_limit,w_2400/",
    );

    return url.toString();
  } catch {
    return null;
  }
}

export function normalizeResource(resource: unknown): GalleryImage | null {
  if (!isCloudinaryResource(resource)) return null;

  const src = buildDeliveryUrl(resource.secure_url);
  if (!src) return null;

  return {
    id: resource.asset_id,
    publicId: resource.public_id,
    width: resource.width,
    height: resource.height,
    alt: "",
    src,
  };
}

export function sortCloudinaryResources<T extends Record<string, unknown>>(
  resources: T[],
): T[] {
  return resources.toSorted((left, right) => {
    const leftDate = typeof left.created_at === "string" ? left.created_at : "";
    const rightDate = typeof right.created_at === "string" ? right.created_at : "";
    const dateOrder = rightDate.localeCompare(leftDate);

    if (dateOrder !== 0) return dateOrder;

    const leftId = typeof left.public_id === "string" ? left.public_id : "";
    const rightId = typeof right.public_id === "string" ? right.public_id : "";
    return leftId.localeCompare(rightId);
  });
}

export function isCloudinaryConfigured(): boolean {
  try {
    resolveCloudinaryConfig(process.env);
    return true;
  } catch {
    return false;
  }
}

function configureCloudinary(): void {
  const { cloudName, apiKey, apiSecret } = resolveCloudinaryConfig(process.env);

  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
}

async function fetchGalleryImages(): Promise<GalleryImage[]> {
  configureCloudinary();

  const response = await cloudinary.api.resources_by_asset_folder(
    "museum-of-my-mind",
    {
      max_results: 500,
      resource_type: "image",
      type: "upload",
    },
  );

  const resources = Array.isArray(response.resources) ? response.resources : [];

  return sortCloudinaryResources(resources)
    .map(normalizeResource)
    .filter((image): image is GalleryImage => image !== null);
}

const getCachedGalleryImages = unstable_cache(
  fetchGalleryImages,
  ["cloudinary-gallery"],
  { revalidate: 3600 },
);

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return getCachedGalleryImages();
}
