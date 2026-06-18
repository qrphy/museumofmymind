"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

import { Lightbox } from "@/components/lightbox";
import type { GalleryImage } from "@/lib/cloudinary";

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <section aria-label="Image gallery" className="gallery">
        {images.map((image, index) => (
          <button
            aria-label={`Open image ${index + 1} of ${images.length}`}
            className="gallery__item"
            key={image.id}
            onClick={() => setActiveIndex(index)}
            style={{ "--item-index": Math.min(index, 14) } as CSSProperties}
            type="button"
          >
            <Image
              alt={image.alt}
              className="gallery__image"
              height={image.height}
              preload={index === 0}
              sizes="(max-width: 639px) 100vw, (max-width: 959px) 50vw, (max-width: 1439px) 33vw, 25vw"
              src={image.src}
              width={image.width}
            />
          </button>
        ))}
      </section>

      {activeIndex !== null ? (
        <Lightbox
          activeIndex={activeIndex}
          images={images}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
        />
      ) : null}
    </>
  );
}
