import type { Locator, Page } from '@playwright/test';
import { establishTestLocalStorage } from '../projects/setup/localStorageSetup';
import { SetupPage } from './SetupPage';

export class ServerAuthenticationPage {
  readonly page: Page;
  readonly $adminPwdInput: Locator;
  readonly $loginButton: Locator;
  readonly $kickOutPlayersDialogYesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$adminPwdInput = this.page
      .getByPlaceholder('Administrator Password')
      // Or the /join page's server auth form
      .or(this.page.locator('[name="adminPassword"]'));
    this.$loginButton = this.page
      .locator('[type=submit][value=adminAuth]')
      // Or the /join page's server auth form
      .or(this.page.locator('[name="shutdown"]'));
    this.$kickOutPlayersDialogYesBtn = this.page.locator(
      '[role=dialog] [data-button="yes"]'
    );
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async isReady() {
    await this.$loginButton.waitFor({ state: 'visible' });
  }

  async login(pwd: string): Promise<SetupPage> {
    await establishTestLocalStorage(this.page);

    if (await this.$adminPwdInput.isVisible()) {
      await this.$adminPwdInput.fill(pwd);
    }

    await this.$loginButton.click();

    if (await this.$kickOutPlayersDialogYesBtn.isVisible({ timeout: 250 })) {
      await this.$kickOutPlayersDialogYesBtn.click();
    }

    await this.page.waitForLoadState();

    const setupPage = new SetupPage(this.page);
    await setupPage.isReady();
    return setupPage;
  }
}
