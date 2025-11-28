const fs = require('fs');
const path = require('path');

// Determine repo/basePath from next.config.ts or fall back to folder name
function readBasePath() {
  const cfgFiles = ['next.config.ts', 'next.config.js'];
  for (const f of cfgFiles) {
    const p = path.join(process.cwd(), f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      const m = content.match(/basePath\s*:\s*['\"](\/[^'\"]+)['\"]/);
      if (m) return m[1].replace(/^\//, '');
    }
  }
  return path.basename(process.cwd());
}

function copyDir(src, dst) {
  if (!fs.existsSync(src)) return;
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const dstPath = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dstPath, { recursive: true });
      copyDir(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

(function main() {
  const out = path.join(process.cwd(), 'out');
  const basePath = readBasePath();
  const repoDir = path.join(out, basePath);

  // copy _next
  const srcNext = path.join(out, '_next');
  const dstNext = path.join(repoDir, '_next');
  if (fs.existsSync(srcNext)) {
    fs.mkdirSync(dstNext, { recursive: true });
    copyDir(srcNext, dstNext);
    console.log('[copy-assets] copied _next ->', dstNext);
  } else {
    console.warn('[copy-assets] no _next folder found at', srcNext);
  }

  // copy public assets: images, favicon, robots, etc.
  const publicAssets = ['images', 'favicon.ico', 'robots.txt'];
  for (const asset of publicAssets) {
    const src = path.join(out, asset);
    const dst = path.join(repoDir, asset);
    if (!fs.existsSync(src)) continue;

    try {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        fs.mkdirSync(dst, { recursive: true });
        copyDir(src, dst);
        console.log('[copy-assets] copied', asset, '->', dst);
      } else if (stat.isFile()) {
        fs.mkdirSync(path.dirname(dst), { recursive: true });
        fs.copyFileSync(src, dst);
        console.log('[copy-assets] copied', asset, '->', dst);
      }
    } catch (err) {
      console.warn('[copy-assets] failed to copy', asset, err.message);
    }
  }

  // copy 404.html if present in out root -> ensure it exists under repoDir as well
  try {
    const src404 = path.join(out, '404.html');
    const dst404 = path.join(repoDir, '404.html');
    if (fs.existsSync(src404)) {
      fs.mkdirSync(path.dirname(dst404), { recursive: true });
      fs.copyFileSync(src404, dst404);
      console.log('[copy-assets] copied 404.html ->', dst404);
    }
  } catch (err) {
    console.warn('[copy-assets] failed to copy 404.html', err.message);
  }

  // ensure .nojekyll exists in out root
  try {
    const nojekyll = path.join(out, '.nojekyll');
    if (!fs.existsSync(nojekyll)) fs.writeFileSync(nojekyll, '');
  } catch (err) {
    // ignore
  }
})();
