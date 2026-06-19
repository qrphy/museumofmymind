import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type ImgHTMLAttributes } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Gallery } from "@/components/gallery";
import type { GalleryImage } from "@/lib/cloudinary";

vi.mock("next/image", () => ({
  default: ({
    blurDataURL,
    placeholder,
    preload,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    blurDataURL?: string;
    placeholder?: string;
    preload?: boolean;
  }) => {
    void blurDataURL;
    void placeholder;
    void preload;
    return createElement("img", props);
  },
}));

afterEach(() => vi.unstubAllGlobals());

const images: GalleryImage[] = [
  {
    id: "one",
    publicId: "museum/one",
    width: 800,
    height: 1200,
    alt: "",
    src: "https://res.cloudinary.com/demo/image/upload/one.jpg",
  },
  {
    id: "two",
    publicId: "museum/two",
    width: 1600,
    height: 900,
    alt: "",
    src: "https://res.cloudinary.com/demo/image/upload/two.jpg",
  },
];

describe("Gallery", () => {
  it("renders one focusable item per image with intrinsic dimensions", () => {
    const { container } = render(<Gallery images={images} />);

    expect(screen.getAllByRole("button", { name: /open image/i })).toHaveLength(2);
    const renderedImages = container.querySelectorAll("img");
    expect(renderedImages[0]).toHaveAttribute("width", "800");
    expect(renderedImages[0]).toHaveAttribute("height", "1200");
    expect(renderedImages[1]).toHaveAttribute("width", "1600");
    expect(renderedImages[1]).toHaveAttribute("height", "900");
  });

  it("opens the selected image and supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Gallery images={images} />);

    await user.click(screen.getByRole("button", { name: "Open image 1 of 2" }));
    expect(screen.getByRole("dialog", { name: "Image viewer" })).toBeInTheDocument();
    expect(screen.getByText("1 / 2")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "ArrowRight" });
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
  });

  it("switches between the available desktop and mobile layouts", async () => {
    const user = userEvent.setup();
    render(<Gallery images={images} />);
    const gallery = screen.getByRole("region", { name: "Image gallery" });

    expect(gallery).toHaveAttribute("data-desktop-columns", "4");
    expect(gallery).toHaveAttribute("data-mobile-columns", "1");

    await user.click(screen.getByRole("button", { name: "6 column layout" }));
    await user.click(screen.getByRole("button", { name: "2 column layout" }));

    expect(gallery).toHaveAttribute("data-desktop-columns", "6");
    expect(gallery).toHaveAttribute("data-mobile-columns", "2");
  });

  it("loads the next image batch on demand", async () => {
    const user = userEvent.setup();
    const nextImage: GalleryImage = {
      ...images[0],
      id: "three",
      publicId: "museum/three",
      src: "https://res.cloudinary.com/demo/image/upload/three.jpg",
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ images: [nextImage], nextOffset: 3, total: 3 }),
      }),
    );

    render(<Gallery images={images} totalImages={3} />);
    await user.click(screen.getByRole("button", { name: "Load more" }));

    expect(
      await screen.findByRole("button", { name: "Open image 3 of 3" }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith("/api/gallery?offset=2");
  });
});
