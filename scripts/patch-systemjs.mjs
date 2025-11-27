import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const require = createRequire(import.meta.url);
const runtimeSourcePath = require.resolve('regenerator-runtime/runtime.js');
const injectedBanner = '/* __regenerator_runtime_injected__ */';

async function patchTarget(targetDir) {
  const destination = path.join(targetDir, 'system.js');

  try {
    await fs.access(destination);
  } catch (error) {
    console.warn(`[systemjs-patch] Skipping ${destination} (file not present yet).`);
    return false;
  }

  const current = await fs.readFile(destination, 'utf8');
  if (current.includes(injectedBanner)) {
    console.log(`[systemjs-patch] ${destination} already contains the runtime patch.`);
    return true;
  }

  const runtimeSource = await fs.readFile(runtimeSourcePath, 'utf8');
  const patched = `${injectedBanner}\n(function(){\n${runtimeSource}\n})();\n\n${current}`;
  await fs.writeFile(destination, patched, 'utf8');
  console.log(`[systemjs-patch] Patched ${destination}`);
  return true;
}

async function main() {
  const targets = [
    path.join(projectRoot, 'temp', 'programming', 'preview', 'systemjs'),
    path.join(projectRoot, 'temp', 'programming', 'packer-driver', 'targets', 'preview', 'systemjs')
  ];

  const results = await Promise.all(targets.map(patchTarget));
  if (!results.some(Boolean)) {
    console.warn('[systemjs-patch] No preview targets were patched. Launch the Cocos preview at least once so the temp files exist, then rerun this command.');
  }
}

main().catch((error) => {
  console.error('[systemjs-patch] Failed to patch SystemJS:', error);
  process.exitCode = 1;
});
