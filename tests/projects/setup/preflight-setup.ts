import test, { type Page } from '@playwright/test';
import { ServerAuthenticationPage } from '../../poms/ServerAuthenticationPage';
import { SetupPage } from '../../poms/SetupPage';
import { applySetups } from './setups';
import { PageHelper } from 'tests/utils/PageHelper';

const { ADMIN_PASSWORD = 'an server auth password is required' } = process.env;

test.describe('pre-flight checkup', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('pre-flight: can authenticate', async () => {
    const authPage = new ServerAuthenticationPage(page);
    await authPage.goto();
    const setupPage = await authPage.login(ADMIN_PASSWORD);
    await setupPage.isReady();
    test.expect(await PageHelper.isLoggedIn(page)).toBeTruthy();
  });

  test('pre-flight: dnd5e must already be installed', async () => {
    const setupPage = new SetupPage(page);
    const dnd5eIsInstalled = await setupPage.dnd5eIsInstalled();
    test.expect(dnd5eIsInstalled).toBeTruthy();
  });

  test('pre-flight: tidy5e-sheet must already be installed', async () => {
    const setupPage = new SetupPage(page);
    const dnd5eIsInstalled = await setupPage.tidy5eSheetIsInstalled();
    test.expect(dnd5eIsInstalled).toBeTruthy();
  });

  test('pre-flight: a fresh test world is ready to use', async () => {
    const setupPage = new SetupPage(page);
    await setupPage.ensureTestWorldDeleted();
    await setupPage.ensureTestWorldCreated();
    const joinPage = await setupPage.goToTestWorldJoinPage();
    const gamePage = await joinPage.joinAsGm();
    // Apply all setups here
    await applySetups(gamePage);
  });
});
