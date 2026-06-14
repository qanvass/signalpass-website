import { useRef, useMemo, useEffect, Suspense, useState, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { MeshReflectorMaterial, PerformanceMonitor } from "@react-three/drei";
import {
  EffectComposer,
  SelectiveBloom,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import TVScreen, { BLOOM_LAYER } from "./TVScreen";
import {
  buildGalleryPlacements,
  galleryInteraction,
  type DeviceTier,
} from "../../utils/channelRegistry";
import {
  DEFAULT_GALLERY_DESIGN,
  layoutFromDesign,
  type GalleryDesign,
} from "../../config/galleryDesign";
import { useGalleryDesign } from "../../hooks/useGalleryDesign";

const DRAG_THRESHOLD = 5;
const DEFAULT_YAW = 0;

function CameraController({ design }: { design: GalleryDesign }) {
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const downPointer = useRef({ x: 0, y: 0 });
  const activePointerId = useRef<number | null>(null);

  const getInitialAngles = () => {
    if (typeof window === "undefined")
      return { yaw: DEFAULT_YAW, pitch: design.cameraPitch };
    const search =
      window.location.search || window.location.hash.split("?")[1] || "";
    const params = new URLSearchParams(search);
    const view = params.get("view");
    switch (view) {
      case "left":
        return { yaw: -Math.PI / 2, pitch: 0 };
      case "right":
        return { yaw: Math.PI / 2, pitch: 0 };
      case "rear":
        return { yaw: Math.PI, pitch: 0 };
      case "up":
        return { yaw: 0, pitch: Math.PI / 2 - 0.1 };
      case "down":
        return { yaw: 0, pitch: -Math.PI / 2 + 0.1 };
      default:
        return { yaw: DEFAULT_YAW, pitch: design.cameraPitch };
    }
  };

  const initial = useMemo(
    () => getInitialAngles(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [design.cameraPitch]
  );
  const yaw = useRef(initial.yaw);
  const pitch = useRef(initial.pitch);

  useEffect(() => {
    pitch.current = design.cameraPitch;
  }, [design.cameraPitch]);

  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = design.cameraFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, design.cameraFov]);

  useEffect(() => {
    const el = gl.domElement;

    const onDown = (e: PointerEvent) => {
      if (galleryInteraction.pointerOverScreen) return;
      activePointerId.current = e.pointerId;
      isDragging.current = false;
      downPointer.current = { x: e.clientX, y: e.clientY };
      prevPointer.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      const totalDx = e.clientX - downPointer.current.x;
      const totalDy = e.clientY - downPointer.current.y;

      if (
        !isDragging.current &&
        Math.hypot(totalDx, totalDy) > DRAG_THRESHOLD
      ) {
        if (galleryInteraction.pointerDownOnScreen) return;
        isDragging.current = true;
      }
      if (!isDragging.current) return;

      yaw.current -= dx * 0.003;
      pitch.current -= dy * 0.003;
      pitch.current = Math.max(-1.55, Math.min(1.55, pitch.current));
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      isDragging.current = false;
      activePointerId.current = null;
      galleryInteraction.pointerDownOnScreen = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame(() => {
    camera.position.y = design.cameraHeight;
    const lookX = Math.sin(yaw.current) * Math.cos(pitch.current) * 10;
    const lookY =
      Math.sin(pitch.current) * 10 + design.cameraHeight * 0.15;
    const lookZ = Math.cos(yaw.current) * Math.cos(pitch.current) * 10;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

function useDeviceTier(): DeviceTier | "fallback" {
  if (typeof navigator === "undefined") return "desktop";
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) return "fallback";
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const isTablet =
    isMobile && Math.min(window.innerWidth, window.innerHeight) > 600;
  if (isTablet) return "tablet";
  if (isMobile) return "mobile";
  return "desktop";
}

function TVScreenGroup({
  tier,
  design,
}: {
  tier: DeviceTier;
  design: GalleryDesign;
}) {
  const placements = useMemo(
    () => buildGalleryPlacements(tier, layoutFromDesign(design)),
    [
      tier,
      design.galleryRadius,
      design.ringSpacing,
      design.frontScreenScale,
      design.backScreenScale,
    ]
  );

  return (
    <group>
      {placements.map((p, i) => (
        <TVScreen
          key={`${p.screen.label}-${i}`}
          position={p.position}
          screen={p.screen}
          tier={tier}
          scale={p.scale ?? 1}
          depthDim={p.depthDim ?? 1}
          screenBrightness={design.screenBrightness}
          bezelGlow={design.bezelGlow}
        />
      ))}
    </group>
  );
}

function enableBloom(mesh: THREE.Object3D) {
  mesh.layers.enable(BLOOM_LAYER);
}

function GalleryRoom({ wallRibIntensity }: { wallRibIntensity: number }) {
  const ribs = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => {
        const a = (i / 28) * Math.PI * 2;
        const r = 10.2;
        return [Math.sin(a) * r, 0, Math.cos(a) * r, a] as const;
      }),
    []
  );

  const ribGlow = 0.45 * wallRibIntensity;

  return (
    <group>
      <mesh>
        <cylinderGeometry args={[10.5, 10.5, 13, 56, 1, true]} />
        <meshBasicMaterial
          color="#07061a"
          transparent
          opacity={0.72}
          side={THREE.BackSide}
        />
      </mesh>

      <mesh position={[0, -5.8, 0]}>
        <cylinderGeometry args={[10.8, 10.8, 0.08, 56, 1, true]} />
        <meshBasicMaterial color="#0c0a22" transparent opacity={0.5} />
      </mesh>

      {ribs.map(([x, , z, a], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, -a + Math.PI, 0]}>
          <mesh position={[0, 0, 0.12]}>
            <boxGeometry args={[0.05, 10.5, 0.18]} />
            <meshBasicMaterial
              color={i % 2 === 0 ? "#1a0e38" : "#0e1430"}
              transparent
              opacity={0.9}
            />
          </mesh>
          {i % 3 === 0 && (
            <mesh position={[0, 2.8, 0.2]} ref={(m) => m && enableBloom(m)}>
              <boxGeometry args={[0.03, 2.2, 0.03]} />
              <meshBasicMaterial
                color="#3b82f6"
                transparent
                opacity={ribGlow}
                toneMapped={false}
                fog={false}
              />
            </mesh>
          )}
        </group>
      ))}

      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 6.2, 0]}
        ref={(m) => m && enableBloom(m)}
      >
        <torusGeometry args={[9.2, 0.045, 8, 96]} />
        <meshBasicMaterial
          color="#6366f1"
          toneMapped={false}
          fog={false}
          transparent
          opacity={0.55 + wallRibIntensity * 0.45}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 6.05, 0]}>
        <torusGeometry args={[7.8, 0.022, 8, 72]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={(0.55 + wallRibIntensity * 0.45) * 0.85}
          toneMapped={false}
          fog={false}
        />
      </mesh>
    </group>
  );
}

