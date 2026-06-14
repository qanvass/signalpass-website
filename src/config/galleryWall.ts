import { PREVIEW_VIDEO_PATHS } from "../utils/channelRegistry";

export type WallTileKind = "preview" | "interactive";

export interface WallTile {
  kind: WallTileKind;
  label: string;
  subtitle?: string;
  href?: string;
  accent: string;
  videoSrc?: string;
  icon?: "plans" | "setup" | "sports" | "movies" | "tv" | "cartoons" | "support" | "learn";
}

/** Preview clips cycle through the wall; interactive tiles sit on the front arc */
export const WALL_PREVIEWS: WallTile[] = [
  {
    kind: "preview",
    label: "Sports",
    accent: "#33cc55",
    videoSrc: PREVIEW_VIDEO_PATHS.sportsSoccer,
  },
  {
    kind: "preview",
    label: "Action",
    accent: "#ff4422",
    videoSrc: PREVIEW_VIDEO_PATHS.movieActionChase,
  },
  {
    kind: "preview",
    label: "Sci-Fi",
    accent: "#44aaff",
    videoSrc: PREVIEW_VIDEO_PATHS.movieScifiCity,
  },
  {
    kind: "preview",
    label: "Racing",
    accent: "#ffaa00",
    videoSrc: PREVIEW_VIDEO_PATHS.sportsBasketball,
  },
  {
    kind: "preview",
    label: "Cartoons",
    accent: "#c084fc",
    videoSrc: PREVIEW_VIDEO_PATHS.cartoonRobot,
  },
  {
    kind: "preview",
    label: "Cooking",
    accent: "#ff9944",
    videoSrc: PREVIEW_VIDEO_PATHS.tvRealityDinner,
  },
  {
    kind: "preview",
    label: "News",
    accent: "#5588cc",
    videoSrc: PREVIEW_VIDEO_PATHS.tvNewsStudio,
  },
  {
    kind: "preview",
    label: "Nature",
    accent: "#22aa88",
    videoSrc: PREVIEW_VIDEO_PATHS.kidsAnimalForest,
  },
  {
    kind: "preview",
    label: "Concert",
    accent: "#aa66ff",
    videoSrc: PREVIEW_VIDEO_PATHS.signalWaves,
  },
  {
    kind: "preview",
    label: "City",
    accent: "#4488ff",
    videoSrc: PREVIEW_VIDEO_PATHS.movieScifiCity,
  },
];

export const WALL_INTERACTIVE: WallTile[] = [
  {
    kind: "interactive",
    label: "Plans",
    subtitle: "Choose your package",
    href: "#plans",
    accent: "#8b5cf6",
    icon: "plans",
  },
  {
    kind: "interactive",
    label: "Setup Guide",
    subtitle: "Easy step-by-step",
    href: "#setup",
    accent: "#3b82f6",
    icon: "setup",
  },
  {
    kind: "interactive",
    label: "Sports",
    subtitle: "Live matches & more",
    href: "#sports",
    accent: "#a855f7",
    icon: "sports",
  },
  {
    kind: "interactive",
    label: "Movies",
    subtitle: "Thousands of titles",
    href: "#movies",
    accent: "#3b82f6",
    icon: "movies",
  },
  {
    kind: "interactive",
    label: "TV",
    subtitle: "Live TV channels",
    href: "#tv",
    accent: "#6366f1",
    icon: "tv",
  },
  {
    kind: "interactive",
    label: "Cartoons",
    subtitle: "Fun for all ages",
    href: "#cartoons",
    accent: "#c084fc",
    icon: "cartoons",
  },
  {
    kind: "interactive",
    label: "Support",
    subtitle: "We're here to help",
    href: "#support",
    accent: "#8b5cf6",
    icon: "support",
  },
  {
    kind: "interactive",
    label: "Learn More",
    subtitle: "Discover SignalPass",
    href: "#learn-more",
    accent: "#3b82f6",
    icon: "learn",
  },
];

/** Which (row, colOffset from center) cells are interactive on the front wall */
export const INTERACTIVE_SLOTS: { row: number; dCol: number; index: number }[] = [
  { row: 2, dCol: -2, index: 2 },
  { row: 2, dCol: -1, index: 3 },
  { row: 2, dCol: 0, index: 0 },
  { row: 2, dCol: 1, index: 4 },
  { row: 2, dCol: 2, index: 5 },
  { row: 1, dCol: -1, index: 1 },
  { row: 1, dCol: 0, index: 6 },
  { row: 3, dCol: 0, index: 7 },
];

export function getWallDimensions() {
  const cols = 18;
  const rows = 5;
  return { cols, rows };
}

export function buildWallCells(): WallTile[][] {
  const { cols, rows } = getWallDimensions();
  const centerCol = Math.floor(cols / 2);
  const grid: WallTile[][] = Array.from({ length: rows }, () => []);
  let previewIdx = 0;

  const interactiveMap = new Map<string, number>();
  for (const slot of INTERACTIVE_SLOTS) {
    interactiveMap.set(`${slot.row}:${centerCol + slot.dCol}`, slot.index);
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row}:${col}`;
      const interactiveIdx = interactiveMap.get(key);
      if (interactiveIdx !== undefined) {
        grid[row].push(WALL_INTERACTIVE[interactiveIdx]);
      } else {
        grid[row].push(WALL_PREVIEWS[previewIdx % WALL_PREVIEWS.length]);
        previewIdx++;
      }
    }
  }

  return grid;
}
