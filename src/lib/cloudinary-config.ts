export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

type CloudinaryEnvironment = Readonly<Record<string, string | undefined>>;

export function resolveCloudinaryConfig(
  environment: CloudinaryEnvironment,
): CloudinaryConfig {
  if (environment.CLOUDINARY_URL) {
    const url = new URL(environment.CLOUDINARY_URL);
    if (url.protocol !== "cloudinary:" || !url.username || !url.password || !url.hostname) {
      throw new Error("CLOUDINARY_URL is malformed");
    }

    return {
      cloudName: url.hostname,
      apiKey: decodeURIComponent(url.username),
      apiSecret: decodeURIComponent(url.password),
    };
  }

  const cloudName = environment.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = environment.CLOUDINARY_API_KEY;
  const apiSecret = environment.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are missing");
  }

  return { cloudName, apiKey, apiSecret };
}
