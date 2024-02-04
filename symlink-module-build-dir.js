import yargs from 'yargs/yargs';
import {hideBin} from 'yargs/helpers';
import fs from 'fs-extra';
import {resolve} from 'path';

const {ensureDir, existsSync, readJSONSync, remove, symlink} = fs;
const argv = yargs(hideBin(process.argv)).argv;

const moduleDirectory = 'tidy5e-sheet';
const buildDirectory = './dist';

/**
 * Get the data path for Foundry VTT based on what is configured in `foundry-data-path-config.json`
 */
function getFoundryDataPath() {
  const config = readJSONSync('foundry-data-path-config.json');

  if (config?.dataPath) {
    if (!existsSync(resolve(config.dataPath))) {
      throw new Error('Supplied Foundry data path is invalid, directory not found');
    }

    return resolve(config.dataPath);
  } else {
    throw new Error('No Foundry data path defined in foundry-data-path-config.json');
  }
}

/**
 * Symlink build folder within Foundry VTT data folder
 */
async function createSymlink() {
  let destinationDirectory;

  if (existsSync(resolve(buildDirectory, 'module.json'))) {
    destinationDirectory = 'modules';
  } else {
    throw new Error(`Could not find module.json in ${buildDirectory}`);
  }

  const symlinkDirectory = resolve(
    getFoundryDataPath(),
    'Data',
    destinationDirectory,
    moduleDirectory
  );

  if (argv.clean || argv.c) {
    console.log(`[== Removing link: ${symlinkDirectory} ==]\n`);
    await remove(symlinkDirectory);
  } else if (!existsSync(symlinkDirectory)) {
    console.log(`[== Linking ${buildDirectory} to ${symlinkDirectory} ==]\n`);
    await ensureDir(resolve(symlinkDirectory, '..'));
    await symlink(resolve(buildDirectory), symlinkDirectory);
  }
}

createSymlink();
