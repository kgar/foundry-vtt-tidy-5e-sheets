import { PRELOADED_IMAGE_PATHS } from './preloaded-images.generated';

// Foundry uses `Cache-Control: no-cache` for static images. Hopefully
// this keeps them in memory, but this might use too much memory with
// the header banners. TBD.
const preloadedImages: HTMLImageElement[] = [];

// Run through the manifest and preload all images
export function preloadSheetImages() {
  const run = () => {
    for (const imagePath of PRELOADED_IMAGE_PATHS) {
      const image = new Image();
      image.src = foundry.utils.getRoute(imagePath);
      image.decode().catch(() => {});
      preloadedImages.push(image);
    }
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    window.setTimeout(run, 0);
  }
}
