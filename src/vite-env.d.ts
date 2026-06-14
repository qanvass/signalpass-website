/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_SPLINE_GALLERY?: string;
  readonly VITE_SPLINE_SCENE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
