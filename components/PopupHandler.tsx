"use client";

import { useEffect } from "react";
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
} from "@floating-ui/dom";
import { highlightPopup } from "@/lib/popup-highlighter";

export default function PopupHandler() {
  useEffect(() => {
    let cleanupAutoUpdate: (() => void) | null = null;
    let currentHover: Element | null = null;
    let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
    let pinned = false;

    const getOrCreateArrow = (popup: HTMLElement): HTMLElement => {
      let arrowEl = popup.querySelector(".popup-arrow") as HTMLElement | null;
      if (!arrowEl) {
        arrowEl = document.createElement("div");
        arrowEl.className = "popup-arrow";
        popup.appendChild(arrowEl);
      }
      return arrowEl;
    };

    const positionPopup = (
      trigger: Element,
      popup: HTMLElement,
    ): (() => void) => {
      const arrowEl = getOrCreateArrow(popup);

      return autoUpdate(trigger, popup, () => {
        computePosition(trigger, popup, {
          placement: "top",
          strategy: "fixed",
          middleware: [
            offset(8),
            flip(),
            shift({ padding: 8 }),
            arrow({ element: arrowEl }),
          ],
        }).then(({ x, y, placement, middlewareData }) => {
          popup.style.left = `${x}px`;
          popup.style.top = `${y}px`;

          if (middlewareData.arrow) {
            const { x: arrowX } = middlewareData.arrow;
            const isTop = placement.startsWith("top");
            const borderColor = getComputedStyle(popup).borderColor;

            Object.assign(arrowEl.style, {
              left: arrowX != null ? `${arrowX}px` : "",
              top: isTop ? "100%" : "",
              bottom: isTop ? "" : "100%",
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: isTop ? `8px solid ${borderColor}` : "none",
              borderBottom: isTop ? "none" : `8px solid ${borderColor}`,
            });
          }
        });
      });
    };

    const closeAllPopups = () => {
      if (cleanupAutoUpdate) {
        cleanupAutoUpdate();
        cleanupAutoUpdate = null;
      }
      document
        .querySelectorAll(".twoslash-hover.active")
        .forEach((el) => el.classList.remove("active"));
    };

    const ensurePopup = (target: Element): HTMLElement | null => {
      const existing = target.querySelector(
        ".twoslash-popup-container",
      ) as HTMLElement | null;
      if (existing) return existing;

      const input = target.getAttribute("data-popup-input");
      const output = target.getAttribute("data-popup-output");
      if (!input && !output) return null;

      const content = `>> ${input}\n\n${output}`;

      const popup = document.createElement("span");
      popup.className = "twoslash-popup-container";
      popup.innerHTML = `<pre class="twoslash-popup-code"><code>${content.replace(/</g, "&lt;")}</code></pre>`;

      target.appendChild(popup);

      highlightPopup(content).then((html) => {
        const oldPre = popup.querySelector(".twoslash-popup-code");
        if (oldPre) {
          oldPre.outerHTML = html;
        }
      });

      return popup;
    };

    const showPopup = (target: Element) => {
      closeAllPopups();
      target.classList.add("active");

      const popup = ensurePopup(target);
      if (!popup) return;

      cleanupAutoUpdate = positionPopup(target, popup);
    };

    const handleClick = (e: MouseEvent) => {
      const clickedEl = e.target as HTMLElement;

      if (clickedEl.closest(".twoslash-popup-container")) return;

      const target = clickedEl.closest(".twoslash-hover");

      if (!target) {
        closeAllPopups();
        currentHover = null;
        pinned = false;
        return;
      }

      e.stopPropagation();

      if (pinned && target === currentHover) {
        closeAllPopups();
        currentHover = null;
        pinned = false;
        return;
      }

      closeAllPopups();
      currentHover = target;
      pinned = true;
      showPopup(target);
    };

    const handleMouseOver = (e: MouseEvent) => {
      if (pinned) return;

      const target = (e.target as HTMLElement).closest(".twoslash-hover");
      if (!target) return;

      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }

      if (target === currentHover) return;

      currentHover = target;
      showPopup(target);
    };

    const handleMouseOut = (e: MouseEvent) => {
      if (pinned) return;

      const target = (e.target as HTMLElement).closest(".twoslash-hover");
      if (!target || target !== currentHover) return;

      const related = (e.relatedTarget as HTMLElement)?.closest?.(
        ".twoslash-hover",
      );
      if (related === target) return;

      hoverTimeout = setTimeout(() => {
        closeAllPopups();
        currentHover = null;
        hoverTimeout = null;
      }, 150);
    };

    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllPopups();
        currentHover = null;
        pinned = false;
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeydown);

    const supportsHover = window.matchMedia("(hover: hover)").matches;
    if (supportsHover) {
      document.addEventListener("mouseover", handleMouseOver);
      document.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (cleanupAutoUpdate) cleanupAutoUpdate();
      if (hoverTimeout) clearTimeout(hoverTimeout);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      if (supportsHover) {
        document.removeEventListener("mouseover", handleMouseOver);
        document.removeEventListener("mouseout", handleMouseOut);
      }
    };
  }, []);

  return null;
}
