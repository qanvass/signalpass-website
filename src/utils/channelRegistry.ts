/**
 * channelRegistry.ts
 * Gallery screen definitions: interactive navigation tiles + preview clip loops.
 * All content is original/generic — zero copyrighted material.
 */

import type { GalleryLayoutParams } from "../config/galleryDesign";

export type ScreenKind = "preview" | "interactive";

/** Canvas fallback identity when a preview video file is missing */
export type FallbackCanvasType =
  | "sports"
  | "action"
  | "scifi"
  | "racing"
  | "cartoons"
  | "cooking"
  | "news"
  | "nature"
  | "concert"
  | "city";

/** Expected fictional preview clip paths (drop MP4s into public/media/previews/) */
export const PREVIEW_VIDEO_PATHS = {
  sportsSoccer: "/media/previews/sports-soccer-fictional.mp4",
  sportsBasketball: "/media/previews/sports-basketball-fictional.mp4",
  movieScifiCity: "/media/previews/movie-scifi-city-fictional.mp4",
  movieActionChase: "/media/previews/movie-action-chase-fictional.mp4",
  tvRealityDinner: "/media/previews/tv-reality-dinner-fictional.mp4",
  tvNewsStudio: "/media/previews/tv-news-studio-fictional.mp4",
  cartoonRobot: "/media/previews/cartoon-robot-fictional.mp4",
  kidsAnimalForest: "/media/previews/kids-animal-forest-fictional.mp4",
  signalWaves: "/media/previews/signal-waves-fictional.mp4",
  setupDevice: "/media/previews/setup-device-fictional.mp4",
  supportHelpdesk: "/media/previews/support-helpdesk-fictional.mp4",
  plansCards: "/media/previews/plans-cards-fictional.mp4",
} as const;

export interface GalleryScreen {
  kind: ScreenKind;
  label: string;
  accent: string;
  bg: string;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  subtitle?: string;
  href?: string;
  icon?: "plans" | "setup" | "sports" | "movies" | "tv" | "cartoons" | "support" | "learn";
  /** Preview-only: looping MP4 in public/media/previews/ */
  videoSrc?: string;
  /** Preview-only: procedural canvas used when videoSrc fails */
  fallbackCanvasType?: FallbackCanvasType;
  /** Preview-only: duration badge (e.g. "0:03") */
  durationLabel?: string;
}

export const PREVIEW_LOOP_SEC = 3;

export function loopTime(t: number): number {
  return t % PREVIEW_LOOP_SEC;
}

export function drawPreviewChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  durationLabel = "0:03"
) {
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(0, 0, 96, 28);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText("PREVIEW", 10, 19);
  ctx.fillStyle = "rgba(0,0,0,0.72)";
  ctx.fillRect(w - 54, h - 26, 50, 22);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(durationLabel, w - 46, h - 9);
}

export function drawInteractiveChrome(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  hovered: boolean
) {
  ctx.fillStyle = hovered ? "rgba(139,92,246,0.95)" : "rgba(139,92,246,0.75)";
  ctx.font = "bold 8px sans-serif";
  ctx.fillText("INTERACTIVE", w - 72, 14);
}

