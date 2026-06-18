import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type ImgHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Lightbox } from "@/components/lightbox";
import type { GalleryImage } from "@/lib/cloudinary";

vi.mock("next/image", () => ({
  default: ({ preload, ...props }: ImgHTMLAttributes<HTMLImageElement> & { preload?: boolean }) => {
    void preload;
    return createElement("img", props);
  },
}));

const images: GalleryImage[] = [
  {
    id: "one",
    publicId: "one",
    width: 800,
    height: 1200,
    alt: "",
    src: "https://res.cloudinary.com/demo/image/upload/one.jpg",
  },
  {
    id: "two",
    publicId: "two",
    width: 1600,
    height: 900,
    alt: "",
    src: "https://res.cloudinary.com/demo/image/upload/two.jpg",
  },
];

describe("Lightbox", () => {
  beforeEach(() => {
    document.body.style.overflow = "";
  });

  it("focuses close, locks scroll, and restores both on unmount", async () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();

    const { unmount } = render(
      <Lightbox
        images={images}
        activeIndex={0}
        onChange={vi.fn()}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByRole("dialog", { name: "Image viewer" }).tagName).toBe("DIALOG");
    expect(screen.getByRole("button", { name: "Close image viewer" })).toHaveFocus();
    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    await waitFor(() => expect(trigger).toHaveFocus());
    expect(document.body.style.overflow).toBe("");
    trigger.remove();
  });

  it("closes with Escape, the close control, and the backdrop", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <Lightbox images={images} activeIndex={0} onChange={vi.fn()} onClose={onClose} />,
    );

    fireEvent(
      screen.getByRole("dialog", { name: "Image viewer" }),
      new Event("cancel", { cancelable: true }),
    );
    await user.click(screen.getByRole("button", { name: "Close image viewer" }));
    fireEvent.click(screen.getByTestId("lightbox-backdrop"));

    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("wraps arrow and control navigation", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Lightbox images={images} activeIndex={0} onChange={onChange} onClose={vi.fn()} />,
    );

    fireEvent.keyDown(document, { key: "ArrowLeft" });
    fireEvent.keyDown(document, { key: "ArrowRight" });
    await user.click(screen.getByRole("button", { name: "Previous image" }));
    await user.click(screen.getByRole("button", { name: "Next image" }));

    expect(onChange.mock.calls.map(([index]) => index)).toEqual([1, 1, 1, 1]);
  });

  it("changes image after a horizontal swipe above 50 pixels", () => {
    const onChange = vi.fn();
    render(
      <Lightbox images={images} activeIndex={0} onChange={onChange} onClose={vi.fn()} />,
    );

    const dialog = screen.getByRole("dialog", { name: "Image viewer" });
    fireEvent.touchStart(dialog, { touches: [{ clientX: 180 }] });
    fireEvent.touchEnd(dialog, { changedTouches: [{ clientX: 100 }] });

    expect(onChange).toHaveBeenCalledWith(1);
  });
});
