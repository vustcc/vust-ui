import { copyFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";

const packageRoot = resolve(import.meta.dirname, "../packages/tokens");
const outputDirectory = resolve(packageRoot, "dist");

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });
await copyFile(
  resolve(packageRoot, "src/index.css"),
  resolve(outputDirectory, "index.css"),
);

console.log("已构建 @vustcc/tokens");
