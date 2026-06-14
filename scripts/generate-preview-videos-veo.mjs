/**
 * Generates gallery preview MP4s with Gemini Veo 3 (+ optional ffmpeg web optimize).
 *
 * Prerequisites:
 *   - GEMINI_API_KEY from https://aistudio.google.com/apikey (paid tier for Veo)
 *   - ffmpeg on PATH (optional, for posters + web-optimized MP4s)
 *
 * Usage:
 *   npm run generate:previews
 *   npm run generate:previews -- --only=sports-soccer,movie-scifi-city
 *   npm run generate:previews -- --force
 *
 * Env:
 *   GEMINI_API_KEY          required
 *   VEO_MODEL               default: veo-3.0-generate-001
 *   VEO_DURATION_SECONDS    default: 4
 *   VEO_RESOLUTION          default: 720p
 *   VEO_POLL_MS             default: 10000
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleGenAI } from "@google/genai";
import { PREVIEW_CLIPS } from "./preview-clips.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "media", "previews");
const posterDir = join(outDir, "posters");
const rawDir = join(outDir, ".veo-raw");

mkdirSync(outDir, { recursive: true });
mkdirSync(posterDir, { recursive: true });
mkdirSync(rawDir, { recursive: true });

const args = process.argv.slice(2);
const force = args.includes("--force");
const onlyArg = args.find((a) => a.startsWith("--only="));
const onlyIds = onlyArg
  ? new Set(onlyArg.replace("--only=", "").split(",").map((s) => s.trim()).filter(Boolean))
  : null;

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
if (!apiKey) {
  console.error(
    "Missing GEMINI_API_KEY. Create one at https://aistudio.google.com/apikey and run:\n" +
      '  $env:GEMINI_API_KEY="your-key"; npm run generate:previews'
  );
  process.exit(1);
}

const model = process.env.VEO_MODEL ?? "veo-3.0-generate-001";
const durationSeconds = Number(process.env.VEO_DURATION_SECONDS ?? "4");
const resolution = process.env.VEO_RESOLUTION ?? "720p";
const pollMs = Number(process.env.VEO_POLL_MS ?? "10000");

const ai = new GoogleGenAI({ apiKey });

function hasFfmpeg() {
  const r = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return r.status === 0;
}

function runFfmpeg(args, label) {
  console.log(`  ${label}`);
  const result = spawnSync("ffmpeg", args, { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`ffmpeg failed: ${label}`);
}

function optimizeForWeb(rawPath, outPath) {
  runFfmpeg(
    [
      "-y",
      "-i",
      rawPath,
      "-an",
      "-vf",
      "scale=854:480:force_original_aspect_ratio=decrease,pad=854:480:(ow-iw)/2:(oh-ih)/2",
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outPath,
    ],
    "Optimizing for web..."
  );
}

function writePoster(videoPath, posterPath) {
  runFfmpeg(
    ["-y", "-ss", "1", "-i", videoPath, "-frames:v", "1", "-q:v", "2", posterPath],
    `Poster ${basename(posterPath)}`
  );
}

async function pollUntilDone(operation) {
  while (!operation.done) {
    console.log("  Waiting for Veo...");
    await new Promise((resolve) => setTimeout(resolve, pollMs));
    operation = await ai.operations.getVideosOperation({ operation });
  }
  return operation;
}

async function downloadVideo(fileHandle, destPath) {
  await ai.files.download({ file: fileHandle, downloadPath: destPath });
}

async function generateClip(clip) {
  const outPath = join(outDir, clip.file);
  const posterPath = join(posterDir, basename(clip.file, ".mp4") + ".jpg");
  const rawPath = join(rawDir, clip.file);

  if (existsSync(outPath) && !force) {
    console.log(`Skip ${clip.id} — ${clip.file} exists (use --force to regenerate)`);
    if (!existsSync(posterPath) && hasFfmpeg()) writePoster(outPath, posterPath);
    return;
  }

  console.log(`\n[${clip.id}] Generating with ${model}...`);

  let operation = await ai.models.generateVideos({
    model,
    prompt: clip.prompt,
    config: {
      aspectRatio: "16:9",
      durationSeconds,
      resolution,
      personGeneration: "allow_adult",
    },
  });

  operation = await pollUntilDone(operation);

  const generated = operation.response?.generatedVideos?.[0]?.video;
  if (!generated) {
    throw new Error(`No video returned for ${clip.id}`);
  }

  await downloadVideo(generated, rawPath);

  if (hasFfmpeg()) {
    optimizeForWeb(rawPath, outPath);
    writePoster(outPath, posterPath);
  } else {
    console.warn("  ffmpeg not found — saving raw Veo output only.");
    const bytes = readFileSync(rawPath);
    writeFileSync(outPath, bytes);
  }

  console.log(`  Saved ${clip.file}`);
}

async function main() {
  const clips = onlyIds
    ? PREVIEW_CLIPS.filter((c) => onlyIds.has(c.id))
    : PREVIEW_CLIPS;

  if (clips.length === 0) {
    console.error("No clips matched --only filter.");
    process.exit(1);
  }

  console.log(
    `Veo preview generation — ${clips.length} clip(s), model=${model}, ${resolution}, ${durationSeconds}s`
  );

  for (const clip of clips) {
    try {
      await generateClip(clip);
    } catch (err) {
      console.error(`Failed ${clip.id}:`, err?.message ?? err);
      process.exitCode = 1;
    }
  }

  console.log(`\nDone — outputs in public/media/previews/`);
}

main();
