"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Lightbox } from "@/components/lightbox";
import type { GalleryImage } from "@/lib/cloudinary";
import { getGalleryLoadMargin } from "@/lib/connection";
import {
  getGalleryImageSizes,
  IMAGE_PLACEHOLDER,
} from "@/lib/image-delivery";

type GalleryPageResponse = {
  images: GalleryImage[];
  nextOffset: number;
  total: number;
};

export function Gallery({
  images: initialImages,
  totalImages = initialImages.length,
}: {
  images: GalleryImage[];
  totalImages?: number;
}) {
  const [images, setImages] = useState(initialImages);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [desktopColumns, setDesktopColumns] = useState<4 | 6>(4);
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(1);
  const [nextOffset, setNextOffset] = useState(initialImages.length);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const loadMarkerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const imageSizes = getGalleryImageSizes(mobileColumns, desktopColumns);
  const hasMore = nextOffset < totalImages;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || nextOffset >= totalImages) return;

    loadingRef.current = true;
    setIsLoading(true);
    setLoadError(false);

    try {
      const response = await fetch(`/api/gallery?offset=${nextOffset}`);
      if (!response.ok) throw new Error(`Gallery request failed: ${response.status}`);

      const page = (await response.json()) as GalleryPageResponse;
      setImages((currentImages) => {
        const existingIds = new Set(currentImages.map((image) => image.id));
        const newImages = page.images.filter((image) => !existingIds.has(image.id));
        return [...currentImages, ...newImages];
      });
      setNextOffset(page.nextOffset);
    } catch {
      setLoadError(true);
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [nextOffset, totalImages]);

  useEffect(() => {
    const marker = loadMarkerRef.current;
    if (!marker || !hasMore || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) void loadMore();
      },
      { rootMargin: getGalleryLoadMargin(window.navigator) },
    );

    observer.observe(marker);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

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
              aria-label={`Open image ${index + 1} of ${totalImages}`}
              className="gallery__item"
              key={image.id}
              onClick={() => setActiveIndex(index)}
              style={{ "--item-index": Math.min(index, 14) } as CSSProperties}
              type="button"
            >
              <Image
                alt={image.alt}
                className="gallery__image"
                blurDataURL={IMAGE_PLACEHOLDER}
                height={image.height}
                placeholder="blur"
                preload={index === 0}
                sizes={imageSizes}
                src={image.src}
                width={image.width}
              />
            </button>
          ))}
        </section>

        {hasMore || isLoading || loadError ? (
          <div className="gallery-loader" ref={loadMarkerRef}>
            <button
              className="gallery-loader__button"
              disabled={isLoading}
              onClick={() => void loadMore()}
              type="button"
            >
              {isLoading ? "Loading" : loadError ? "Try again" : "Load more"}
            </button>
            <span aria-live="polite" className="gallery-loader__status">
              {isLoading ? `Loading more images. ${images.length} of ${totalImages}` : ""}
            </span>
          </div>
        ) : null}
      </div>

      {activeIndex !== null ? (
        <Lightbox
          activeIndex={activeIndex}
          images={images}
          onChange={setActiveIndex}
          onClose={() => setActiveIndex(null)}
          totalImages={totalImages}
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
