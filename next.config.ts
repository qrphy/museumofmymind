import type { NextConfig } from "next";

function getCloudName(): string {
  if (process.env.CLOUDINARY_URL) {
    try {
      return new URL(process.env.CLOUDINARY_URL).hostname || "invalid";
    } catch {
      return "invalid";
    }
  }

  return process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "invalid";
}

const cloudName = getCloudName();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: `/${cloudName}/image/upload/**`,
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.museumofmymind.com" }],
        destination: "https://museumofmymind.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
