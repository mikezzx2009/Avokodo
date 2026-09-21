import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { stat } from "node:fs/promises";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  if (!process.env.SHARP_MODULE_PATH) {
    throw new Error("Install sharp or set SHARP_MODULE_PATH to its bundled module directory.");
  }
  sharp = require(process.env.SHARP_MODULE_PATH);
}

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const productRoot = join(
  projectRoot,
  "public/factory-material/pu-foam-toys/product/pu-foam-rugby-ball-stress-toy",
);
const assets = [
  { name: "sketch", quality: 90 },
  ...["01", "02", "03"].map((number) => ({ name: `render/${number}`, quality: 85 })),
  ...["01", "02", "03"].map((number) => ({ name: `picture/${number}`, quality: 85, width: 1800 })),
];

const results = await Promise.all(assets.map(async ({ name, quality, width }) => {
  const source = join(productRoot, `${name}.png`);
  const output = join(productRoot, `${name}.webp`);
  let pipeline = sharp(source).rotate();
  if (width) pipeline = pipeline.resize({ width, withoutEnlargement: true });
  const info = await pipeline.webp({ quality, effort: 6 }).toFile(output);
  const original = await stat(source);
  return {
    asset: `${name}.webp`,
    dimensions: `${info.width} x ${info.height}`,
    originalBytes: original.size,
    outputBytes: info.size,
    savedPercent: Math.round((1 - info.size / original.size) * 100),
  };
}));

console.table(results);
const originalBytes = results.reduce((total, image) => total + image.originalBytes, 0);
const outputBytes = results.reduce((total, image) => total + image.outputBytes, 0);
console.log(JSON.stringify({ originalBytes, outputBytes, savedPercent: Math.round((1 - outputBytes / originalBytes) * 100) }));
