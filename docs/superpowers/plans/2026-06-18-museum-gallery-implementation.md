# Museum of My Mind — Implementation Plan

## Goal

Build and deploy an image-only editorial masonry gallery at `museumofmymind.com`, export 171 assets from the macOS Photos album, and serve them through Cloudinary.

## Why

The site needs a quiet, maintainable home for a personal image collection without committing large binaries to Git or introducing a CMS.

## Architecture

Next.js 16 App Router renders a server page. A server-only Cloudinary module lists image assets in the `museum-of-my-mind` asset folder, normalizes width/height metadata, and returns delivery URLs. A client gallery renders natural-ratio images in CSS columns and owns the accessible lightbox state. A one-time macOS AppleScript exports the Photos album; a TypeScript CLI uploads supported files to Cloudinary. Secrets remain in `.env.local` and Vercel environment variables.

Cloudinary's Admin API is called only on the server and cached with a one-hour revalidation window. Browser code receives only public asset metadata and delivery URLs.

## File Map

| File | Action | Purpose |
|---|---|---|
| `package.json` | create | Next.js scripts and dependencies |
| `next.config.ts` | create | Restrict remote images to Cloudinary |
| `.env.example` | create | Document required environment names |
| `.gitignore` | create | Exclude secrets, build output, and exported originals |
| `src/app/layout.tsx` | create | Metadata, font, and global page shell |
| `src/app/page.tsx` | create | Fetch and render gallery assets |
| `src/app/globals.css` | create | Editorial visual system and masonry layout |
| `src/lib/cloudinary.ts` | create | Server-only asset query and URL generation |
| `src/lib/cloudinary.test.ts` | create | Asset normalization tests |
| `src/components/gallery.tsx` | create | Gallery controls and lightbox state |
| `src/components/lightbox.tsx` | create | Accessible centered image viewer |
| `src/components/lightbox.test.tsx` | create | Keyboard, focus, and close behavior tests |
| `scripts/export-photos.applescript` | create | Export the named Photos album |
| `scripts/upload-cloudinary.ts` | create | Bulk-upload exported images |
| `scripts/upload-cloudinary.test.ts` | create | File filtering and public-ID tests |
| `vitest.config.ts` | create | jsdom test environment |
| `vitest.setup.ts` | create | Testing Library matchers |
| `README.md` | create | Local setup, import, deploy, and update workflow |

## Tasks

### 1. Scaffold the Next.js application

**Files:** `package.json`, `tsconfig.json`, `next-env.d.ts`, `eslint.config.mjs`, `next.config.ts`, `.gitignore`, `.env.example`

**Steps:**

- [ ] Initialize Next.js 16 with TypeScript, App Router, `src/`, ESLint, npm, and import alias `@/*`.
- [ ] Add `cloudinary`, `tsx`, `vitest`, `jsdom`, and Testing Library dependencies.
- [ ] Add `test`, `test:watch`, `typecheck`, `photos:export`, and `photos:upload` scripts.
- [ ] Permit only `https://res.cloudinary.com/<cloud-name>/image/upload/**` in `remotePatterns`.
- [ ] Ignore `.env*` except `.env.example` and ignore `.photos-export/`.
- [ ] Document `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` without values.

**Configuration contract:**

```ts
import type { NextConfig } from "next";

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "invalid";

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
};

export default nextConfig;
```

**Test:** Confirm `npm run typecheck`, `npm run lint`, and `npm test -- --run` exit successfully in the empty scaffold.

**Verify:** `npm run typecheck && npm run lint && npm test -- --run`

### 2. Implement the server-only Cloudinary boundary

**Files:** `src/lib/cloudinary.ts`, `src/lib/cloudinary.test.ts`

**Steps:**

- [ ] Add `import "server-only"` and validate all three environment variables with actionable errors.
- [ ] Define the serializable `GalleryImage` type: `id`, `publicId`, `width`, `height`, `alt`, and `src`.
- [ ] Normalize only valid image resources with positive integer dimensions.
- [ ] List up to 500 resources with `resources_by_asset_folder("museum-of-my-mind")`.
- [ ] Sort consistently by `created_at` descending, with `public_id` as the tie-breaker.
- [ ] Generate Cloudinary URLs using `f_auto,q_auto,c_limit,w_2400` without changing aspect ratio.
- [ ] Wrap the server query with `unstable_cache` and a 3600-second revalidation interval.

**Public contract:**

