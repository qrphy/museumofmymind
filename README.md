# museum of my mind

A quiet, image-only archive for photographs, visual notes, and fragments collected over time.

[Visit museumofmymind.com](https://museumofmymind.com)

## Features

- Responsive gallery with selectable column layouts
- Full-screen lightbox with keyboard, touch, and button navigation
- Incremental loading tuned to the visitor's connection
- Responsive Cloudinary image delivery and nearby-image prefetching
- Accessible controls, focus handling, and reduced-motion support
- SEO metadata, structured data, sitemap, and social images
- Google Analytics, Vercel Analytics, and Speed Insights

## Stack

- Next.js 16 with the App Router and Turbopack
- React 19 and TypeScript
- Cloudinary for image storage and delivery
- Vitest, Testing Library, and Playwright
- Vercel for hosting and analytics

## How it works

The home page fetches the first image batch from Cloudinary on the server. As the visitor scrolls, the gallery requests additional batches from `/api/gallery`. Cloudinary transformations resize and encode each image for its rendered width. The lightbox preloads adjacent images when the network connection allows it.

## Local development

Requirements:

- Node.js 20.9 or newer
- npm
- A Cloudinary account
- macOS with Photos access for the optional import workflow

```bash
git clone https://github.com/qrphy/museumofmymind.git
cd museumofmymind
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

The shortest Cloudinary setup uses the API environment variable from **Cloudinary → Settings → API Keys**:

```dotenv
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

You can replace `CLOUDINARY_URL` with separate credentials:

```dotenv
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` is optional. The application loads GA4 only when you provide a measurement ID. Never commit `.env.local`.

## Importing photos

The importer reads the macOS Photos album named `museum of my mind`.

```bash
npm run photos:export
npm run photos:upload
```

The export command writes files to the ignored `.photos-export/` directory. The upload command sends JPG, JPEG, PNG, WebP, HEIC, HEIF, GIF, TIF, and TIFF files to the `museum-of-my-mind` Cloudinary asset folder. It exits with an error if any upload fails.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Serve the production build |
| `npm test -- --run` | Run unit and component tests once |
| `npm run test:e2e` | Run Playwright end-to-end tests |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Check TypeScript types |
| `npm run photos:export` | Export the configured Photos album |
| `npm run photos:upload` | Upload exported images to Cloudinary |

## Deployment

1. Import the repository into Vercel.
2. Add the Cloudinary credentials and optional GA4 measurement ID to the project environment variables.
3. Deploy and verify the preview URL.
4. Add `museumofmymind.com` and `www.museumofmymind.com` under Vercel Domains.
5. Apply Vercel's DNS records. The application redirects `www` to the apex domain.
