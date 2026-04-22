import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = fileURLToPath(new URL("../", import.meta.url));
const dataPath = path.join(rootDir, "data", "latest.json");
const outputPath = path.join(rootDir, "data", "latest.js");

const raw = await readFile(dataPath, "utf8");
const parsed = JSON.parse(raw);

if (!Array.isArray(parsed.feed) || parsed.feed.length === 0) {
  throw new Error("data/latest.json must contain a non-empty feed array.");
}

if (!Array.isArray(parsed.sources) || parsed.sources.length === 0) {
  throw new Error("data/latest.json must contain a non-empty sources array.");
}

parsed.feed.sort((left, right) => right.date.localeCompare(left.date));
parsed.meta.generatedByBuild = new Date().toISOString();

const output = `window.EISBACH_DATA = ${JSON.stringify(parsed, null, 2)};\n`;
await writeFile(outputPath, output, "utf8");

console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
