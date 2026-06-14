import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import {
  galleryInteraction,
  resolveFallbackDraw,
  drawPreviewChrome,
  type GalleryScreen,
  type DeviceTier,
} from "../../utils/channelRegistry";
import {
  acquireVideoTexture,
  releaseVideoTexture,
} from "../../utils/videoTextureCache";

export const BLOOM_LAYER = 1;

interface TVScreenProps {
  position: [number, number, number];
  screen: GalleryScreen;
  tier: DeviceTier;
  scale?: number;
  depthDim?: number;
  screenBrightness?: number;
  bezelGlow?: number;
}

const BASE_W = 3.15;
const BASE_H = 1.77;
const TEX_W = 448;
const TEX_H = 252;

type CtxWithHover = CanvasRenderingContext2D & { __hovered?: boolean };

const warnedMissingVideos = new Set<string>();

declare global {
  interface Window {
    __tvVideoStats?: { ready: string[]; failed: string[] };
  }
}

function trackVideoReady(label: string) {
  if (!import.meta.env.DEV) return;
  const stats = (window.__tvVideoStats ??= { ready: [], failed: [] });
  if (!stats.ready.includes(label)) stats.ready.push(label);
}

function trackVideoFailed(label: string) {
  if (!import.meta.env.DEV) return;
  const stats = (window.__tvVideoStats ??= { ready: [], failed: [] });
  if (!stats.failed.includes(label)) stats.failed.push(label);
}

function warnMissingVideo(src: string, label: string) {
  if (!import.meta.env.DEV || warnedMissingVideos.has(src)) return;
  warnedMissingVideos.add(src);
  console.warn(
    `[TVScreen] Preview video missing for "${label}" (${src}). Using canvas fallback.`
  );
}

function paintCanvasScreen(
  ctx: CanvasRenderingContext2D,
  draw: GalleryScreen["draw"],
  screen: GalleryScreen,
  hovered: boolean,
  t: number,
  brightness: number
) {
  const c = ctx as CtxWithHover;
  c.__hovered = hovered;
  if (screen.kind === "preview") {
    ctx.fillStyle = screen.accent;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
  }
  draw(c, TEX_W, TEX_H, t);
  if (screen.kind === "preview") {
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = screen.accent;
    ctx.globalAlpha = 0.72;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = `rgba(255,255,255,${0.2 * brightness})`;
    ctx.fillRect(0, 0, TEX_W, TEX_H);
  }
}

function enableBloom(mesh: THREE.Object3D) {
  mesh.layers.enable(BLOOM_LAYER);
}