```ts
export type GalleryImage = {
  id: string;
  publicId: string;
  width: number;
  height: number;
  alt: string;
  src: string;
};

export function normalizeResource(resource: unknown): GalleryImage | null;
export async function getGalleryImages(): Promise<GalleryImage[]>;
```

**Test:** Assert malformed assets are discarded, dimensions remain intact, URLs include non-cropping transformations, and sorting is deterministic.

**Verify:** `npm test -- --run src/lib/cloudinary.test.ts && npm run typecheck`

### 3. Build the gallery page shell

**Files:** `src/app/layout.tsx`, `src/app/page.tsx`

**Steps:**

- [ ] Set title, description, canonical URL, Open Graph URL, and robots metadata.
- [ ] Load a restrained serif/sans pairing through `next/font` without remote runtime requests.
- [ ] Render a minimal `museum of my mind` header and pass server-fetched assets to `Gallery`.
- [ ] Render a clear setup message only when Cloudinary configuration is missing in local development.
- [ ] Render a quiet empty state when the configured Cloudinary folder contains no images.

**Page contract:**

```tsx
import { Gallery } from "@/components/gallery";
import { getGalleryImages } from "@/lib/cloudinary";

export default async function HomePage() {
  const images = await getGalleryImages();

  return (
    <main>
      <header className="site-header">
        <h1>museum of my mind</h1>
      </header>
      <Gallery images={images} />
    </main>
  );
}
```

**Test:** Add a page smoke assertion through the production build; no browser secret or Admin API URL may appear in emitted client chunks.

**Verify:** `npm run build && ! rg "CLOUDINARY_API_SECRET|api.cloudinary.com" .next/static`

### 4. Implement the natural-ratio masonry gallery

**Files:** `src/components/gallery.tsx`, `src/app/globals.css`

**Steps:**

- [ ] Render semantic buttons containing `next/image` elements with their real width and height.
- [ ] Use CSS multi-column layout with 1/2/3/4 columns at mobile/tablet/laptop/wide breakpoints.
- [ ] Apply `break-inside: avoid`, responsive column gaps, and bottom spacing without fixed card heights.
- [ ] Set `sizes` for each breakpoint and preload only the first prominent image.
- [ ] Add restrained opacity/translate entry motion and hover zoom; disable both under reduced motion.
- [ ] Keep the DOM order identical to Cloudinary sort order.

**Component contract:**

```tsx
import type { ReactElement } from "react";
import type { GalleryImage } from "@/lib/cloudinary";

export declare function Gallery(props: {
  images: GalleryImage[];
}): ReactElement;
```

**Test:** Assert every source image becomes one keyboard-focusable item and retains its supplied intrinsic width/height.

**Verify:** `npm test -- --run && npm run build`

### 5. Implement the accessible centered lightbox

**Files:** `src/components/lightbox.tsx`, `src/components/lightbox.test.tsx`, `src/components/gallery.tsx`

**Steps:**

- [ ] Open the selected image in a portal-backed dialog centered within viewport-safe margins.
- [ ] Constrain the image with `max-width` and `max-height` while preserving natural proportions.
- [ ] Close via backdrop, visible close button, and Escape.
- [ ] Navigate with ArrowLeft/ArrowRight and visible previous/next controls.
- [ ] Add touch swipe navigation only after a 50px horizontal threshold.
- [ ] Lock body scroll, focus the close button on open, and restore focus to the triggering item on close.
- [ ] Label dialog and controls for screen readers.

**Component contract:**

```tsx
import type { ReactPortal } from "react";
import type { GalleryImage } from "@/lib/cloudinary";

type LightboxProps = {
  images: GalleryImage[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

export declare function Lightbox(props: LightboxProps): ReactPortal | null;
```

**Test:** Assert open/close, Escape, backdrop close, arrow navigation wrapping, focus restoration, body scroll restoration, and accessible names.

**Verify:** `npm test -- --run src/components/lightbox.test.tsx && npm run typecheck`

### 6. Create and test the Photos-to-Cloudinary importer

**Files:** `scripts/export-photos.applescript`, `scripts/upload-cloudinary.ts`, `scripts/upload-cloudinary.test.ts`

**Steps:**

- [ ] Export the exact Photos album name `museum of my mind` to `.photos-export/` using originals.
- [ ] Fail clearly if the album is absent or empty.
- [ ] Discover `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.heif`, `.gif`, and `.tif` files case-insensitively.
- [ ] Reject files over Cloudinary's applicable account limit before upload and report their paths.
- [ ] Upload sequentially in small batches to avoid rate-limit spikes.
- [ ] Use `asset_folder: "museum-of-my-mind"`, `use_filename: true`, and `unique_filename: true` so duplicate names cannot overwrite assets.
- [ ] Print uploaded, skipped, and failed counts; exit non-zero if any upload fails.

