#!/usr/bin/env node
/**
 * Build-time check: asserts extracted tarball and docx exist.
 * Run from frontend (cwd = frontend) or repo root.
 * Exits 1 if any path is missing.
 */
import path from "path";
import fs from "fs";

const cwd = process.cwd();
const publicDir = path.join(cwd, "public");
const smalltownDir = path.join(publicDir, "smalltownbigstage");
const docxPath = path.join(publicDir, "downloads", "Concert info.docx");

const checks = [
  { path: smalltownDir, label: "public/smalltownbigstage/", isDir: true },
  { path: docxPath, label: "public/downloads/Concert info.docx", isDir: false },
];

let failed = false;
for (const { path: p, label, isDir } of checks) {
  const exists = fs.existsSync(p);
  const ok = isDir ? exists && fs.statSync(p).isDirectory() : exists && fs.statSync(p).isFile();
  if (!ok) {
    console.error("Verify failed: missing", label);
    failed = true;
  }
}

if (failed) process.exit(1);

const entrypoint = path.join(smalltownDir, "index.html");
if (!fs.existsSync(entrypoint)) {
  const files = fs.readdirSync(smalltownDir, { withFileTypes: true });
  if (files.length === 0) {
    console.error("Verify failed: public/smalltownbigstage/ is empty");
    process.exit(1);
  }
}
console.log("Artifacts verified: public/smalltownbigstage/, public/downloads/Concert info.docx");
