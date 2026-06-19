import type { NextRequest } from "next/server";

import { getGalleryPage } from "@/lib/cloudinary";

export async function GET(request: NextRequest) {
  const rawOffset = request.nextUrl.searchParams.get("offset") ?? "0";
  const offset = Number(rawOffset);

  if (!Number.isSafeInteger(offset) || offset < 0) {
    return Response.json({ error: "Invalid offset" }, { status: 400 });
  }

  const page = await getGalleryPage(offset);

  return Response.json(page, {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
