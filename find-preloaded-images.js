import * as fs from 'fs';
import path from 'path';

// Generate a manifest of all images referenced so that we can preload them
const SRC_FOLDER = './src';
const OUTPUT_FILE = './src/utils/preloaded-images.generated.ts';
const SCAN_EXTENSIONS = new Set(['.css', '.less', '.svelte', '.ts', '.hbs']);
const IMAGE_REFERENCE =
  /modules\/tidy5e-sheet\/images\/[\w\-./]+\.(?:webp|png|jpe?g|svg|gif|avif)/gi;

function collectFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectFiles(fullPath, files);
    } else if (SCAN_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

function generateImageManifest() {
  const resolvedOutput = path.resolve(OUTPUT_FILE);
  const images = new Set();

  for (const file of collectFiles(SRC_FOLDER)) {
    if (path.resolve(file) === resolvedOutput) {
      continue;
    }
    const contents = fs.readFileSync(file, 'utf-8');
    const matches = contents.match(IMAGE_REFERENCE);
    if (matches) {
      for (const match of matches) {
        images.add(match);
      }
    }
  }

  const sorted = [...images].sort();

  const fileContents = `// AUTO-GENERATED cached image list created by find-preloaded-images.js during build/dev, don't edit by hand.

export const PRELOADED_IMAGE_PATHS: readonly string[] = [
${sorted.map((p) => `  '${p}',`).join('\n')}
];
`;

  fs.writeFileSync(resolvedOutput, fileContents);
  console.log(
    `[== Generated image manifest: ${sorted.length} images -> ${OUTPUT_FILE} ==]`
  );
}

generateImageManifest();
