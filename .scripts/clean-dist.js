import { rmSync } from "fs";
import { resolve } from "path";
import { fileURLToPath } from "url";

const dirname = fileURLToPath(new URL('.', import.meta.url))
const distFolder = resolve(dirname, "..", "dist");

try {
  rmSync(distFolder, { recursive: true });
} catch (err) {
  console.error(`Error while deleting ${distFolder}.`);
}
