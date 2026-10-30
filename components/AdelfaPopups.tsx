"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  autoUpdate,
  computePosition,
  flip,
  offset,
  shift,
} from "@floating-ui/dom";

type Token = [text: string, styleIndex: number];
type PopupData = { id: string; lines: Token[][] };
type BlockData = { popups: PopupData[]; styles: string[] };
type Registered = { container: HTMLElement; styles: string[]; lines: Token[][] };

const registry = new Map<string, Registered>();

const buildPopup = (id: string, { container, styles, lines }: Registered) => {
  const popup = document.createElement("div");
  popup.id = id;
  popup.className = "adelfa-popup";
  popup.setAttribute("role", "tooltip");
  lines.forEach((line, i) => {
    line.forEach(([text, styleIndex]) => {
      const span = document.createElement("span");
      span.textContent = text;
      span.style.cssText = styles[styleIndex];
      popup.append(span);
    });
    if (i < lines.length - 1) popup.append("\n");
  });
  container.append(popup);
  document
    .querySelector(`[data-popup="${id}"][role="button"]`)
    ?.setAttribute("aria-controls", id);
  return popup;
};

const popupFor = (id: string) => {
  const existing = document.getElementById(id);
  if (existing) return existing;
  const data = registry.get(id);
  return data ? buildPopup(id, data) : null;
};

const segmentsOf = (id: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(`[data-popup="${id}"]`));

const unionRect = (elements: Element[]) => {
  const rects = elements.map((el) => el.getBoundingClientRect());
  const left = Math.min(...rects.map((r) => r.left));
  const top = Math.min(...rects.map((r) => r.top));
  const right = Math.max(...rects.map((r) => r.right));
  const bottom = Math.max(...rects.map((r) => r.bottom));
  return new DOMRect(left, top, right - left, bottom - top);
};

type OpenPopup = { id: string; popup: HTMLElement; stopUpdating: () => void };

let open: OpenPopup | null = null;
let pinned = false;
let closeTimer: ReturnType<typeof setTimeout> | null = null;
let installed = false;

const cancelClose = () => {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = null;
};

const setOpenState = (id: string, isOpen: boolean) => {
  segmentsOf(id).forEach((el) => {
    el.classList.toggle("adelfa-hover-open", isOpen);
    if (el.hasAttribute("role")) {
      el.setAttribute("aria-expanded", String(isOpen));
    }
  });
};

const close = () => {
  cancelClose();
  if (!open) return;
  open.stopUpdating();
  delete open.popup.dataset.open;
  setOpenState(open.id, false);
  open = null;
};

function installHandler() {
  if (installed) return;
  installed = true;

  const idOf = (target: EventTarget | null) =>
    target instanceof Element
      ? (target.closest(".adelfa-hover") as HTMLElement | null)?.dataset.popup
      : undefined;

  const insidePopup = (target: EventTarget | null) =>
    target instanceof Element && target.closest(".adelfa-popup") !== null;

  const show = (id: string) => {
    if (open?.id === id) return;
    close();
    const popup = popupFor(id);
    const segments = segmentsOf(id);
    if (!popup || segments.length === 0) return;

    popup.dataset.open = "";
    setOpenState(id, true);
    const anchor = {
      getBoundingClientRect: () => unionRect(segments),
      contextElement: segments[0],
    };
    const stopUpdating = autoUpdate(anchor, popup, () => {
      computePosition(anchor, popup, {
        placement: "top",
        strategy: "fixed",
        middleware: [offset(8), flip(), shift({ padding: 8 })],
      }).then(({ x, y }) => {
        popup.style.left = `${x}px`;
        popup.style.top = `${y}px`;
      });
    });
    open = { id, popup, stopUpdating };
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer = setTimeout(close, 150);
  };

  const togglePinned = (id: string) => {
    if (pinned && open?.id === id) {
      close();
      pinned = false;
      return;
    }
    show(id);
    pinned = true;
  };

  document.addEventListener("click", (e) => {
    if (insidePopup(e.target)) return;
    const id = idOf(e.target);
    if (!id) {
      close();
      pinned = false;
      return;
    }
    togglePinned(id);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      close();
      pinned = false;
      return;
    }
    const id = idOf(e.target);
    if (id && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      togglePinned(id);
    }
  });

  document.addEventListener("focusin", (e) => {
    const id = idOf(e.target);
    if (id && !pinned) show(id);
  });

  document.addEventListener("focusout", (e) => {
    if (pinned || !idOf(e.target)) return;
    if (idOf(e.relatedTarget) || insidePopup(e.relatedTarget)) return;
    close();
  });

  if (!window.matchMedia("(hover: hover)").matches) return;

  document.addEventListener("mouseover", (e) => {
    if (pinned) return;
    if (insidePopup(e.target)) {
      cancelClose();
      return;
    }
    const id = idOf(e.target);
    if (!id) return;
    cancelClose();
    show(id);
  });

  document.addEventListener("mouseout", (e) => {
    if (pinned || !open) return;
    if (!idOf(e.target) && !insidePopup(e.target)) return;
    if (idOf(e.relatedTarget) === open.id || insidePopup(e.relatedTarget)) return;
    scheduleClose();
  });
}

function useRegistered(data: string, container: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const { popups, styles }: BlockData = JSON.parse(data);
    const target = container.current;
    if (!target) return;
    popups.forEach(({ id, lines }) =>
      registry.set(id, { container: target, styles, lines }),
    );
    installHandler();
    return () => {
      const current = open;
      if (current && popups.some(({ id }) => id === current.id)) {
        close();
        pinned = false;
      }
      popups.forEach(({ id }) => registry.delete(id));
    };
  }, [data, container]);
}

export function AdelfaPopups({ data }: { data: string }) {
  const container = useRef<HTMLDivElement>(null);
  useRegistered(data, container);
  return <div className="adelfa-popups" ref={container} />;
}
