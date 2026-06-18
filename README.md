# museum of my mind

An image-only editorial gallery for [museumofmymind.com](https://museumofmymind.com).

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Copy the single **API environment variable** from Cloudinary **Settings → API Keys**:

```dotenv
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

Separate cloud name, API key, and API secret variables are also supported. Credentials are server-only. Never commit `.env.local`.

## Import from Photos

The importer reads the macOS Photos album named `museum of my mind`.

```bash
npm run photos:export
npm run photos:upload
```

The export is written to `.photos-export/`, which is ignored by Git. Uploads go to the Cloudinary asset folder `museum-of-my-mind`. The uploader accepts JPG, JPEG, PNG, WebP, HEIC, HEIF, GIF, TIF, and TIFF files and exits with an error if any upload fails.

## Quality checks

```bash
npm test -- --run
npm run lint
npm run typecheck
npm run build
```

## Deploy

1. Import `qrphy/museumofmymind` into Vercel.
2. Add all three Cloudinary variables to Preview and Production.
3. Verify the preview deployment.
4. Add `museumofmymind.com` and `www.museumofmymind.com` in Vercel Domains.
5. Configure the DNS records Vercel displays and choose one canonical hostname.
