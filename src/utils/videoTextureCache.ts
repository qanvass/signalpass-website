import * as THREE from "three";

interface CachedVideo {
  video: HTMLVideoElement;
  texture: THREE.VideoTexture;
  refs: number;
}

const cache = new Map<string, CachedVideo>();
const pending = new Map<string, Promise<THREE.VideoTexture>>();

function createVideoElement(src: string): HTMLVideoElement {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.style.cssText =
    "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px";
  video.src = src;
  document.body.appendChild(video);
  return video;
}

function bumpRef(src: string, texture: THREE.VideoTexture): THREE.VideoTexture {
  const hit = cache.get(src);
  if (hit) {
    hit.refs += 1;
    hit.texture.colorSpace = texture.colorSpace;
    return hit.texture;
  }
  return texture;
}

export function acquireVideoTexture(
  src: string,
  colorSpace: THREE.ColorSpace
): Promise<THREE.VideoTexture> {
  const hit = cache.get(src);
  if (hit) {
    hit.refs += 1;
    hit.texture.colorSpace = colorSpace;
    return Promise.resolve(hit.texture);
  }

  const inflight = pending.get(src);
  if (inflight) {
    return inflight.then((texture) => {
      bumpRef(src, texture);
      return cache.get(src)!.texture;
    });
  }

  const promise = new Promise<THREE.VideoTexture>((resolve, reject) => {
    const video = createVideoElement(src);

    const fail = () => {
      pending.delete(src);
      if (video.parentNode) video.parentNode.removeChild(video);
      reject(new Error(`video load failed: ${src}`));
    };

    const ready = () => {
      video
        .play()
        .then(() => {
          const texture = new THREE.VideoTexture(video);
          texture.minFilter = THREE.LinearFilter;
          texture.magFilter = THREE.LinearFilter;
          texture.colorSpace = colorSpace;
          cache.set(src, { video, texture, refs: 1 });
          pending.delete(src);
          resolve(texture);
        })
        .catch(fail);
    };

    video.addEventListener("loadeddata", ready, { once: true });
    video.addEventListener("error", fail, { once: true });
    video.load();
  });

  pending.set(src, promise);
  return promise;
}

export function releaseVideoTexture(src: string) {
  const hit = cache.get(src);
  if (!hit) return;
  hit.refs -= 1;
  if (hit.refs > 0) return;
  hit.texture.dispose();
  hit.video.pause();
  hit.video.removeAttribute("src");
  hit.video.load();
  if (hit.video.parentNode) hit.video.parentNode.removeChild(hit.video);
  cache.delete(src);
}
