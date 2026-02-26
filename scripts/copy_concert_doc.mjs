#!/usr/bin/env node
/**
 * Copies assets/docs/Concert info.docx to public/downloads/Concert info.docx
 * Run from repo root or frontend; output goes to process.cwd()/public/downloads/
 */
import path from "path";
import fs from "fs";

function findAssetsRoot() {
  const cwd = process.cwd();
  const inCwd = path.join(cwd, "assets", "docs");
  if (fs.existsSync(inCwd)) return cwd;
  const inParent = path.join(cwd, "..", "assets", "docs");
  if (fs.existsSync(inParent)) return path.join(cwd, "..");
  throw new Error("Could not find assets/docs (run from repo root or frontend)");
}

function main() {
  const root = path.resolve(findAssetsRoot());
  const src = path.join(root, "assets", "docs", "Concert info.docx");
  const outBase = process.cwd();
  const outDir = path.join(outBase, "public", "downloads");
  const dest = path.join(outDir, "Concert info.docx");

  if (!fs.existsSync(src)) {
    console.error("Missing source:", src);
    process.exit(1);
  }

  try {
    fs.mkdirSync(outDir, { recursive: true });
    fs.copyFileSync(src, dest);
    console.log("Copied Concert info.docx to", dest);
  } catch (err) {
    console.error("Copy failed:", err.message);
    process.exit(1);
  }
}

main();