function drawGlassBg(ctx: CanvasRenderingContext2D, w: number, h: number, accent: string) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, "rgba(35,18,70,0.92)");
  grad.addColorStop(0.5, "rgba(18,28,65,0.88)");
  grad.addColorStop(1, "rgba(25,12,55,0.92)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, w - 8, h - 8);
  ctx.strokeStyle = `${accent}66`;
  ctx.lineWidth = 8;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  const shine = ctx.createLinearGradient(0, 0, w * 0.6, h * 0.5);
  shine.addColorStop(0, "rgba(255,255,255,0.12)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = shine;
  ctx.fillRect(0, 0, w, h * 0.45);
}

function drawIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  icon: GalleryScreen["icon"],
  accent: string
) {
  ctx.strokeStyle = accent;
  ctx.fillStyle = accent;
  ctx.lineWidth = 2;
  const s = 18;
  switch (icon) {
    case "sports":
      ctx.beginPath();
      ctx.arc(cx, cy, s, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s);
        ctx.stroke();
      }
      break;
    case "tv":
      ctx.strokeRect(cx - s, cy - s * 0.6, s * 2, s * 1.2);
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - s * 0.6);
      ctx.lineTo(cx, cy - s * 0.6 - 8);
      ctx.lineTo(cx + 6, cy - s * 0.6);
      ctx.stroke();
      break;
    case "movies":
      ctx.fillRect(cx - s, cy - s * 0.5, s * 0.5, s);
      ctx.strokeRect(cx - s * 0.3, cy - s * 0.7, s * 1.6, s * 1.4);
      break;
    case "setup":
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        ctx.fillRect(cx + Math.cos(a) * s * 0.55 - 2, cy + Math.sin(a) * s * 0.55 - 2, 4, 4);
      }
      break;
    case "cartoons":
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 4, 6, 0, Math.PI * 2);
      ctx.arc(cx + 6, cy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy + 6, 10, 0, Math.PI);
      ctx.stroke();
      break;
    case "support":
      ctx.beginPath();
      ctx.arc(cx, cy - 4, s * 0.65, Math.PI, 0);
      ctx.lineTo(cx + s * 0.65, cy + 8);
      ctx.lineTo(cx - s * 0.65, cy + 8);
      ctx.closePath();
      ctx.stroke();
      break;
    case "plans":
      ctx.beginPath();
      ctx.moveTo(cx, cy - s);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.5);
      ctx.lineTo(cx - s * 0.8, cy + s * 0.5);
      ctx.closePath();
      ctx.stroke();
      break;
    case "learn":
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.font = "bold 16px sans-serif";
      ctx.fillText("i", cx - 4, cy + 6);
      break;
    default:
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.5, 0, Math.PI * 2);
      ctx.stroke();
  }
}

function interactiveDraw(
  label: string,
  subtitle: string,
  accent: string,
  icon: GalleryScreen["icon"]
): GalleryScreen["draw"] {
  return (ctx, w, h, _t) => {
    const hovered = (ctx as CanvasRenderingContext2D & { __hovered?: boolean }).__hovered ?? false;
    drawGlassBg(ctx, w, h, accent);
    drawIcon(ctx, w * 0.5, h * 0.38, icon, accent);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(label, w * 0.5, h * 0.62);
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.font = "10px sans-serif";
    ctx.fillText(subtitle, w * 0.5, h * 0.76);
    ctx.textAlign = "left";
    drawInteractiveChrome(ctx, w, h, hovered);
  };
}

export const INTERACTIVE_SCREENS: GalleryScreen[] = [
  {
    kind: "interactive",
    label: "View Plans",
    subtitle: "Choose your package",
    href: "#plans",
    accent: "#8b5cf6",
    bg: "#0a0818",
    icon: "plans",
    draw: interactiveDraw("View Plans", "Choose your package", "#8b5cf6", "plans"),
  },
  {
    kind: "interactive",
    label: "Setup Guide",
    subtitle: "Easy step-by-step",
    href: "#setup",
    accent: "#3b82f6",
    bg: "#0a0818",
    icon: "setup",
    draw: interactiveDraw("Setup Guide", "Easy step-by-step", "#3b82f6", "setup"),
  },
  {
    kind: "interactive",
    label: "Sports",
    subtitle: "Live matches & more",
    href: "#sports",
    accent: "#a855f7",
    bg: "#0a0818",
    icon: "sports",
    draw: interactiveDraw("Sports", "Live matches & more", "#a855f7", "sports"),
  },
  {
    kind: "interactive",
    label: "Movies",
    subtitle: "Thousands of titles",
    href: "#movies",
    accent: "#3b82f6",
    bg: "#0a0818",
    icon: "movies",
    draw: interactiveDraw("Movies", "Thousands of titles", "#3b82f6", "movies"),
  },
  {
    kind: "interactive",
    label: "TV",
    subtitle: "Live TV channels",
    href: "#tv",
    accent: "#6366f1",
    bg: "#0a0818",
    icon: "tv",
    draw: interactiveDraw("TV", "Live TV channels", "#6366f1", "tv"),
  },
  {
    kind: "interactive",
    label: "Cartoons",
    subtitle: "Fun for all ages",
    href: "#cartoons",
    accent: "#c084fc",
    bg: "#0a0818",
    icon: "cartoons",
    draw: interactiveDraw("Cartoons", "Fun for all ages", "#c084fc", "cartoons"),
  },
  {
    kind: "interactive",
    label: "Support",
    subtitle: "We're here to help",
    href: "#support",
    accent: "#8b5cf6",
    bg: "#0a0818",
    icon: "support",
    draw: interactiveDraw("Support", "We're here to help", "#8b5cf6", "support"),
  },
  {
    kind: "interactive",
    label: "Learn More",
    subtitle: "Discover SignalPass",
    href: "#learn-more",
    accent: "#3b82f6",
    bg: "#0a0818",
    icon: "learn",
    draw: interactiveDraw("Learn More", "Discover SignalPass", "#3b82f6", "learn"),
  },
];

