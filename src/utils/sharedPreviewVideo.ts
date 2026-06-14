/** Shared muted preview videos — one element per clip, drawn to canvases (fixes black video in CSS 3D). */

const pool = new Map<string, HTMLVideoElement>();
const pending = new Map<string, Promise<HTMLVideoElement>>();

function mountVideo(src: string): HTMLVideoElement {
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  video.style.cssText =
    "position:fixed;width:2px;height:2px;opacity:0;pointer-events:none;left:-9999px";
  video.src = src;
  document.body.appendChild(video);
  return video;
}

export function acquireSharedPreviewVideo(
  src: string
): Promise<HTMLVideoElement> {
  const existing = pool.get(src);
  if (existing) return Promise.resolve(existing);

  const inflight = pending.get(src);
  if (inflight) return inflight;

  const promise = new Promise<HTMLVideoElement>((resolve, reject) => {
    const video = mountVideo(src);

    const fail = () => {
      pending.delete(src);
      if (video.parentNode) video.parentNode.removeChild(video);
      reject(new Error(`Preview load failed: ${src}`));
    };

    const ready = () => {
      video
        .play()
        .then(() => {
          pool.set(src, video);
          pending.delete(src);
          resolve(video);
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

export function posterForVideo(src: string): string {
  const name = src.split("/").pop()?.replace(".mp4", ".jpg") ?? "poster.jpg";
  return `/media/previews/posters/${name}`;
}
