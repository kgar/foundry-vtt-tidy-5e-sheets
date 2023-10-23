import * as fs from 'fs';

/**
 * When doing dev for Tidy 5e Sheets, the style CSS file is ignored, and the main JS file is proxied in by the vite proxy server.
 *
 * That leaves the static files such as templates, images, lang files, and the module JSON file.
 *
 * For a plug-and-play dev experience, this script prepares the dist folder with the minimum static files needed and relies on the dev server to take over the rest.
 *
 * Additionally, when a developer is updating templates, localization data, or any other static file, this small amount of time spent copying to the dist folder makes the feedback loop much shorter in the long run.
 */
function prepareDistForDev() {
  const distFolder = './dist';

  // Remove the dist folder and all its files, if present
  if (fs.existsSync(distFolder)) {
    fs.rmdirSync(distFolder, { recursive: true, force: true });
  }

  // Ensure the dist folder exists
  fs.mkdirSync(distFolder);

  const publicFolder = './public';

  // Copy all of the public folder contents to dist
  fs.cpSync(publicFolder, distFolder, { recursive: true });
}

prepareDistForDev();
