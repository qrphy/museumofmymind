import { Gallery } from "@/components/gallery";
import {
  getGalleryPage,
  isCloudinaryConfigured,
} from "@/lib/cloudinary";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": ["CollectionPage", "ImageGallery"],
      "@id": `${SITE_URL}/#gallery`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      inLanguage: "en",
    },
  ],
};

export default async function HomePage() {
  const configured = isCloudinaryConfigured();
  const galleryPage = configured
    ? await getGalleryPage()
    : { images: [], nextOffset: 0, total: 0 };

  return (
    <main className="site-shell">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <header className="site-header">
        <h1>museum of my mind</h1>
        <span aria-hidden="true" className="site-mark">
          private index
        </span>
      </header>

      {galleryPage.images.length > 0 ? (
        <Gallery images={galleryPage.images} totalImages={galleryPage.total} />
      ) : null}
      {configured && galleryPage.total === 0 ? (
        <p className="empty-state">The collection is being assembled.</p>
      ) : null}
      {!configured && process.env.NODE_ENV === "development" ? (
        <p className="setup-note">Add Cloudinary values to .env.local.</p>
      ) : null}
    </main>
  );
}
