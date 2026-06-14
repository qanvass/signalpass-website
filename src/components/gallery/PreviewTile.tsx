import { useRef, useEffect, useState, useMemo } from "react";
import {
  acquireSharedPreviewVideo,
  posterForVideo,
} from "../../utils/sharedPreviewVideo";
import {
  getPreviewScreenForLabel,
  resolveFallbackDraw,
  type GalleryScreen,
} from "../../utils/channelRegistry";
import type { WallTile } from "../../config/galleryWall";

const TEX_W = 320;
const TEX_H = 180;

function paintPreviewCanvas(
  ctx: CanvasRenderingContext2D,
  draw: GalleryScreen["draw"],
  screen: GalleryScreen,
  t: number
) {
  ctx.fillStyle = screen.accent;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  draw(ctx, TEX_W, TEX_H, t);
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = screen.accent;
  ctx.globalAlpha = 0.72;
  ctx.fillRect(0, 0, TEX_W, TEX_H);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(255,255,255,0.2)";
  ctx.fillRect(0, 0, TEX_W, TEX_H);
}

interface PreviewTileProps {
  tile: WallTile;
  /** Show subtle PREVIEW tag on ~1/4 of tiles only */
  showPreviewTag: boolean;
}

export default function PreviewTile({ tile, showPreviewTag }: PreviewTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const usingVideoRef = useRef(false);
  const [usingVideo, setUsingVideo] = useState(false);
  const poster = tile.videoSrc ? posterForVideo(tile.videoSrc) : undefined;
  const screen = useMemo(
    () => getPreviewScreenForLabel(tile.label),
    [tile.label]
  );
  const fallbackDraw = useMemo(
    () => (screen ? resolveFallbackDraw(screen) : null),
    [screen]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !screen || !fallbackDraw) return;

    let cancelled = false;
    let raf = 0;
    let video: HTMLVideoElement | null = null;
    const start = performance.now() / 1000;
    usingVideoRef.current = false;

    const drawProcedural = () => {
      if (cancelled || usingVideoRef.current) return;
      const t = performance.now() / 1000 - start;
      paintPreviewCanvas(ctx, fallbackDraw, screen, t);
      raf = requestAnimationFrame(drawProcedural);
    };

    const drawVideo = () => {
      if (cancelled || !video) return;
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        ctx.drawImage(video, 0, 0, TEX_W, TEX_H);
      }
      raf = requestAnimationFrame(drawVideo);
    };

    drawProcedural();

    if (tile.videoSrc) {
      acquireSharedPreviewVideo(tile.videoSrc)
        .then((v) => {
          if (cancelled) return;
          video = v;
          usingVideoRef.current = true;
          setUsingVideo(true);
          cancelAnimationFrame(raf);
          drawVideo();
        })
        .catch((err) => {
          if (import.meta.env.DEV) {
            console.warn("[PreviewTile] canvas fallback", tile.label, err);
          }
        });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [tile.videoSrc, tile.label, screen, fallbackDraw]);

  const durationLabel = screen?.durationLabel ?? "0:03";

  return (
    <div
      className="wall-tile wall-tile--preview"
      style={{ ["--accent" as string]: tile.accent }}
    >
      <div className="wall-tile-media-wrap">
        <canvas
          ref={canvasRef}
          className="wall-tile-media"
          width={TEX_W}
          height={TEX_H}
          role="img"
          aria-label={`${tile.label} preview`}
        />
        {poster && !usingVideo && (
          <img className="wall-tile-poster" src={poster} alt="" aria-hidden />
        )}
      </div>
      <div className="wall-tile-chrome">
        {showPreviewTag && (
          <span className="wall-tag wall-tag--preview">Preview</span>
        )}
        <span className="wall-tag wall-tag--time">{durationLabel}</span>
      </div>
      <div className="wall-tile-glare" aria-hidden />
    </div>
  );
}
