"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useState } from "react";

import { Lightbox } from "@/components/lightbox";
import type { GalleryImage } from "@/lib/cloudinary";

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [desktopColumns, setDesktopColumns] = useState<4 | 6>(4);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(1);

  const imageSizes = `(max-width: 639px) ${mobileColumns === 1 ? "100vw" : "50vw"}, (max-width: 959px) 50vw, ${desktopColumns === 4 ? "25vw" : "17vw"}`;

  return (
    <>
      <div className="gallery-frame">
        <div aria-label="Gallery layout" className="layout-picker" role="group">
          <div className="layout-picker__options layout-picker__options--mobile">
            {[1, 2].map((columns) => (
              <LayoutButton
                active={mobileColumns === columns}
                columns={columns}
                key={columns}
                onClick={() => setMobileColumns(columns as 1 | 2)}
              />
            ))}
          </div>
          <div className="layout-picker__options layout-picker__options--desktop">
            {[4, 6].map((columns) => (
              <LayoutButton
                active={desktopColumns === columns}
                columns={columns}
                key={columns}
                onClick={() => setDesktopColumns(columns as 4 | 6)}
              />
            ))}
          </div>
        </div>

        <section
          aria-label="Image gallery"
          className="gallery"
          data-desktop-columns={desktopColumns}
          data-mobile-columns={mobileColumns}
        >
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
                sizes={imageSizes}
                src={image.src}
                width={image.width}
              />
            </button>
          ))}
        </section>
      </div>

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

function LayoutButton({
  active,
  columns,
  onClick,
}: {
  active: boolean;
  columns: number;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={`${columns} column layout`}
      aria-pressed={active}
      className="layout-picker__button"
      onClick={onClick}
      type="button"
    >
      <span aria-hidden="true" className="layout-picker__icon">
        {Array.from({ length: columns }, (_, index) => (
          <span key={index} />
        ))}
      </span>
      <span className="layout-picker__label">{columns}</span>
    </button>
  );
}
