import type { Locator, Page } from '@playwright/test';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DocumentRef } from 'tests/tests.types';

export type SheetHelperItemCreationArgs = {
  name: string;
  type: string;
} & Record<string, any>;

export class SheetHelper {
  page: Page;
  ref: DocumentRef;
  $sheet: Locator;

  constructor(page: Page, ref: DocumentRef) {
    this.page = page;
    this.ref = ref;
    this.$sheet = page.locator(
      `[data-sheet-module="${CONSTANTS.MODULE_ID}"][id*="${ref.id}"]`
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
    if (
      await this.$sheet
        .locator(`[data-tab-contents-for="${tabId}"]`)
        .isVisible()
    ) {
      return;
    }

    const $tab = this.$sheet.locator(`nav [data-tab-id="${tabId}"]`);
    await $tab.click();
  }

  async createEmbeddedItem(
    documentData: SheetHelperItemCreationArgs
  ): Promise<DocumentRef> {
    return await this.page.evaluate(
      async ({
        documentData,
        parentUuid,
        actionOverrideFlagProp,
      }): Promise<DocumentRef> => {
        const parent = await fromUuid(parentUuid);
        const item = await dnd5e.documents.Item5e.create(
          {
            ...documentData,
            [actionOverrideFlagProp]: true,
          },
          { parent }
        );

        return {
          id: item.id,
          uuid: item.uuid,
          name: item.name,
        };
      },
      {
        documentData,
        parentUuid: this.ref.uuid,
        actionOverrideFlagProp: TidyFlags.actionFilterOverride.prop,
      }
    );
  }

  async setToGridView() {
    await this.updateDocument({
      [TidyFlags.inventoryGrid.prop]: true,
      [TidyFlags.spellbookGrid.prop]: true,
    });
  }

  async setToListView() {
    await this.updateDocument({
      [TidyFlags.inventoryGrid.prop]: false,
      [TidyFlags.spellbookGrid.prop]: false,
    });
  }

  async updateDocument(data: object) {
    await this.page.evaluate(
      async ({ uuid, data }) => {
        const actor = await fromUuid(uuid);
        actor.update(data);
      },
      { uuid: this.ref.uuid, data }
    );
  }
}
