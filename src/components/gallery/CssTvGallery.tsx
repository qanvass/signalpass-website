import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import {
  Trophy,
  Clapperboard,
  Tv,
  Gamepad2,
  Wrench,
  Headphones,
  Sparkles,
  Crown,
  type LucideIcon,
} from "lucide-react";
import PreviewTile from "./PreviewTile";
import {
  buildWallCells,
  getWallDimensions,
  type WallTile,
} from "../../config/galleryWall";

const ICONS: Record<NonNullable<WallTile["icon"]>, LucideIcon> = {
  plans: Crown,
  setup: Wrench,
  sports: Trophy,
  movies: Clapperboard,
  tv: Tv,
  cartoons: Gamepad2,
  support: Headphones,
  learn: Sparkles,
};

const TILE_BADGES: Record<NonNullable<WallTile["icon"]>, string> = {
  plans: "Plans",
  setup: "Guide",
  sports: "Live",
  movies: "VOD",
  tv: "Live",
  cartoons: "Kids",
  support: "Help",
  learn: "Info",
};

function columnDepthClass(col: number, cols: number) {
  const center = cols / 2;
  const dist = Math.min(Math.abs(col - center), cols - Math.abs(col - center));
  if (dist <= 1.5) return "css-gallery-column--front";
  if (dist <= 4) return "css-gallery-column--mid";
  return "css-gallery-column--rear";
}

function InteractiveTile({ tile }: { tile: WallTile }) {
  const Icon = tile.icon ? ICONS[tile.icon] : Sparkles;
  return (
    <a
      href={tile.href ?? "#"}
      className="wall-tile wall-tile--interactive"
      style={{ ["--accent" as string]: tile.accent }}
    >
      <span className="wall-tag wall-tag--interactive">
        {tile.icon ? TILE_BADGES[tile.icon] : "Open"}
      </span>
      <Icon className="wall-tile-icon" strokeWidth={1.4} aria-hidden />
      <span className="wall-tile-label">{tile.label}</span>
      {tile.subtitle && (
        <span className="wall-tile-sub">{tile.subtitle}</span>
      )}
    </a>
  );
}

function WallTileView({
  tile,
  col,
  rowIdx,
}: {
  tile: WallTile;
  col: number;
  rowIdx: number;
}) {
  if (tile.kind === "interactive") {
    return <InteractiveTile tile={tile} />;
  }
  return (
    <PreviewTile tile={tile} showPreviewTag={(col + rowIdx) % 6 === 0} />
  );
}

export default function CssTvGallery() {
  const { cols } = getWallDimensions();
  const grid = useMemo(() => buildWallCells(), []);
  const [rotation, setRotation] = useState(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const raf = useRef(0);

  const tick = useCallback(() => {
    if (dragging.current) return;
    if (Math.abs(velocity.current) < 0.002) {
      velocity.current = 0;
      return;
    }
    velocity.current *= 0.94;
    setRotation((r) => r + velocity.current);
    raf.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastX.current = e.clientX;
    velocity.current = 0;
    cancelAnimationFrame(raf.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    velocity.current = dx * 0.11;
    setRotation((r) => r + velocity.current);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      raf.current = requestAnimationFrame(tick);
    },
    [tick]
  );

  const columnAngle = 360 / cols;

  return (
    <div
      className="css-gallery"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div className="css-gallery-bg" aria-hidden />
      <div className="css-gallery-grain" aria-hidden />
      <div className="css-gallery-spotlight" aria-hidden />
      <div className="css-gallery-ceiling-glow" aria-hidden />

      <div className="css-gallery-floor-wrap" aria-hidden>
        <div className="css-gallery-floor css-gallery-floor--outer" />
        <div className="css-gallery-floor css-gallery-floor--inner" />
        <div className="css-gallery-floor-reflection" />
      </div>

      <div className="css-gallery-stage">
        <div
          className="css-gallery-cylinder"
          style={{ transform: `rotateY(${rotation}deg)` }}
        >
          {Array.from({ length: cols }, (_, col) => {
            const angle = col * columnAngle;
            return (
              <div
                key={col}
                className={`css-gallery-column ${columnDepthClass(col, cols)}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(min(44vw, 540px))`,
                }}
              >
                {grid.map((row, rowIdx) => (
                  <WallTileView
                    key={`${col}-${rowIdx}`}
                    tile={row[col]}
                    col={col}
                    rowIdx={rowIdx}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
