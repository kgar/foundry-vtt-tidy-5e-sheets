import type { Locator, Page } from '@playwright/test';
import { GamePage } from './GamePage';

export class JoinPage {
  page: Page;
  $userNameDropdown: Locator;
  $userPwd: Locator;
  $joinGameBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$userNameDropdown = this.page.locator('[name=userid]');
    this.$userPwd = this.page.locator('[name=password]');
    this.$joinGameBtn = this.page.locator('[name=join]');
  }

  async isReady() {
    await this.$userNameDropdown.waitFor({ state: 'visible' });
    await this.$userPwd.waitFor({ state: 'visible' });
    await this.$joinGameBtn.waitFor({ state: 'visible' });
  }

  async joinAsGm() {
    await this.$userNameDropdown.selectOption({ label: 'Gamemaster' });
    await this.$userNameDropdown.click({ delay: 100 });
    await this.$userNameDropdown.click({ delay: 100 });
    await this.$joinGameBtn.click({ delay: 150 });

    const gamePage = new GamePage(this.page);
    await gamePage.isReady();
    return gamePage;
  }
}
