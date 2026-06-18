import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-display",
  weight: ["400"],
});

const utility = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-utility",
  weight: ["400"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://museumofmymind.com"),
  title: "museum of my mind",
  description: "A personal collection of images, notes, and fragments.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "museum of my mind",
    description: "A personal collection of images, notes, and fragments.",
    type: "website",
    url: "/",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${display.variable} ${utility.variable}`} lang="en">
      <body>{children}</body>
    </html>
  );
}
