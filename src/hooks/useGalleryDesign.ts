import { useControls, folder, button } from "leva";
import {
  DEFAULT_GALLERY_DESIGN,
  normalizeGalleryDesign,
  formatGalleryDesignExport,
  copyGalleryDesignToClipboard,
  type GalleryDesign,
} from "../config/galleryDesign";

const DEV_PANEL = { render: () => import.meta.env.DEV };

/**
 * Live art-direction controls — panel visible in dev only.
 * Lock tuned values into DEFAULT_GALLERY_DESIGN when done.
 */
export function useGalleryDesign(): GalleryDesign {
  const controls = useControls(
    "Gallery Design v3",
    {
      Camera: folder({
        cameraFov: {
          value: DEFAULT_GALLERY_DESIGN.cameraFov,
          min: 50,
          max: 90,
          step: 1,
          label: "FOV",
        },
        cameraHeight: {
          value: DEFAULT_GALLERY_DESIGN.cameraHeight,
          min: -2,
          max: 2,
          step: 0.05,
          label: "Height",
        },
        cameraPitch: {
          value: DEFAULT_GALLERY_DESIGN.cameraPitch,
          min: -0.8,
          max: 0.8,
          step: 0.01,
          label: "Pitch",
        },
      }),
      Layout: folder({
        galleryRadius: {
          value: DEFAULT_GALLERY_DESIGN.galleryRadius,
          min: 5.5,
          max: 9.5,
          step: 0.05,
          label: "Ring radius",
        },
        ringSpacing: {
          value: DEFAULT_GALLERY_DESIGN.ringSpacing,
          min: 0.6,
          max: 1.5,
          step: 0.02,
          label: "Vertical spacing",
        },
        frontScreenScale: {
          value: DEFAULT_GALLERY_DESIGN.frontScreenScale,
          min: 0.6,
          max: 1.8,
          step: 0.05,
          label: "Front TV scale",
        },
        backScreenScale: {
          value: DEFAULT_GALLERY_DESIGN.backScreenScale,
          min: 0.6,
          max: 1.4,
          step: 0.05,
          label: "Back TV scale",
        },
      }),
      Screens: folder({
        screenBrightness: {
          value: DEFAULT_GALLERY_DESIGN.screenBrightness,
          min: 0.5,
          max: 2,
          step: 0.05,
          label: "Brightness",
        },
        bezelGlow: {
          value: DEFAULT_GALLERY_DESIGN.bezelGlow,
          min: 0.2,
          max: 2.5,
          step: 0.05,
          label: "Bezel glow",
        },
      }),
      Floor: folder({
        floorReflection: {
          value: DEFAULT_GALLERY_DESIGN.floorReflection,
          min: 0,
          max: 1,
          step: 0.02,
          label: "Reflection",
        },
        floorRingIntensity: {
          value: DEFAULT_GALLERY_DESIGN.floorRingIntensity,
          min: 0,
          max: 2,
          step: 0.05,
          label: "Ring glow",
        },
      }),
      Room: folder({
        wallRibIntensity: {
          value: DEFAULT_GALLERY_DESIGN.wallRibIntensity,
          min: 0,
          max: 2,
          step: 0.05,
          label: "Wall ribs",
        },
      }),
      PostFX: folder({
        bloomIntensity: {
          value: DEFAULT_GALLERY_DESIGN.bloomIntensity,
          min: 0,
          max: 3,
          step: 0.05,
          label: "Bloom",
        },
        bloomThreshold: {
          value: DEFAULT_GALLERY_DESIGN.bloomThreshold,
          min: 0,
          max: 1,
          step: 0.01,
          label: "Bloom threshold",
        },
        vignetteDarkness: {
          value: DEFAULT_GALLERY_DESIGN.vignetteDarkness,
          min: 0,
          max: 1,
          step: 0.02,
          label: "Vignette",
        },
      }),
      Atmosphere: folder({
        fogNear: {
          value: DEFAULT_GALLERY_DESIGN.fogNear,
          min: 10,
          max: 40,
          step: 1,
          label: "Fog near",
        },
        fogFar: {
          value: DEFAULT_GALLERY_DESIGN.fogFar,
          min: 20,
          max: 80,
          step: 1,
          label: "Fog far",
        },
      }),
      Export: folder({
        "Copy settings": button(() => {
          const w = window as Window & { __GALLERY_DESIGN?: GalleryDesign };
          const design = normalizeGalleryDesign(
            w.__GALLERY_DESIGN ?? DEFAULT_GALLERY_DESIGN
          );
          copyGalleryDesignToClipboard(design);
          console.log(
            "%c[Gallery Design] Copied — paste into src/config/galleryDesign.ts",
            "color:#8b5cf6;font-weight:bold"
          );
          console.log(formatGalleryDesignExport(design));
        }),
        "Reset defaults": button(() => {
          for (const key of Object.keys(localStorage)) {
            if (key.toLowerCase().includes("leva")) {
              localStorage.removeItem(key);
            }
          }
          window.location.reload();
        }),
      }),
    },
    { collapsed: false, ...DEV_PANEL }
  );

  const design = normalizeGalleryDesign({ ...DEFAULT_GALLERY_DESIGN, ...controls });

  if (import.meta.env.DEV) {
    (window as Window & { __GALLERY_DESIGN?: GalleryDesign }).__GALLERY_DESIGN =
      design;
  }

  return design;
}
