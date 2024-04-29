import type { Locator, Page } from '@playwright/test';
import { CONSTANTS } from 'src/constants';
import { JoinPage } from './JoinPage';

export class SetupPage {
  readonly page: Page;

  // World Management
  readonly $navOptionGameWorlds: Locator;
  readonly testWorldTitle: string = 'test';
  readonly $createWorldBtn: Locator;
  readonly $createWorldTitleInput: Locator;
  readonly $createWorldGameSystemDropdown: Locator;
  readonly $createWorldSubmitBtn: Locator;
  readonly $worldListItem: Locator;
  readonly $deleteWorldContextMenuOption: Locator;
  readonly $deleteWorldConfirmCodeText: Locator;
  readonly $deleteWorldConfirmCodeInput: Locator;
  readonly $deleteWorldConfirmBtn: Locator;
  readonly $playButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.$createWorldBtn = page.locator(
      '.window-content form [data-action=worldCreate]'
    );
    this.$createWorldTitleInput = page.getByPlaceholder('World Title');
    this.$createWorldGameSystemDropdown = page.locator(
      '.window-content form [name=system]'
    );
    this.$createWorldSubmitBtn = page.locator(
      '.window-content form [type=submit]'
    );
    this.$navOptionGameWorlds = page
      .locator('.tab-title')
      .getByText('Game Worlds');

    const confirmDialogLocator = this.page.locator('[role=dialog]');
    this.$deleteWorldConfirmCodeText = confirmDialogLocator.locator(
      '#confirm-code .reference'
    );
    this.$deleteWorldConfirmCodeInput =
      confirmDialogLocator.locator('#delete-confirm');
    this.$deleteWorldConfirmBtn =
      confirmDialogLocator.locator('[data-button=yes]');

    this.$worldListItem = this.page.locator(
      `#worlds-list [data-package-id=${this.testWorldTitle}]`
    );

    this.$deleteWorldContextMenuOption = this.page
      .locator('.context-items')
      .getByText('Delete World');

    this.$playButton = this.$worldListItem.locator('.control.play');
  }

  async isReady() {
    this.$navOptionGameWorlds.waitFor({ state: 'visible' });
    this.$createWorldBtn.waitFor({ state: 'visible' });
  }

  async ensureTestWorldDeleted() {
    if ((await this.$worldListItem.isVisible()) === false) {
      return;
    }

    // Delete the test world via confirmation code
    await this.$worldListItem.click({ button: 'right' });
    await this.$deleteWorldContextMenuOption.click();
    const confirmCode =
      (await this.$deleteWorldConfirmCodeText.textContent()) ?? '';
    await this.$deleteWorldConfirmCodeInput.fill(confirmCode);
    await this.$deleteWorldConfirmBtn.click();
  }

  async ensureTestWorldCreated() {
    await this.$createWorldBtn.click();
    await this.$createWorldTitleInput.fill(this.testWorldTitle);
    await this.$createWorldGameSystemDropdown.selectOption(
      CONSTANTS.DND5E_SYSTEM_ID
    );
    await this.$createWorldSubmitBtn.click();
  }

  async dnd5eIsInstalled() {
    return await this.page.evaluate(
      () => !!game?.systems?.get(CONSTANTS.DND5E_SYSTEM_ID)
    );
  }

  async tidy5eSheetIsInstalled() {
    return await this.page.evaluate(
      () => !!game?.modules?.get(CONSTANTS.MODULE_ID)
    );
  }

  async goToTestWorldJoinPage() {
    await this.$worldListItem.hover();
    await this.$playButton.click();
    const joinPage = new JoinPage(this.page);
    await joinPage.isReady();
    return joinPage;
  }
}
