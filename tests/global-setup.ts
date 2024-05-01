import { chromium, type FullConfig } from '@playwright/test';
import { establishTestLocalStorage } from './projects/setup/localStorageSetup';
import { ServerAuthenticationPage } from './poms/ServerAuthenticationPage';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(baseURL!);
  await page.waitForLoadState();
  const authPage = new ServerAuthenticationPage(page);
  await authPage.isReady();
  await authPage.login(process.env.ADMIN_PASSWORD!);
  await establishTestLocalStorage(page);
  // TODO: pull all the world preparation into this global setup, and then set storage state.
  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;
