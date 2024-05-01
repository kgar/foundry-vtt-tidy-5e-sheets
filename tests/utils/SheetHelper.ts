import type { Locator, Page } from '@playwright/test';
import { CONSTANTS } from 'src/constants';
import type { DocumentRef } from 'tests/tests.types';

export class SheetHelper {
  page: Page;
  ref: DocumentRef;
  $sheet: Locator;

  constructor(page: Page, ref: DocumentRef) {
    this.page = page;
    this.ref = ref;
    this.$sheet = page.locator(
      `[data-sheet-module="${CONSTANTS.MODULE_ID}"][id*=${ref.id}]`
    );
  }

  async showSheet() {
    await this.page.evaluate(
      async ({ ref }) => {
        const actor = await fromUuid(ref.uuid);
        await actor.sheet.render(true);
      },
      { ref: this.ref }
    );
  }

  async tab(tabId: string) {
    const $tab = this.$sheet.locator(`nav [data-tab-id=${tabId}]`);
    await $tab.click();
  }
}
