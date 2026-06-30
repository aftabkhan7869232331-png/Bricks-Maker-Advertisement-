// scripts/check-wan21.js
// Script to check status of Wan2.1 Text-to-Video Engine dependencies, folder paths, and configuration.

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const status = {
  python: false,
  git: false,
  engineFolder: false,
  modelFolder: false,
  modelFiles: false,
  huggingFaceCli: false,
  overallReady: false,
  details: {
    pythonVersion: "Not detected",
    gitVersion: "Not detected",
    enginePath: "./engines/Wan2.1",
    modelPath: process.env.WAN21_MODEL_PATH || "./models/Wan2.1-T2V-1.3B",
    huggingFaceCliVersion: "Not detected",
  }
};

status.details.enginePath = process.env.WAN21_ENGINE_PATH || "./engines/Wan2.1";

// 1. Check Python
try {
  let pyOut;
  try {
    pyOut = execFileSync("python", ["--version"], { encoding: "utf8" }).trim();
  } catch {
    pyOut = execFileSync("python3", ["--version"], { encoding: "utf8" }).trim();
  }
  status.python = true;
  status.details.pythonVersion = pyOut;
} catch (e) {
  // ignore
}

// 2. Check Git
try {
  const gitOut = execFileSync("git", ["--version"], { encoding: "utf8" }).trim();
  status.git = true;
  status.details.gitVersion = gitOut;
} catch (e) {
  // ignore
}

// 3. Check Engine Folder
const absoluteEnginePath = path.resolve(status.details.enginePath);
if (fs.existsSync(absoluteEnginePath)) {
  status.engineFolder = true;
}

// 4. Check Model Folder
const absoluteModelPath = path.resolve(status.details.modelPath);
if (fs.existsSync(absoluteModelPath)) {
  status.modelFolder = true;
  const modelFiles = fs.readdirSync(absoluteModelPath, { recursive: true });
  status.modelFiles = modelFiles.some((file) =>
    /\.(safetensors|bin|pt|pth|json)$/i.test(String(file))
  );
}

// 5. Check Hugging Face CLI (new CLI first, legacy CLI second)
for (const [command, args] of [["hf", ["--version"]], ["huggingface-cli", ["--version"]]]) {
  try {
    status.details.huggingFaceCliVersion =
      execFileSync(command, args, { encoding: "utf8" }).trim();
    status.huggingFaceCli = true;
    break;
  } catch {
    // Try the next supported CLI command.
  }
}

// Determine overall readiness
status.overallReady =
  status.python &&
  status.git &&
  status.huggingFaceCli &&
  status.engineFolder &&
  status.modelFolder &&
  status.modelFiles;

process.stdout.write(JSON.stringify(status, null, 2));