// --- Preview clip draw functions (3-second loops) ---

const drawSportsPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#0d1f0d";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 2;
  ctx.strokeRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
  const bx = w * 0.35 + Math.sin(lt * 3) * w * 0.25;
  const by = h * 0.55 + Math.abs(Math.sin(lt * 5)) * -h * 0.3;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(bx, by, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(w * 0.55, h * 0.5, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.5, h * 0.5 + 14, 16, 35);
};

const drawActionPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  const grad = ctx.createLinearGradient(0, h, w, 0);
  grad.addColorStop(0, "#1a0000");
  grad.addColorStop(1, "#0a0505");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = `rgba(255,100,0,${0.4 + Math.sin(lt * 4) * 0.3})`;
  ctx.beginPath();
  ctx.arc(w * 0.6, h * 0.55, 40 + lt * 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000";
  const fx = w * 0.35 + Math.sin(lt * 2) * 15;
  ctx.beginPath();
  ctx.arc(fx, h * 0.4, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(fx - 12, h * 0.4 + 16, 24, 45);
};

const drawSciFiPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#020210";
  ctx.fillRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  ctx.fillStyle = "#6644cc";
  ctx.beginPath();
  ctx.arc(cx + 40, cy - 20, 25, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 50; i++) {
    const angle = (i / 50) * Math.PI * 2 + lt * 0.5;
    const speed = ((i * 7 + lt * 200) % 200) / 200;
    const r = speed * Math.max(w, h) * 0.6;
    ctx.strokeStyle = `rgba(100,180,255,${1 - speed})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
    ctx.lineTo(cx + Math.cos(angle) * (r - 10), cy + Math.sin(angle) * (r - 10));
    ctx.stroke();
  }
  ctx.fillStyle = "#8899cc";
  ctx.beginPath();
  ctx.moveTo(cx - 30, cy + 10);
  ctx.lineTo(cx + 30, cy);
  ctx.lineTo(cx - 20, cy - 5);
  ctx.fill();
};

const drawRacingPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#080808";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#1a1a1a";
  ctx.beginPath();
  ctx.moveTo(w * 0.3, h);
  ctx.lineTo(w * 0.45, h * 0.3);
  ctx.lineTo(w * 0.55, h * 0.3);
  ctx.lineTo(w * 0.7, h);
  ctx.fill();
  for (let i = 0; i < 12; i++) {
    const y = ((lt * 300 + i * h * 0.08) % h);
    ctx.strokeStyle = `rgba(255,170,0,${(y / h) * 0.7})`;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, y);
    ctx.lineTo(w * 0.65, y);
    ctx.stroke();
  }
  ctx.fillStyle = "#ff4400";
  ctx.fillRect(w * 0.46, h * 0.55, 24, 10);
};

const drawCartoonPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#1a0040");
  grad.addColorStop(1, "#0a0020");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  const bounce = Math.sin(lt * 4) * 12;
  ctx.fillStyle = "#44cc88";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.55 + bounce, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(w * 0.42, h * 0.48 + bounce, 5, 0, Math.PI * 2);
  ctx.arc(w * 0.58, h * 0.48 + bounce, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffcc44";
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.65, 10, 0, Math.PI * 2);
  ctx.fill();
};

const drawCookingPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#1a0f05";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#333";
  ctx.fillRect(w * 0.2, h * 0.5, w * 0.6, h * 0.35);
  ctx.fillStyle = `rgba(255,150,50,${0.3 + Math.sin(lt * 3) * 0.2})`;
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.45, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.35, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.44, h * 0.35 + 12, 12, 25);
};

const drawNewsPreview: GalleryScreen["draw"] = (ctx, w, h, _t) => {
  ctx.fillStyle = "#0c0c22";
  ctx.fillRect(0, 0, w, h);
  const grad = ctx.createRadialGradient(w * 0.5, h * 0.3, 10, w * 0.5, h * 0.5, h * 0.5);
  grad.addColorStop(0, "rgba(60,100,200,0.4)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.42, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(w * 0.44, h * 0.42 + 16, 12, 30);
  ctx.fillStyle = "#cc0000";
  ctx.fillRect(0, h * 0.85, w, h * 0.12);
};

const drawOceanPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, "#0a3050");
  grad.addColorStop(1, "#052030");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(100,200,220,${0.3 + i * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3 + i * 15 + Math.sin(lt * 2 + i) * 5);
    ctx.quadraticCurveTo(w * 0.5, h * 0.35 + i * 15, w, h * 0.3 + i * 15);
    ctx.stroke();
  }
  ctx.fillStyle = "#22aa88";
  ctx.beginPath();
  ctx.ellipse(w * 0.55 + Math.sin(lt) * 20, h * 0.55, 28, 14, 0, 0, Math.PI * 2);
  ctx.fill();
};

const drawConcertPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#08001a";
  ctx.fillRect(0, 0, w, h);
  const bars = 14;
  const bw = (w * 0.8) / bars;
  for (let i = 0; i < bars; i++) {
    const bh = h * 0.1 + Math.abs(Math.sin(lt * 4 + i * 0.6)) * h * 0.45;
    ctx.fillStyle = `hsl(${260 + i * 6}, 80%, 55%)`;
    ctx.fillRect(w * 0.1 + i * bw, h - bh - 20, bw - 2, bh);
  }
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  for (let i = 0; i < 30; i++) {
    ctx.fillRect(w * 0.1 + (i * 17) % (w * 0.8), h * 0.7 + (i * 5) % 20, 3, 8);
  }
};

const drawCityPreview: GalleryScreen["draw"] = (ctx, w, h, t) => {
  const lt = loopTime(t);
  ctx.fillStyle = "#060610";
  ctx.fillRect(0, 0, w, h);
  const buildings = [0.3, 0.6, 0.45, 0.7, 0.5, 0.55, 0.65, 0.4, 0.75, 0.5];
  buildings.forEach((bh, i) => {
    const x = i * (w / buildings.length);
    const bw = w / buildings.length - 2;
    ctx.fillStyle = "#111122";
    ctx.fillRect(x, h - bh * h, bw, bh * h);
    for (let wy = h - bh * h + 5; wy < h - 5; wy += 10) {
      for (let wx = x + 3; wx < x + bw - 3; wx += 8) {
        const lit = Math.sin(lt * 2 + wx * 0.1 + wy * 0.05) > 0.2;
        ctx.fillStyle = lit ? "rgba(100,150,255,0.8)" : "rgba(30,30,50,0.5)";
        ctx.fillRect(wx, wy, 4, 6);
      }
    }
  });
};

export const PREVIEW_SCREENS: GalleryScreen[] = [
  {
    kind: "preview",
    label: "Sports",
    bg: "#0a1a0a",
    accent: "#33cc55",
    draw: drawSportsPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.sportsSoccer,
    fallbackCanvasType: "sports",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Action",
    bg: "#0a0505",
    accent: "#ff4422",
    draw: drawActionPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.movieActionChase,
    fallbackCanvasType: "action",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Sci-Fi",
    bg: "#020210",
    accent: "#44aaff",
    draw: drawSciFiPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.movieScifiCity,
    fallbackCanvasType: "scifi",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Racing",
    bg: "#0a0a0a",
    accent: "#ffaa00",
    draw: drawRacingPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.sportsBasketball,
    fallbackCanvasType: "racing",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Cartoons",
    bg: "#0f0520",
    accent: "#ff66cc",
    draw: drawCartoonPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.cartoonRobot,
    fallbackCanvasType: "cartoons",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Cooking",
    bg: "#1a0f05",
    accent: "#ff8833",
    draw: drawCookingPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.tvRealityDinner,
    fallbackCanvasType: "cooking",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "News",
    bg: "#0a0a1a",
    accent: "#4488ff",
    draw: drawNewsPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.tvNewsStudio,
    fallbackCanvasType: "news",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Nature",
    bg: "#051a0a",
    accent: "#22ccaa",
    draw: drawOceanPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.kidsAnimalForest,
    fallbackCanvasType: "nature",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "Concert",
    bg: "#0a0015",
    accent: "#aa44ff",
    draw: drawConcertPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.signalWaves,
    fallbackCanvasType: "concert",
    durationLabel: "0:03",
  },
  {
    kind: "preview",
    label: "City",
    bg: "#0a0a15",
    accent: "#4488ff",
    draw: drawCityPreview,
    videoSrc: PREVIEW_VIDEO_PATHS.movieScifiCity,
    fallbackCanvasType: "city",
    durationLabel: "0:03",
  },
];

const FALLBACK_DRAW_MAP: Record<FallbackCanvasType, GalleryScreen["draw"]> = {
  sports: drawSportsPreview,
  action: drawActionPreview,
  scifi: drawSciFiPreview,
  racing: drawRacingPreview,
  cartoons: drawCartoonPreview,
  cooking: drawCookingPreview,
  news: drawNewsPreview,
  nature: drawOceanPreview,
  concert: drawConcertPreview,
  city: drawCityPreview,
};

/** Look up a gallery screen definition by preview label (CSS wall tiles) */
export function getPreviewScreenForLabel(
  label: string
): GalleryScreen | undefined {
  return PREVIEW_SCREENS.find((s) => s.label === label);
}

/** Resolve procedural canvas draw when preview video is unavailable */
export function resolveFallbackDraw(screen: GalleryScreen): GalleryScreen["draw"] {
  if (screen.fallbackCanvasType) {
    return FALLBACK_DRAW_MAP[screen.fallbackCanvasType] ?? screen.draw;
  }
  return screen.draw;
}

/** @deprecated Use PREVIEW_SCREENS — kept for compatibility */
const channels = PREVIEW_SCREENS;
export default channels;

export type DeviceTier = "desktop" | "tablet" | "mobile";

/** Shared drag/click coordination between camera and interactive TVs */
export const galleryInteraction = {
  pointerOverScreen: false,
  pointerDownOnScreen: false,
};

export interface GalleryPlacement {
  position: [number, number, number];
  screen: GalleryScreen;
  scale?: number;
  depthDim?: number;
}

const RING_EYE_DEFAULT = 6.0;

/** Base TV mesh size — keep in sync with TVScreen.tsx */
const BASE_W = 3.15;
const BASE_H = 1.77;

function wallPos(
  angleDeg: number,
  y: number,
  radius: number
): [number, number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [Math.sin(a) * radius, y, Math.cos(a) * radius];
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function normalizeAngle(angleDeg: number) {
  return ((angleDeg + 180) % 360) - 180;
}

function depthFromAngle(angleDeg: number, y: number): number {
  const abs = Math.abs(normalizeAngle(angleDeg));
  const radial = clamp(1 - abs / 175, 0.62, 1);
  const vertical = clamp(1 - (Math.abs(y) / 4.2) * 0.12, 0.78, 1);
  return radial * vertical;
}

function cellScale(
  angleDeg: number,
  base: number,
  layout: GalleryLayoutParams
): number {
  const abs = Math.abs(normalizeAngle(angleDeg));
  if (abs < 38) return base * layout.frontScreenScale;
  if (abs > 138) return base * layout.backScreenScale;
  return base;
}

/** Interactive tile offsets from wall center column (row, dCol, screenIndex, scaleMul?) */
const INTERACTIVE_OFFSETS: {
  row: number;
  dCol: number;
  screenIndex: number;
  scaleMul?: number;
}[] = [
  { row: 2, dCol: -2, screenIndex: 2, scaleMul: 1.04 },
  { row: 2, dCol: -1, screenIndex: 3, scaleMul: 1.04 },
  { row: 2, dCol: 0, screenIndex: 0, scaleMul: 1.1 },
  { row: 2, dCol: 1, screenIndex: 4, scaleMul: 1.04 },
  { row: 2, dCol: 2, screenIndex: 5, scaleMul: 1.04 },
  { row: 1, dCol: -1, screenIndex: 1, scaleMul: 1.0 },
  { row: 1, dCol: 0, screenIndex: 6, scaleMul: 1.0 },
  { row: 3, dCol: 0, screenIndex: 7, scaleMul: 1.0 },
];

function interactiveCellKey(row: number, col: number) {
  return `${row}:${col}`;
}

function buildWallGrid(
  tier: DeviceTier,
  layout: GalleryLayoutParams,
  radius: number
): GalleryPlacement[] {
  const baseScale =
    tier === "desktop" ? 0.85 : tier === "tablet" ? 0.78 : 0.72;
  const screenW = BASE_W * baseScale;
  const screenH = BASE_H * baseScale;

  const cols = Math.max(
    tier === "mobile" ? 10 : 14,
    Math.ceil((2 * Math.PI * radius) / screenW) + 2
  );
  const rows = tier === "desktop" ? 5 : tier === "tablet" ? 4 : 3;
  const angleStep = 360 / cols;
  const rowStep = screenH * layout.ringSpacing;
  const centerCol = Math.floor(cols / 2);

  const interactiveMap = new Map<
    string,
    (typeof INTERACTIVE_OFFSETS)[number]
  >();
  const interactiveCount = tier === "mobile" ? 6 : 8;
  for (let i = 0; i < interactiveCount; i++) {
    const cell = INTERACTIVE_OFFSETS[i];
    const col = centerCol + cell.dCol;
    if (col < 0 || col >= cols) continue;
    interactiveMap.set(interactiveCellKey(cell.row, col), cell);
  }

  const placements: GalleryPlacement[] = [];
  let previewIdx = 0;

  for (let row = 0; row < rows; row++) {
    const y = (row - (rows - 1) / 2) * rowStep;
    for (let col = 0; col < cols; col++) {
      const angle = col * angleStep - 180 + angleStep / 2;
      const interactive = interactiveMap.get(interactiveCellKey(row, col));

      if (interactive) {
        const scale =
          baseScale *
          (interactive.scaleMul ?? 1) *
          cellScale(angle, 1, layout);
        placements.push({
          position: wallPos(angle, y, radius),
          screen: INTERACTIVE_SCREENS[interactive.screenIndex],
          scale,
          depthDim: depthFromAngle(angle, y),
        });
        continue;
      }

      const scale = baseScale;
      placements.push({
        position: wallPos(angle, y, radius),
        screen: PREVIEW_SCREENS[previewIdx % PREVIEW_SCREENS.length],
        scale,
        depthDim: depthFromAngle(angle, y),
      });
      previewIdx++;
    }
  }

  return placements;
}

export function buildGalleryPlacements(
  tier: DeviceTier,
  layout: GalleryLayoutParams = {
    galleryRadius: RING_EYE_DEFAULT,
    ringSpacing: 1,
    frontScreenScale: 1,
    backScreenScale: 1,
  }
): GalleryPlacement[] {
  return buildWallGrid(tier, layout, layout.galleryRadius);
}