**Uploader contract:**

```ts
export const SUPPORTED_EXTENSIONS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif", ".gif", ".tif",
]);

export function isSupportedImage(pathname: string): boolean;
export async function listImageFiles(root: string): Promise<string[]>;
export async function uploadDirectory(root: string): Promise<void>;
```

**Test:** Assert extension filtering is case-insensitive, nested files are discovered in stable order, unsupported files are skipped, and upload failures produce a failing exit status through an injected uploader.

**Verify:** `npm test -- --run scripts/upload-cloudinary.test.ts && npm run typecheck`

### 7. Import the 171-image collection

**Files:** `.env.local` (local only), `.photos-export/` (ignored temporary data), Cloudinary `museum-of-my-mind` folder

**Steps:**

- [ ] Ask the user to place Cloudinary values in `.env.local`; never request the API secret in chat.
- [ ] Run `npm run photos:export` with explicit macOS Photos automation approval.
- [ ] Confirm the export count is 171 before external upload.
- [ ] Inspect file sizes and dimensions; re-export or resize only files rejected by the account limits.
- [ ] Run `npm run photos:upload` after count confirmation.
- [ ] Query Cloudinary and confirm 171 valid image assets exist in the target folder.
- [ ] Remove `.photos-export/` only after Cloudinary count and sample delivery checks pass.

**Test:** Compare Photos album count, export file count, successful upload count, and Cloudinary folder count; all must equal 171.

**Verify:** `npm run photos:export && npm run photos:upload && npm run build`

### 8. Run visual, accessibility, and performance verification

**Files:** application files only if a verified defect requires correction

**Steps:**

- [ ] Verify responsive layouts at 390px, 768px, 1280px, and 1600px.
- [ ] Verify portrait, landscape, square, very tall, and very wide assets retain their ratios.
- [ ] Exercise lightbox with mouse, keyboard, and touch emulation.
- [ ] Run accessibility checks for dialog semantics, focus order, labels, contrast, and reduced motion.
- [ ] Confirm below-fold images lazy-load and the initial page does not request full-resolution originals.
- [ ] Check for console errors and failed Cloudinary requests.

**Test:** All automated tests, lint, typecheck, and production build pass; browser checks produce no critical accessibility violations.

**Verify:** `npm test -- --run && npm run lint && npm run typecheck && npm run build`

### 9. Publish through GitHub, Vercel, and the custom domain

**Files:** `README.md`, Vercel project configuration, DNS records

**Steps:**

- [ ] Initialize or connect the local directory to `qrphy/museumofmymind` without overwriting remote work.
- [ ] Push the verified source while confirming `.env.local` and `.photos-export/` are absent from Git.
- [ ] Import the repository into Vercel.
- [ ] Add all three Cloudinary environment variables to Preview and Production.
- [ ] Verify the Vercel preview before assigning the production domain.
- [ ] Add `museumofmymind.com` and `www.museumofmymind.com`; follow Vercel's displayed DNS records at the domain registrar.
- [ ] Choose one canonical hostname and redirect the other.
- [ ] Verify HTTPS, metadata, gallery loading, and lightbox interaction on production.

**Test:** `git status` contains no secrets or exported assets; preview and production return HTTP 200 and render the expected Cloudinary asset count.

**Verify:** `git status --short && npm run build`

## Risks

- Photos automation may be denied by macOS → request explicit Automation/Photos permission and retain manual Photos export as a bounded fallback.
- Some originals may exceed Cloudinary Free limits (10 MB or 25 MP) → audit before upload and create visually lossless web-sized exports only for rejected assets.
- CSS columns visually flow top-to-bottom by column rather than row-by-row → retain DOM order and validate the resulting editorial rhythm with the real collection.
- Cloudinary Admin API is rate-limited → cache the server result for one hour and never query once per image.
- Cloudinary free credits combine storage, transformation, and bandwidth → use capped responsive derivatives and monitor the dashboard after launch.
- The remote GitHub repository may contain work absent locally → fetch and inspect before scaffolding; merge non-destructively.

## Out of Scope

- Captions, dates, categories, search, likes, accounts, comments, and an administrative CMS.
- Editing or deleting Cloudinary assets from the public site.
- Automatic continuous synchronization with the Photos application.
- Analytics and visitor tracking.

## Scope

**M (1–3 days)** including image import, browser verification, Vercel deployment, and DNS propagation checks.
