export const IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='8' height='8' fill='%23f4f3f0' filter='url(%23b)'/%3E%3C/svg%3E";

export function getGalleryImageSizes(
  mobileColumns: 1 | 2,
  desktopColumns: 4 | 6,
): string {
  const mobileSize =
    mobileColumns === 1
      ? "calc(100vw - 1.8rem)"
      : "calc(50vw - 1.35rem)";
  const desktopSize =
    desktopColumns === 4
      ? "calc(25vw - 1.5rem)"
      : "calc(16.667vw - 1.5rem)";

  return `(max-width: 639px) ${mobileSize}, (max-width: 959px) 46.4vw, ${desktopSize}`;
}
