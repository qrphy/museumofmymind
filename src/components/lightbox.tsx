"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import type { GalleryImage } from "@/lib/cloudinary";

type LightboxProps = {
  images: GalleryImage[];
  activeIndex: number;
  onChange: (index: number) => void;
  onClose: () => void;
};

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
          {activeIndex + 1} / {images.length}
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
          className="lightbox__image"
          height={image.height}
          preload
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
