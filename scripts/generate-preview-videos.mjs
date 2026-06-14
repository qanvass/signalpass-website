/**
 * Offline fallback: bright fictional 3-second preview MP4s + poster JPGs (ffmpeg drawbox).
 * For production clips use Gemini Veo 3 instead: npm run generate:previews
 * Usage: npm run generate:previews:ffmpeg
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "media", "previews");
const posterDir = join(outDir, "posters");
mkdirSync(outDir, { recursive: true });
mkdirSync(posterDir, { recursive: true });

const W = 854;
const H = 480;
const D = 3;
const FPS = 30;

const clips = [
  {
    file: "sports-soccer-fictional.mp4",
    bg: "0x2ecc71",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x2ecc71@1:t=fill,drawbox=x='mod(t*200\\,654)':y=120:w=200:h=200:color=white@1:t=fill,drawbox=x=327:y=340:w=200:h=80:color=0x27ae60@1:t=fill",
  },
  {
    file: "sports-basketball-fictional.mp4",
    bg: "0xff8844",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0xff8844@1:t=fill,drawbox=x=327:y='80+120*abs(sin(t*4))':w=200:h=200:color=0xff5500@1:t=fill,drawbox=x=280:y='70+120*abs(sin(t*4))':w=294:h=24:color=0xcc4400@1:t=fill",
  },
  {
    file: "movie-scifi-city-fictional.mp4",
    bg: "0x5522cc",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x5522cc@1:t=fill,drawbox=x='mod(t*160\\,854)':y=40:w=40:h=400:color=0x00ffff@1:t=fill,drawbox=x='mod(t*100+200\\,854)':y=60:w=60:h=360:color=0xff66ff@1:t=fill,drawbox=x=0:y=320:w=854:h=160:color=0x8833ff@1:t=fill",
  },
  {
    file: "movie-action-chase-fictional.mp4",
    bg: "0xcc2244",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0xcc2244@1:t=fill,drawbox=x='854-mod(t*280\\,1000)':y=160:w=280:h=100:color=0xff4400@1:t=fill,drawbox=x='854-mod(t*360\\,1100)':y=260:w=200:h=70:color=0xffcc00@1:t=fill",
  },
  {
    file: "tv-reality-dinner-fictional.mp4",
    bg: "0xcc8844",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0xcc8844@1:t=fill,drawbox=x=140:y=80:w=574:h=320:color=0xffcc77@1:t=fill,drawbox=x='240+60*sin(t*3)':y='60+40*sin(t*2)':w=160:h=160:color=white@0.7:t=fill",
  },
  {
    file: "tv-news-studio-fictional.mp4",
    bg: "0x2266dd",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x2266dd@1:t=fill,drawbox=x=0:y=380:w=854:h=100:color=0xee2222@1:t=fill,drawbox=x=60:y=50:w=734:h=300:color=0x4488ff@1:t=fill,drawbox=x=327:y=120:w=200:h=200:color=0xaaccff@1:t=fill",
  },
  {
    file: "cartoon-robot-fictional.mp4",
    bg: "0x6633ff",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x6633ff@1:t=fill,drawbox=x=240:y='80+50*sin(t*3)':w=374:h=300:color=0x77ddff@1:t=fill,drawbox=x=300:y='30+50*sin(t*3)':w=254:h=140:color=0xbbeeff@1:t=fill,drawbox=x=360:y='160+50*sin(t*3)':w=80:h=80:color=0xffff00@1:t=fill",
  },
  {
    file: "kids-animal-forest-fictional.mp4",
    bg: "0x77ddff",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x77ddff@1:t=fill,drawbox=x=0:y=280:w=854:h=200:color=0x33aa44@1:t=fill,drawbox=x='200+140*sin(t*2)':y=160:w=220:h=140:color=0xcc8844@1:t=fill",
  },
  {
    file: "signal-waves-fictional.mp4",
    bg: "0x441188",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x441188@1:t=fill,drawbox=x=0:y='180+90*sin(t*4)':w=854:h=28:color=0xff66ff@1:t=fill,drawbox=x=0:y='240+70*sin(t*3)':w=854:h=24:color=0x44ddff@1:t=fill,drawbox=x=0:y='300+55*sin(t*5)':w=854:h=20:color=0xcc88ff@1:t=fill",
  },
  {
    file: "setup-device-fictional.mp4",
    bg: "0x224488",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x224488@1:t=fill,drawbox=x=220:y=60:w=414:h=280:color=0x3366aa@1:t=fill,drawbox=x=260:y=100:w=334:h=200:color=0x66aaff@1:t=fill,drawbox=x='280+mod(t*120\\,254)':y=310:w=100:h=16:color=0xcc66ff@1:t=fill",
  },
  {
    file: "support-helpdesk-fictional.mp4",
    bg: "0x1155aa",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x1155aa@1:t=fill,drawbox=x=260:y=90:w=334:h=260:color=0x3388dd@1:t=fill,drawbox=x=310:y=50:w=234:h=100:color=0x55aaee@1:t=fill,drawbox=x='360+30*sin(t*3)':y=220:w=100:h=16:color=white@1:t=fill",
  },
  {
    file: "plans-cards-fictional.mp4",
    bg: "0x331144",
    vf: "drawbox=x=0:y=0:w=854:h=480:color=0x331144@1:t=fill,drawbox=x=70:y=70:w=220:h=300:color=0xbb66ff@1:t=fill,drawbox=x=317:y=60:w=220:h=310:color=0x7788ff@1:t=fill,drawbox=x=564:y=75:w=220:h=295:color=0x55bbff@1:t=fill",
  },
];

function runFfmpeg(args, label) {
  console.log(label);
  const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${label}`);
}

for (const clip of clips) {
  const out = join(outDir, clip.file);
  runFfmpeg(
    [
      "-y",
      "-f",
      "lavfi",
      "-i",
      `color=c=${clip.bg}:s=${W}x${H}:d=${D}:r=${FPS}`,
      "-vf",
      clip.vf,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "12",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      out,
    ],
    `Generating ${clip.file}...`
  );

  const poster = join(posterDir, basename(clip.file, ".mp4") + ".jpg");
  runFfmpeg(
    ["-y", "-ss", "1", "-i", out, "-frames:v", "1", "-q:v", "2", poster],
    `  Poster ${basename(poster)}...`
  );
}

console.log(`\nDone — ${clips.length} clips + posters in public/media/previews/`);
