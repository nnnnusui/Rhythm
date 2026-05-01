import { createRoot, onCleanup, onMount } from "solid-js";

import { useLogger } from "~/fn/context/LoggerContext";
import { Id } from "~/type/struct/Id";

/**
 * Keeps iframe elements alive outside the JSX tree so they can survive hot reloads
 * and component rerenders without losing their internal state.
 *
 * This cache owns iframe elements independently from the view layer, then exposes
 * a small API to create, retrieve, remove, and present them at specific locations
 * in the UI when needed.
 */
const createIframeCache = () => {
  const logger = useLogger(["createIframeCache"]);
  const containerElementId = "iframe-cache-container";
  const forwardedZIndex = 5;
  const container = document.getElementById(containerElementId) || document.createElement("div");

  const moveBeforeImplemented = document.body.moveBefore != null;
  const fallbackUnmountMap = new Map<Id, () => void>();

  const updateFallbackPosition = (iframe: HTMLIFrameElement, targetElement: HTMLElement) => {
    if (!targetElement.isConnected) {
      iframe.style.display = "none";
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(targetElement);
    iframe.style.position = "fixed";
    iframe.style.left = `${rect.left}px`;
    iframe.style.top = `${rect.top}px`;
    iframe.style.width = `${rect.width}px`;
    iframe.style.height = `${rect.height}px`;
    iframe.style.visibility = computedStyle.visibility;
    iframe.style.opacity = computedStyle.opacity;
    iframe.style.pointerEvents = computedStyle.pointerEvents;
    iframe.style.borderWidth = "0";
    iframe.style.margin = "0";
  };

  const stopFallbackTracking = (elementId: Id) => {
    fallbackUnmountMap.get(elementId)?.();
    fallbackUnmountMap.delete(elementId);
  };

  const mountWithFallbackPosition = (p: { elementId: Id; iframe: HTMLIFrameElement; targetElement: HTMLElement }) => {
    stopFallbackTracking(p.elementId);
    updateFallbackPosition(p.iframe, p.targetElement);

    const update = () => updateFallbackPosition(p.iframe, p.targetElement);
    const resizeObserver = new ResizeObserver(update);
    resizeObserver.observe(p.targetElement);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    fallbackUnmountMap.set(p.elementId, () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    });
  };

  const unmountWithFallbackPosition = (p: { elementId: Id; iframe: HTMLIFrameElement }) => {
    stopFallbackTracking(p.elementId);
    p.iframe.style.display = "none";
  };

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
    document.body.prepend(container);
  });

  onCleanup(() => {
    logger.info("Cleaning up iframe cache container");
    fallbackUnmountMap.forEach((stop) => stop());
    fallbackUnmountMap.clear();
    container.remove();
  });

  return () => ({
    /**
     * Returns a cached iframe when it already exists.
     *
     * This is used to reuse a previously initialized iframe instead of creating a
     * new one and resetting the embedded player state.
     */
    get: (p: { elementId: Id }) => {
      const found = container.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (!found) return undefined;
      return found as HTMLIFrameElement;
    },
    /**
     * Creates or replaces a cached iframe owned by this store.
     *
     * The iframe is constructed outside the JSX tree so it can keep its internal
     * state across UI remounts.
     */
    set: (p: { elementId: Id; createIframe: (iframe: HTMLIFrameElement) => HTMLIFrameElement }) => {
      const currentElement = container.querySelector(`iframe[element-id="${p.elementId}"]`);
      if (currentElement) currentElement.remove();
      const baseIframe = document.createElement("iframe");
      const iframe = p.createIframe(baseIframe);
      iframe.setAttribute("element-id", p.elementId);
      container.appendChild(iframe);
    },
    /**
     * Removes a cached iframe from this store.
     *
     * This is the destructive path when the cached instance is no longer needed.
     */
    delete: (p: { elementId: Id }) => {
      const iframe = document.querySelector(`iframe[element-id="${p.elementId}"]`) as HTMLIFrameElement | null;
      if (!iframe) return;
      if (!moveBeforeImplemented) return unmountWithFallbackPosition({ elementId: p.elementId, iframe });
      iframe.remove();
    },
    /**
     * Presents the cached iframe at the requested UI location.
     *
     * Browsers with `moveBefore` support reparent the iframe directly. Browsers
     * without it, such as Safari, emulate the placement by updating style and
     * stacking behavior.
     */
    mount: (p: { elementId: Id; targetElement: HTMLElement }) => {
      const iframe = container.querySelector(`iframe[element-id="${p.elementId}"]`) as HTMLIFrameElement | null;
      if (!iframe) return;
      if (!moveBeforeImplemented) return mountWithFallbackPosition({ elementId: p.elementId, iframe, targetElement: p.targetElement });
      p.targetElement.moveBefore(iframe, null);
    },
    /**
     * Returns the cached iframe to its detached management state.
     *
     * In fallback environments this hides the iframe and stops position tracking
     * instead of moving the DOM node.
     */
    unmount: (p: { elementId: Id }) => {
      const iframe = document.querySelector(`iframe[element-id="${p.elementId}"]`) as HTMLIFrameElement | null;
      if (!iframe) return;
      if (!moveBeforeImplemented) return unmountWithFallbackPosition({ elementId: p.elementId, iframe });
      container.moveBefore(iframe, null);
    },
    /**
     * Applies extra visibility and stacking control for fallback environments.
     *
     * This exists for browsers that do not implement `moveBefore`, where the cache
     * has to simulate mounting behavior through z-index and display updates.
     */
    setActive: (p: { elementId: Id; active: boolean; inFront: boolean }) => {
      if (moveBeforeImplemented) return;
      const iframe = document.querySelector(`iframe[element-id="${p.elementId}"]`) as HTMLIFrameElement | null;
      if (!iframe) return;
      logger.debug(`Set iframe (elementId: ${p.elementId}) active: ${p.active}, inFront: ${p.inFront}`);
      iframe.style.display = (p.active) ? "block" : "none";
      iframe.style.zIndex = (p.active && p.inFront) ? `${forwardedZIndex}` : "";
    },
  });
};

/**
 * Provides a process-wide iframe cache for UI features that need persistent iframe
 * instances outside the JSX lifecycle.
 * @public
 */
export const useIframeCache = createRoot(createIframeCache);
