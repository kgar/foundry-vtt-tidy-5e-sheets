import { PRELOADED_IMAGE_PATHS } from './preloaded-images.generated';

// Run through the manifest and preload all images
export function preloadSheetImages() {
  const run = () => {
    for (const imagePath of PRELOADED_IMAGE_PATHS) {
      const image = new Image();
      image.src = foundry.utils.getRoute(imagePath);
    }
  };

  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(run);
  } else {
    window.setTimeout(run, 0);
  }
}
