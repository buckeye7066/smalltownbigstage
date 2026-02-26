#!/usr/bin/env node
/**
 * Extracts assets/source/smalltownbigstage.tar.gz into public/smalltownbigstage/
 * Run from repo root or frontend; output goes to process.cwd()/public/smalltownbigstage/
 * Requires: npm package "tar" (devDependency in root or frontend).
 */
import path from "path";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function findAssetsRoot() {
  const cwd = process.cwd();
  const inCwd = path.join(cwd, "assets", "source");
  if (fs.existsSync(inCwd)) return cwd;
  const inParent = path.join(cwd, "..", "assets", "source");
  if (fs.existsSync(inParent)) return path.join(cwd, "..");
  throw new Error("Could not find assets/source (run from repo root or frontend)");
}

function countFiles(dir, base = dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) n += countFiles(full, base);
    else n += 1;
  }
  return n;
}

async function main() {
  const root = path.resolve(findAssetsRoot());
  const tarball = path.join(root, "assets", "source", "smalltownbigstage.tar.gz");
  const outBase = process.cwd();
  const outDir = path.join(outBase, "public", "smalltownbigstage");

  if (!fs.existsSync(tarball)) {
    console.error("Missing tarball:", tarball);
    process.exit(1);
  }

  try {
    const tar = require("tar");
    fs.mkdirSync(path.join(outBase, "public"), { recursive: true });
    if (fs.existsSync(outDir)) {
      fs.rmSync(outDir, { recursive: true });
    }
    fs.mkdirSync(outDir, { recursive: true });

    await tar.extract({ file: tarball, cwd: outDir, strip: 0 });
    const fileCount = countFiles(outDir);
    console.log("Extracted smalltownbigstage:", outDir, "| files:", fileCount);
    if (fileCount === 0) {
      console.error("Extraction produced no files");
      process.exit(1);
    }
  } catch (err) {
    console.error("Extraction failed:", err.message);
    process.exit(1);
  }
}

main();
