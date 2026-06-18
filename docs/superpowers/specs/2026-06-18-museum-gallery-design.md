# Museum of My Mind — Gallery Design

## Goal

Publish the images in the macOS Photos album named `museum of my mind` at
`museumofmymind.com` as a quiet, image-only editorial gallery.

## Chosen Approach

- Build the site with Next.js and deploy it on Vercel.
- Store and deliver the gallery images through Cloudinary.
- Keep the interface image-only: no captions, dates, categories, likes, or accounts.
- Render images in a responsive masonry layout while preserving each asset's natural
  aspect ratio.
- Open a selected image in a centered, enlarged lightbox without cropping it.

## Approaches Considered

### Cloudinary

Chosen because it provides bulk asset management, CDN delivery, responsive image
transformations, and modern output formats without adding a full CMS.

### Vercel Blob

Rejected for the initial version because its Hobby storage allowance may be tight for
171 original images and it offers fewer image-management capabilities.

### Sanity

Rejected because a structured CMS is unnecessary for an image-only gallery.

## Visual Direction

- White background.
- Minimal wordmark/header: `museum of my mind`.
- Generous whitespace and restrained typography.
- Responsive masonry columns rather than fixed-size cards.
- No visible card chrome, borders, metadata, or Pinterest-style controls.
- Images retain their intrinsic proportions.
- Subtle entry and hover motion that does not compete with the artwork.

## Interaction

- Selecting an image opens a modal lightbox over a softly dimmed backdrop.
- The enlarged image stays centered and is constrained to the viewport.
- Close via backdrop click/tap, close control, or Escape.
- Navigate between images with keyboard arrows and touch-friendly controls.
- Lock page scrolling while the lightbox is open and return focus when it closes.
- Respect reduced-motion preferences.

## Image Pipeline

1. Export assets from the macOS Photos album `museum of my mind` with user-approved
   Photos automation access.
2. Upload them in bulk to a dedicated Cloudinary folder.
3. Preserve originals in Cloudinary while serving transformed responsive derivatives.
4. Keep Cloudinary API credentials in local/Vercel environment variables; never commit
   secrets to Git.
5. Generate a gallery manifest at build time from Cloudinary assets, including width,
   height, public ID, and delivery URL.

The gallery should remain deployable even if Cloudinary's administrative API is not
available to the browser. Only public delivery URLs are exposed client-side.

## Performance

- Use responsive `srcset` sizes and automatic format/quality selection.
- Lazy-load below-the-fold images.
- Reserve layout space from Cloudinary width/height metadata to avoid layout shift.
- Prioritize only the first viewport's most important images.
- Avoid loading all full-resolution originals on the gallery page.

## Accessibility

- Every gallery item is keyboard reachable.
- The lightbox uses dialog semantics, focus management, and an accessible close label.
- Images use neutral fallback alt text because no captions are currently provided.
- Controls meet touch-target and contrast requirements.

## File Map

- `app/page.tsx`: gallery page and server-side asset loading.
- `app/layout.tsx`: metadata, fonts, and global shell.
- `app/globals.css`: visual system and masonry layout.
- `components/gallery.tsx`: responsive gallery interaction.
- `components/lightbox.tsx`: modal viewing and navigation.
- `lib/cloudinary.ts`: server-only Cloudinary asset query and URL helpers.
- `scripts/import-photos-to-cloudinary.*`: one-time export/upload workflow.
- `.env.example`: environment variable names without secrets.

## Deployment

- Connect the GitHub repository to Vercel.
- Configure Cloudinary credentials as Vercel environment variables.
- Point `museumofmymind.com` to the Vercel project after preview verification.

## Open Operational Inputs

- Cloudinary cloud name, API key, and API secret must be added locally by the user or
  through a secure environment configuration flow.
- macOS will require explicit approval before Photos automation/export can run.

