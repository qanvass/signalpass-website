/**
 * Locked gallery art-direction defaults.
 * Tune in dev via Leva (?dev=1), then copy values here for production.
 */
export interface GalleryDesign {
  cameraFov: number;
  cameraHeight: number;
  cameraPitch: number;
  galleryRadius: number;
  ringSpacing: number;
  frontScreenScale: number;
  backScreenScale: number;
  screenBrightness: number;
  bezelGlow: number;
  floorReflection: number;
  floorRingIntensity: number;
  wallRibIntensity: number;
  bloomIntensity: number;
  bloomThreshold: number;
  vignetteDarkness: number;
  fogNear: number;
  fogFar: number;
}

export const DEFAULT_GALLERY_DESIGN: GalleryDesign = {
  cameraFov: 76,
  cameraHeight: 0.05,
  cameraPitch: -0.02,
  galleryRadius: 5.65,
  ringSpacing: 0.96,
  frontScreenScale: 1.06,
  backScreenScale: 0.94,
  screenBrightness: 1.32,
  bezelGlow: 1.08,
  floorReflection: 0.72,
  floorRingIntensity: 1.2,
  wallRibIntensity: 1,
  bloomIntensity: 1.28,
  bloomThreshold: 0.68,
  vignetteDarkness: 0.42,
  fogNear: 28,
  fogFar: 55,
};

export const GALLERY_DESIGN_KEYS = [
  "cameraFov",
  "cameraHeight",
  "cameraPitch",
  "galleryRadius",
  "ringSpacing",
  "frontScreenScale",
  "backScreenScale",
  "screenBrightness",
  "bezelGlow",
  "floorReflection",
  "floorRingIntensity",
  "wallRibIntensity",
  "bloomIntensity",
  "bloomThreshold",
  "vignetteDarkness",
  "fogNear",
  "fogFar",
] as const satisfies readonly (keyof GalleryDesign)[];

/** Clamp Leva/localStorage values to safe ranges */
export function normalizeGalleryDesign(
  source: Partial<GalleryDesign> | Record<string, unknown>
): GalleryDesign {
  const raw = { ...DEFAULT_GALLERY_DESIGN };
  for (const key of GALLERY_DESIGN_KEYS) {
    const v = source[key];
    if (typeof v === "number" && Number.isFinite(v)) {
      raw[key] = v;
    }
  }
  return {
    cameraFov: clamp(raw.cameraFov, 50, 90),
    cameraHeight: clamp(raw.cameraHeight, -1.5, 1.5),
    cameraPitch: clamp(raw.cameraPitch, -0.6, 0.4),
    galleryRadius: clamp(raw.galleryRadius, 5.0, 7.5),
    ringSpacing: clamp(raw.ringSpacing, 0.85, 1.35),
    frontScreenScale: clamp(raw.frontScreenScale, 0.85, 1.45),
    backScreenScale: clamp(raw.backScreenScale, 0.75, 1.15),
    screenBrightness: clamp(raw.screenBrightness, 0.8, 2),
    bezelGlow: clamp(raw.bezelGlow, 0.4, 2),
    floorReflection: clamp(raw.floorReflection, 0.2, 1),
    floorRingIntensity: clamp(raw.floorRingIntensity, 0.4, 2),
    wallRibIntensity: clamp(raw.wallRibIntensity, 0.4, 2),
    bloomIntensity: clamp(raw.bloomIntensity, 0.4, 2.5),
    bloomThreshold: clamp(raw.bloomThreshold, 0.4, 0.95),
    vignetteDarkness: clamp(raw.vignetteDarkness, 0.15, 0.7),
    fogNear: clamp(raw.fogNear, 12, 35),
    fogFar: clamp(raw.fogFar, 35, 70),
  };
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function formatNum(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
}

/** Copy-paste block for src/config/galleryDesign.ts */
export function formatGalleryDesignExport(design: GalleryDesign): string {
  const lines = GALLERY_DESIGN_KEYS.map(
    (key) => `  ${key}: ${formatNum(design[key])},`
  );
  return [
    "// Paste over DEFAULT_GALLERY_DESIGN in src/config/galleryDesign.ts",
    "export const DEFAULT_GALLERY_DESIGN: GalleryDesign = {",
    ...lines,
    "};",
  ].join("\n");
}

export function copyGalleryDesignToClipboard(design: GalleryDesign): void {
  const text = formatGalleryDesignExport(design);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {
      console.log(text);
    });
  } else {
    console.log(text);
  }
}

export interface GalleryLayoutParams {
  galleryRadius: number;
  ringSpacing: number;
  frontScreenScale: number;
  backScreenScale: number;
}

export function layoutFromDesign(design: GalleryDesign): GalleryLayoutParams {
  return {
    galleryRadius: design.galleryRadius,
    ringSpacing: design.ringSpacing,
    frontScreenScale: design.frontScreenScale,
    backScreenScale: design.backScreenScale,
  };
}
