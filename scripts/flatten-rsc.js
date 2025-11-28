const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');

async function flattenDir(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // If directory name starts with __next., check its children
      if (entry.name.startsWith('__next.')) {
        const baseName = entry.name; // e.g. __next.products
        const childEntries = await fs.promises.readdir(full, { withFileTypes: true });
        for (const child of childEntries) {
          const childFull = path.join(full, child.name);
          if (child.isDirectory()) {
            // copy files inside this child directory into a dot-flattened sibling in parent
            const subEntries = await fs.promises.readdir(childFull, { withFileTypes: true });
            for (const sub of subEntries) {
              if (sub.isFile()) {
                const src = path.join(childFull, sub.name);
                const ext = path.extname(sub.name);
                const subBase = path.basename(sub.name, ext);
                // e.g. __next.products.$d$id.__PAGE__.txt
                const destName = `${baseName}.${child.name}.${subBase}`;
                const dest = path.join(dir, destName + ext);
                await fs.promises.copyFile(src, dest);
                console.log(`[flatten] copied ${src} -> ${dest}`);
              }
            }
          } else if (child.isFile()) {
            // copy file inside __next.* directly as sibling, preserve base name
            const src = childFull;
            const ext = path.extname(child.name);
            const subBase = path.basename(child.name, ext);
            const dest = path.join(dir, `${baseName}.${subBase}${ext}`);
            // Only copy if dest doesn't exist
            if (!fs.existsSync(dest)) {
              await fs.promises.copyFile(src, dest);
              console.log(`[flatten] copied ${src} -> ${dest}`);
            }
          }
        }
      }
      // Recurse into subdirectories
      await flattenDir(full);
    }
  }
}

flattenDir(OUT_DIR).catch((err) => {
  console.error(err);
  process.exit(1);
});