function GalleryPlatform({
  floorReflection,
  floorRingIntensity,
}: {
  floorReflection: number;
  floorRingIntensity: number;
}) {
  const rings = [
    { inner: 2.6, outer: 2.88, color: "#8b5cf6", opacity: 0.65 },
    { inner: 4.2, outer: 4.42, color: "#6366f1", opacity: 0.42 },
    { inner: 5.8, outer: 5.98, color: "#3b82f6", opacity: 0.32 },
    { inner: 7.6, outer: 7.75, color: "#7c3aed", opacity: 0.22 },
  ];

  return (
    <group position={[0, -4.0, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[11, 72]} />
        <meshStandardMaterial
          color="#05050e"
          metalness={0.8}
          roughness={0.32}
          fog={false}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[10.8, 72]} />
        <MeshReflectorMaterial
          blur={[500, 150]}
          resolution={1024}
          mixBlur={1}
          mixStrength={0.85}
          roughness={0.55}
          depthScale={1.1}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.25}
          color="#080812"
          metalness={0.65}
          mirror={floorReflection}
        />
      </mesh>

      {rings.map((ring, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.045, 0]}
          ref={(m) => m && enableBloom(m)}
        >
          <ringGeometry args={[ring.inner, ring.outer, 96]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity * floorRingIntensity}
            toneMapped={false}
            fog={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function PostEffectsDesktop({
  degraded,
  lights,
  design,
}: {
  degraded: boolean;
  lights: RefObject<THREE.PointLight>[];
  design: GalleryDesign;
}) {
  const bloomIntensity = degraded
    ? design.bloomIntensity * 0.68
    : design.bloomIntensity;

  if (degraded) {
    return (
      <EffectComposer multisampling={0}>
        <SelectiveBloom
          lights={lights}
          selectionLayer={BLOOM_LAYER}
          mipmapBlur
          intensity={bloomIntensity}
          luminanceThreshold={design.bloomThreshold}
          luminanceSmoothing={0.38}
          blendFunction={BlendFunction.ADD}
        />
        <Vignette
          offset={0.22}
          darkness={design.vignetteDarkness}
          eskil={false}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <SelectiveBloom
        lights={lights}
        selectionLayer={BLOOM_LAYER}
        mipmapBlur
        intensity={bloomIntensity}
        luminanceThreshold={design.bloomThreshold}
        luminanceSmoothing={0.38}
        blendFunction={BlendFunction.ADD}
      />
      <Vignette
        offset={0.22}
        darkness={design.vignetteDarkness}
        eskil={false}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}

function PostEffectsTablet({
  lights,
  design,
}: {
  lights: RefObject<THREE.PointLight>[];
  design: GalleryDesign;
}) {
  return (
    <EffectComposer multisampling={0}>
      <SelectiveBloom
        lights={lights}
        selectionLayer={BLOOM_LAYER}
        mipmapBlur
        intensity={design.bloomIntensity * 0.76}
        luminanceThreshold={design.bloomThreshold + 0.06}
        luminanceSmoothing={0.42}
      />
      <Vignette
        offset={0.22}
        darkness={design.vignetteDarkness * 0.88}
        eskil={false}
      />
    </EffectComposer>
  );
}

function SceneLights({
  lightRefs,
}: {
  lightRefs: RefObject<THREE.PointLight>[];
}) {
  return (
    <>
      <ambientLight intensity={0.22} />
      <pointLight
        ref={lightRefs[0]}
        color="#8b5cf6"
        intensity={1.0}
        distance={38}
        position={[0, 4.5, 3]}
      />
      <pointLight
        ref={lightRefs[1]}
        color="#3b82f6"
        intensity={0.55}
        distance={32}
        position={[0, -1.5, 5]}
      />
      <pointLight
        ref={lightRefs[2]}
        color="#6366f1"
        intensity={0.45}
        distance={28}
        position={[-7, 0.5, 5]}
      />
      <pointLight
        ref={lightRefs[3]}
        color="#a855f7"
        intensity={0.45}
        distance={28}
        position={[7, 0.5, 5]}
      />
    </>
  );
}

function StaticFallback() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background:
          "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "80%",
          maxWidth: 600,
          aspectRatio: "16/9",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          background:
            "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))",
          display: "grid",
          placeItems: "center",
          color: "rgba(255,255,255,0.15)",
          fontSize: 14,
          fontFamily: "sans-serif",
        }}
      >
        signalpass.tv
      </div>
    </div>
  );
}

function HeroSceneCanvas({ design }: { design: GalleryDesign }) {
  const tier = useDeviceTier();
  const [degraded, setDegraded] = useState(false);
  const light0 = useRef<THREE.PointLight>(null!);
  const light1 = useRef<THREE.PointLight>(null!);
  const light2 = useRef<THREE.PointLight>(null!);
  const light3 = useRef<THREE.PointLight>(null!);
  const bloomLights = useMemo(
    () => [light0, light1, light2, light3],
    [light0, light1, light2, light3]
  );

  if (tier === "fallback") return <StaticFallback />;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
      <Canvas
        dpr={[1, tier === "desktop" ? 1.5 : 1]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.22,
        }}
        camera={{
          position: [0, design.cameraHeight, 0],
          fov: design.cameraFov,
          near: 0.1,
          far: 100,
        }}
        style={{ background: "#050510", touchAction: "none" }}
        onCreated={({ camera }) => {
          camera.layers.enable(BLOOM_LAYER);
        }}
      >
        <PerformanceMonitor
          onDecline={() => setDegraded(true)}
          onIncline={() => setDegraded(false)}
          flipflops={2}
        />
        <color attach="background" args={["#050510"]} />
        <SceneLights lightRefs={bloomLights} />
        <fog
          attach="fog"
          args={["#050510", design.fogNear, design.fogFar]}
        />
        <Suspense fallback={null}>
          <GalleryRoom wallRibIntensity={design.wallRibIntensity} />
          <GalleryPlatform
            floorReflection={design.floorReflection}
            floorRingIntensity={design.floorRingIntensity}
          />
          <CameraController design={design} />
          <TVScreenGroup tier={tier} design={design} />
        </Suspense>
        {tier === "desktop" && (
          <PostEffectsDesktop
            degraded={degraded}
            lights={bloomLights}
            design={design}
          />
        )}
        {tier === "tablet" && (
          <PostEffectsTablet lights={bloomLights} design={design} />
        )}
      </Canvas>
    </div>
  );
}

function HeroSceneDev() {
  const design = useGalleryDesign();
  return <HeroSceneCanvas design={design} />;
}

function HeroSceneProd() {
  return <HeroSceneCanvas design={DEFAULT_GALLERY_DESIGN} />;
}

export default function HeroScene() {
  return import.meta.env.DEV ? <HeroSceneDev /> : <HeroSceneProd />;
}
