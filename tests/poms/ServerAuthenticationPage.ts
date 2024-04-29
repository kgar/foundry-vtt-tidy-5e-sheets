import type { Locator, Page } from '@playwright/test';
import { establishTestLocalStorage } from '../projects/setup/localStorageSetup';
import { SetupPage } from './SetupPage';

export class ServerAuthenticationPage {
  readonly page: Page;
  readonly $adminPwdInput: Locator;
  readonly $loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$adminPwdInput = this.page.getByPlaceholder('Administrator Password');
    this.$loginButton = this.page.locator('[type=submit][value=adminAuth]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async isReady() {
    await this.$adminPwdInput.waitFor({ state: 'visible' });
    await this.$loginButton.waitFor({ state: 'visible' });
  }

  async login(pwd: string): Promise<SetupPage> {
    await establishTestLocalStorage(this.page);

    this.$adminPwdInput.fill(pwd);
    this.$loginButton.click();

    const setupPage = new SetupPage(this.page);
    await setupPage.isReady();
    return setupPage;
  }
}
