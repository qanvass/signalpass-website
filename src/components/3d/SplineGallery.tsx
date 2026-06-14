/**
 * SplineGallery — premium visual layer via Spline.
 *
 * HOW TO CONNECT A SPLINE SCENE
 * ─────────────────────────────
 * 1. Design the gallery in Spline (spline.design):
 *    - immersive circular TV room / planetarium
 *    - curved rows of screens, glossy floor, purple/blue neon
 *    - drag-to-look camera, interactive tiles + preview screens
 *
 * 2. Export → Code → React
 *
 * 3. Copy the scene URL, e.g.:
 *    https://prod.spline.design/your-id/scene.splinecode
 *
 * 4. Set in .env:
 *    VITE_USE_SPLINE_GALLERY=true
 *    VITE_SPLINE_SCENE_URL=https://prod.spline.design/your-id/scene.splinecode
 *
 * 5. Or self-host the .splinecode file (recommended for production / CORS):
 *    - Download from Spline export panel (download icon next to URL)
 *    - Place in public/scenes/gallery.splinecode
 *    - VITE_SPLINE_SCENE_URL=/scenes/gallery.splinecode
 *
 * FALLBACK: On load error or timeout, renders CssTvGallery automatically.
 */

import {
  Component,
  lazy,
  Suspense,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";
import CssTvGallery from "../gallery/CssTvGallery";
import { SPLINE_SCENE_URL } from "../../config/gallery";

const LOAD_TIMEOUT_MS = 25_000;

const Spline = lazy(() => import("@splinetool/react-spline"));

function LoadingState() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background: "#050510",
        color: "rgba(255,255,255,0.35)",
        fontSize: 12,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        pointerEvents: "none",
      }}
    >
      Loading gallery…
    </div>
  );
}

class SplineErrorBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export default function SplineGallery() {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded || failed) return;
    const timer = window.setTimeout(() => setFailed(true), LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [loaded, failed]);

  if (failed) {
    return <CssTvGallery />;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "#050510",
        overflow: "hidden",
      }}
    >
      {!loaded && <LoadingState />}
      <SplineErrorBoundary onError={() => setFailed(true)}>
        <Suspense fallback={<LoadingState />}>
          <Spline
            scene={SPLINE_SCENE_URL}
            onLoad={() => setLoaded(true)}
            style={{ width: "100%", height: "100%" }}
          />
        </Suspense>
      </SplineErrorBoundary>
    </div>
  );
}