export default function TVScreen({
  position,
  screen,
  tier,
  scale = 1,
  depthDim = 1,
  screenBrightness = 1,
  bezelGlow = 1,
}: TVScreenProps) {
  const { gl } = useThree();
  const groupRef = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [usingVideo, setUsingVideo] = useState(false);
  const [videoMap, setVideoMap] = useState<THREE.VideoTexture | null>(null);
  const hoverT = useRef(0);
  const frameCounter = useRef(0);
  const fallbackDraw = useMemo(() => resolveFallbackDraw(screen), [screen]);

  const fpsSkip = tier === "mobile" ? 3 : tier === "tablet" ? 2 : 1;
  const s = scale;
  const w = BASE_W * s;
  const h = BASE_H * s;
  const isInteractive = screen.kind === "interactive";
  const isPreview = screen.kind === "preview";
  const brightness = (0.92 + depthDim * 0.18) * screenBrightness;
  const durationLabel = screen.durationLabel ?? "0:03";

  const [, ctx, canvasTexture] = useMemo(() => {
    const cvs = document.createElement("canvas");
    cvs.width = TEX_W;
    cvs.height = TEX_H;
    const c = cvs.getContext("2d")!;
    const tex = new THREE.CanvasTexture(cvs);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return [cvs, c, tex];
  }, []);

  const labelOverlayTexture = useMemo(() => {
    if (!isPreview) return null;
    const cvs = document.createElement("canvas");
    cvs.width = TEX_W;
    cvs.height = TEX_H;
    const c = cvs.getContext("2d")!;
    drawPreviewChrome(c, TEX_W, TEX_H, durationLabel);
    const tex = new THREE.CanvasTexture(cvs);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [isPreview, durationLabel]);

  useEffect(() => () => canvasTexture.dispose(), [canvasTexture]);
  useEffect(
    () => () => labelOverlayTexture?.dispose(),
    [labelOverlayTexture]
  );

  useEffect(() => {
    if (groupRef.current) groupRef.current.lookAt(0, 0, 0);
  }, [position]);

  useEffect(() => {
    paintCanvasScreen(
      ctx,
      isInteractive ? screen.draw : fallbackDraw,
      screen,
      hovered,
      0,
      brightness
    );
    canvasTexture.needsUpdate = true;
  }, [
    ctx,
    canvasTexture,
    screen,
    fallbackDraw,
    isInteractive,
    brightness,
    hovered,
  ]);

  useEffect(() => {
    if (isInteractive || !screen.videoSrc) return;

    let cancelled = false;
    const src = screen.videoSrc;

    acquireVideoTexture(src, gl.outputColorSpace as THREE.ColorSpace)
      .then((tex) => {
        if (cancelled) {
          releaseVideoTexture(src);
          return;
        }
        setVideoMap(tex);
        setUsingVideo(true);
        trackVideoReady(screen.label);
      })
      .catch((err) => {
        if (cancelled) return;
        setUsingVideo(false);
        setVideoMap(null);
        trackVideoFailed(screen.label);
        if (import.meta.env.DEV) {
          console.warn(`[TVScreen] ${screen.label} fallback:`, err);
        }
        warnMissingVideo(src, screen.label);
      });

    return () => {
      cancelled = true;
      releaseVideoTexture(src);
      setVideoMap(null);
      setUsingVideo(false);
    };
  }, [screen.videoSrc, screen.label, isInteractive, gl.outputColorSpace]);

  useFrame((_, delta) => {
    hoverT.current = THREE.MathUtils.lerp(
      hoverT.current,
      hovered ? 1 : 0,
      Math.min(1, delta * 8)
    );
    if (groupRef.current) {
      const ht = hoverT.current;
      groupRef.current.scale.setScalar(s * (1 + ht * 0.03));
    }

    if (usingVideo && videoMap) {
      videoMap.needsUpdate = true;
      return;
    }

    if (isInteractive) {
      frameCounter.current++;
      if (hovered || frameCounter.current % 30 === 0) {
        paintCanvasScreen(ctx, screen.draw, screen, hovered, 0, brightness);
        canvasTexture.needsUpdate = true;
      }
      return;
    }

    frameCounter.current++;
    if (frameCounter.current % fpsSkip !== 0) return;
    paintCanvasScreen(
      ctx,
      fallbackDraw,
      screen,
      hovered,
      performance.now() * 0.001,
      brightness
    );
    canvasTexture.needsUpdate = true;
  });

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    galleryInteraction.pointerOverScreen = true;
    document.body.style.cursor = isInteractive ? "pointer" : "grab";
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(false);
    galleryInteraction.pointerOverScreen = false;
    document.body.style.cursor = "default";
  };

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (!isInteractive) return;
    e.stopPropagation();
    galleryInteraction.pointerDownOnScreen = true;
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isInteractive || !screen.href) return;
    e.stopPropagation();
    window.location.hash = screen.href;
  };

  const ht = hoverT.current;
  const glowOpacity =
    ((isInteractive ? 0.32 : 0.22) * brightness + ht * 0.35) * bezelGlow;
  const glowPad = 0.15 * s;
  const videoBoost = usingVideo ? 0.65 : 0;
  const screenColor = new THREE.Color("#ffffff").multiplyScalar(
    brightness + ht * 0.1 + videoBoost
  );
  const displayMap = useMemo(
    () => (usingVideo && videoMap ? videoMap : canvasTexture),
    [usingVideo, videoMap, canvasTexture]
  );

  return (
    <group ref={groupRef} position={position} scale={s}>
      <mesh position={[0, 0, -0.08]} ref={(m) => m && enableBloom(m)}>
        <boxGeometry args={[w + 0.2, h + 0.2, 0.07]} />
        <meshBasicMaterial
          color={screen.accent}
          transparent
          opacity={glowOpacity * 0.65}
          toneMapped={false}
          fog={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[w + 0.12, h + 0.12, 0.14]} />
        <meshStandardMaterial
          color="#050505"
          metalness={0.75}
          roughness={0.28}
          fog={false}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.001]}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
      >
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          key={usingVideo ? `video-${screen.videoSrc}` : "canvas"}
          map={displayMap}
          toneMapped={false}
          color={screenColor}
          fog={false}
        />
      </mesh>

      {isPreview && labelOverlayTexture && (
        <mesh position={[0, 0, 0.003]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial
            map={labelOverlayTexture}
            transparent
            toneMapped={false}
            fog={false}
            depthWrite={false}
          />
        </mesh>
      )}

      <mesh position={[0, 0, 0.004]}>
        <planeGeometry args={[w, h]} />
        <meshPhongMaterial
          color="#ffffff"
          transparent
          opacity={usingVideo ? 0.03 : 0.05 + ht * 0.06}
          shininess={140}
          specular={new THREE.Color("#ddd6ff")}
          fog={false}
        />
      </mesh>

      <mesh position={[0, 0, -0.13]} ref={(m) => m && enableBloom(m)}>
        <planeGeometry args={[w + glowPad, h + glowPad]} />
        <meshBasicMaterial
          color={screen.accent}
          transparent
          opacity={glowOpacity}
          toneMapped={false}
          side={THREE.DoubleSide}
          fog={false}
        />
      </mesh>

      {(isInteractive || ht > 0.1) && (
        <pointLight
          color={screen.accent}
          intensity={1 + ht * 2.5}
          distance={11 * s}
          position={[0, 0, 0.55]}
        />
      )}
    </group>
  );
}
