import { createRoot, onCleanup, onMount } from "solid-js";

import { useLogger } from "~/fn/context/LoggerContext";
import { Id } from "~/type/struct/Id";

const createIframeCache = () => {
  const logger = useLogger(["createIframeCache"]);
  const containerElementId = "iframe-cache-container";
  const forwardedZIndex = 5;
  const container = document.getElementById(containerElementId) || document.createElement("div");

  onMount(() => {
    if (document.getElementById(containerElementId)) {
      logger.info("Iframe cache container already exists.");
      return;
    }
    logger.info("Creating iframe cache container");
    container.id = containerElementId;
    container.style.position = "absolute";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "0";
    container.style.height = "0";
    container.style.overflow = "hidden";
    document.body.appendChild(container);
  });

  onCleanup(() => {
    logger.info("Cleaning up iframe cache container");
    container.remove();
  });

  return () => ({
    get: (p: { elementId: Id }) => {
      const found = container.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (!found) return undefined;
      return found as HTMLIFrameElement;
    },
    set: (p: { elementId: Id; createIframe: (iframe: HTMLIFrameElement) => HTMLIFrameElement }) => {
      const currentElement = container.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (currentElement) currentElement.remove();
      const baseIframe = document.createElement("iframe");
      const iframe = p.createIframe(baseIframe);
      iframe.setAttribute("element-id", p.elementId);
      container.appendChild(iframe);
    },
    delete: (p: { elementId: Id }) => {
      container.querySelector(`iframe[element-id="${p.elementId}"]`)?.remove();
    },
    mount: (p: { elementId: Id; targetElement: HTMLElement }) => {
      const iframe = container.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (!iframe) return;
      p.targetElement.moveBefore(iframe, null);
    },
    unmount: (p: { elementId: Id }) => {
      const iframe = document.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (!iframe) return;
      container.moveBefore(iframe, null);
    },
    setContainerPosition: (p: { left: number; top: number; width: number; height: number; active: boolean }) => {
      container.style.position = "absolute";
      container.style.left = `${p.left}px`;
      container.style.top = `${p.top}px`;
      container.style.width = `${p.width}px`;
      container.style.height = `${p.height}px`;
      container.style.zIndex = p.active ? `${forwardedZIndex}` : "";
    },
  });
};

/** @public */
export const useIframeCache = createRoot(createIframeCache);
