import { chromium, type FullConfig } from '@playwright/test';
import { establishTestLocalStorage } from './projects/setup/localStorageSetup';
import { ServerAuthenticationPage } from './poms/ServerAuthenticationPage';
import { PageHelper } from './utils/PageHelper';

const { ADMIN_PASSWORD = 'a server auth password is required' } = process.env;

async function globalSetup(config: FullConfig) {
  const errors = [];

  console.log('Global Setup: beginning');
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage({ baseURL });

  const authPage = new ServerAuthenticationPage(page);
  await authPage.goto();
  await authPage.isReady();

  console.log(
    'Global Setup: Establishing initial test localStorage client settings'
  );
  await establishTestLocalStorage(page);

  const setupPage = await authPage.login(ADMIN_PASSWORD);
  await setupPage.isReady();

  if ((await PageHelper.isLoggedIn(page)) === false) {
    errors.push(
      'Pre-flight error: Unable to log into the test server. Check test server password and env variable.'
    );
  }

  if ((await setupPage.dnd5eIsInstalled()) === false) {
    errors.push(
      'Pre-flight error: dnd5e system not detected. It must be installed manually.'
    );
  }

  if ((await setupPage.tidy5eSheetIsInstalled()) === false) {
    errors.push(
      'Pre-flight error: tidy5e-sheet module not detected. It must be installed manually.'
    );
  }

  console.log('Global Setup: Ensuring a fresh test world exists');
  await setupPage.ensureTestWorldDeleted();
  await setupPage.ensureTestWorldCreated();

  const joinPage = await setupPage.goToTestWorldJoinPage();
  const gamePage = await joinPage.joinAsGm();

  console.log(
    'Global Setup: Applying baseline test world settings and configuration'
  );
  await gamePage.applyTestWorldConfiguration();
  await gamePage.page.reload();
  await gamePage.page.waitForLoadState();
  await gamePage.isReady();

  await page.context().storageState({ path: storageState as string });
  await browser.close();

  if (errors.length) {
    for (let error of errors) {
      console.error(error);
    }
    throw new Error('Global setup failed. See error logs in the console.');
  }
}

export default globalSetup;
