"use client";

import ReactDOM from "react-dom";

const CLOUDINARY_ORIGIN = "https://res.cloudinary.com";

export function PreloadResources() {
  ReactDOM.preconnect(CLOUDINARY_ORIGIN, { crossOrigin: "anonymous" });
  ReactDOM.prefetchDNS(CLOUDINARY_ORIGIN);

  return null;
}
