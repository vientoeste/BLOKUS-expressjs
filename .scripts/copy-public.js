import {
    existsSync,
    lstatSync,
    writeFileSync,
    readFileSync,
    mkdirSync,
    readdirSync,
  } from 'fs';
import { join, basename, resolve } from "path";
import { fileURLToPath } from "url";

const dirname = fileURLToPath(new URL('.', import.meta.url))

const copyFileSync = (source, target) => {
  const targetFile =
    existsSync(target) && lstatSync(target).isDirectory()
      ? join(target, basename(source))
      : target;

  writeFileSync(targetFile, readFileSync(source));
}

const copyFolderRecursiveSync = (source, target) => {
  const targetFolder = join(target, basename(source));
  if (!existsSync(targetFolder)) {
    mkdirSync(targetFolder);
  }

  if (lstatSync(source).isDirectory()) {
    const files = readdirSync(source);
    files.forEach(function (file) {
      const curSource = join(source, file);
      if (lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

const source = resolve(dirname, "..", "public");
const target = resolve(dirname, "..", "dist");
try {
  copyFolderRecursiveSync(source, target);
} catch (e) {
  console.error("Failed to copy over public", e);
}
  