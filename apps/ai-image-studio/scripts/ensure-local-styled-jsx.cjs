const fs = require("node:fs");
const path = require("node:path");

const appRoot = path.resolve(__dirname, "..");
const hoistedStyledJsxPath = path.resolve(appRoot, "..", "..", "node_modules", "styled-jsx");
const localNodeModulesPath = path.resolve(appRoot, "node_modules");
const localStyledJsxPath = path.resolve(localNodeModulesPath, "styled-jsx");

const log = (message) => {
  process.stdout.write(`[ai-image-studio:postinstall] ${message}\n`);
};

if (!fs.existsSync(hoistedStyledJsxPath)) {
  log("hoisted styled-jsx not found; skipping local copy.");
  process.exit(0);
}

fs.mkdirSync(localNodeModulesPath, { recursive: true });
fs.rmSync(localStyledJsxPath, { recursive: true, force: true });
fs.cpSync(hoistedStyledJsxPath, localStyledJsxPath, { recursive: true });
log("copied styled-jsx to local node_modules for React 18 consistency.");
