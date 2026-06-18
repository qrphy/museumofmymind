import { Gallery } from "@/components/gallery";
import {
  getGalleryImages,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";

export default async function HomePage() {
  const configured = isCloudinaryConfigured();
  const images = configured ? await getGalleryImages() : [];

  return (
    <main className="site-shell">
      <header className="site-header">
        <h1>museum of my mind</h1>
        <span aria-hidden="true" className="site-mark">
          private index
        </span>
      </header>

      {images.length > 0 ? <Gallery images={images} /> : null}
      {configured && images.length === 0 ? (
        <p className="empty-state">The collection is being assembled.</p>
      ) : null}
      {!configured && process.env.NODE_ENV === "development" ? (
        <p className="setup-note">Add Cloudinary values to .env.local.</p>
      ) : null}
    </main>
  );
}
