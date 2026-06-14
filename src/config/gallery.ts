/**
 * Gallery backend: CSS wall (default), R3F, or Spline.
 *
 * Query overrides:
 *   ?gallery=css    → CSS 3D wall (default)
 *   ?gallery=r3f    → React Three Fiber (experimental)
 *   ?gallery=spline → Spline when URL is valid
 *
 * Env vars (optional):
 *   VITE_USE_SPLINE_GALLERY=true
 *   VITE_SPLINE_SCENE_URL=https://prod.spline.design/…/scene.splinecode
 */

export type GalleryBackend = "css" | "r3f" | "spline";

export const SPLINE_PLACEHOLDER = "PASTE_SPLINE_SCENE_URL_HERE";

export const USE_SPLINE_GALLERY =
  import.meta.env.VITE_USE_SPLINE_GALLERY === "true";

export const SPLINE_SCENE_URL = (
  import.meta.env.VITE_SPLINE_SCENE_URL ?? SPLINE_PLACEHOLDER
).trim();

export function isValidSplineUrl(url: string): boolean {
  if (!url || url === SPLINE_PLACEHOLDER) return false;
  return url.startsWith("http") || url.startsWith("/");
}

export function resolveGalleryBackend(
  search: string = typeof window !== "undefined" ? window.location.search : ""
): GalleryBackend {
  const value = new URLSearchParams(search).get("gallery");

  if (value === "r3f") return "r3f";
  if (value === "css") return "css";

  if (value === "spline") {
    return isValidSplineUrl(SPLINE_SCENE_URL) ? "spline" : "css";
  }

  if (USE_SPLINE_GALLERY && isValidSplineUrl(SPLINE_SCENE_URL)) {
    return "spline";
  }

  return "css";
}

/** @deprecated Use resolveGalleryBackend */
export function shouldUseSplineGallery(search?: string): boolean {
  return resolveGalleryBackend(search) === "spline";
}
