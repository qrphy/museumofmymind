"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import cloudinaryLoader from "@/lib/cloudinary-loader";
import type { GalleryImage } from "@/lib/cloudinary";
import { canPrefetchImages } from "@/lib/connection";
import { IMAGE_PLACEHOLDER } from "@/lib/image-delivery";

type LightboxProps = {
  images: GalleryImage[];
  activeIndex: number;
  totalImages?: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

const RESPONSIVE_IMAGE_WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

function getLightboxPrefetchWidth(): number {
  const targetWidth = window.innerWidth * Math.min(window.devicePixelRatio, 2);
  return (
    RESPONSIVE_IMAGE_WIDTHS.find((width) => width >= targetWidth) ??
    RESPONSIVE_IMAGE_WIDTHS.at(-1)!
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path
        d={direction === "left" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"}
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function Lightbox({
  images,
  activeIndex,
  totalImages = images.length,
  onChange,
  onClose,
}: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const image = images[activeIndex];

  const goPrevious = () => onChange((activeIndex - 1 + images.length) % images.length);
  const goNext = () => onChange((activeIndex + 1) % images.length);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const dialog = dialogRef.current;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goPrevious();
      if (event.key === "ArrowRight") goNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (images.length < 2 || !canPrefetchImages(window.navigator)) return;

    const timeout = window.setTimeout(() => {
      const width = getLightboxPrefetchWidth();
      const indexes = new Set([
        (activeIndex - 1 + images.length) % images.length,
        (activeIndex + 1) % images.length,
      ]);

      for (const index of indexes) {
        const nearbyImage = images[index];
        if (!nearbyImage) continue;

        const preloadImage = new window.Image();
        preloadImage.decoding = "async";
        preloadImage.src = cloudinaryLoader({ src: nearbyImage.src, width });
      }
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, images]);

  if (!image || images.length === 0) return null;

  return createPortal(
    <dialog
      aria-label="Image viewer"
      className="lightbox"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;

        if (start === null || end === undefined || Math.abs(end - start) < 50) return;
        if (end < start) goNext();
        else goPrevious();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      ref={dialogRef}
    >
      <button
        aria-label="Close viewer backdrop"
        className="lightbox__backdrop"
        data-testid="lightbox-backdrop"
        onClick={onClose}
        type="button"
      />

      <div className="lightbox__topbar">
        <span aria-live="polite" className="lightbox__count">
          {activeIndex + 1} / {totalImages}
        </span>
        <button
          aria-label="Close image viewer"
          className="lightbox__close"
          onClick={onClose}
          ref={closeButtonRef}
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path
              d="M5 5l14 14M19 5 5 19"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
        </button>
      </div>

      <div className="lightbox__stage">
        <Image
          alt={image.alt}
          blurDataURL={IMAGE_PLACEHOLDER}
          className="lightbox__image"
          height={image.height}
          preload
          placeholder="blur"
          sizes="100vw"
          src={image.src}
          width={image.width}
        />
      </div>

      {images.length > 1 ? (
        <>
          <button
            aria-label="Previous image"
            className="lightbox__nav lightbox__nav--previous"
            onClick={goPrevious}
            type="button"
          >
            <ArrowIcon direction="left" />
          </button>
          <button
            aria-label="Next image"
            className="lightbox__nav lightbox__nav--next"
            onClick={goNext}
            type="button"
          >
            <ArrowIcon direction="right" />
          </button>
        </>
      ) : null}
    </dialog>,
    document.body,
  );
}
