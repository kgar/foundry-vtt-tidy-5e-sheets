import type { Frame, Locator, Page } from '@playwright/test';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { DocumentTabSectionConfigApplicationPom } from 'tests/poms/applications/DocumentTabSectionConfigApplicationPom';
import type { DocumentRef } from 'tests/tests.types';

export type SheetHelperItemCreationArgs = {
  name: string;
  type: string;
} & Record<string, any>;

export class SheetHelper {
  static sheetPart(locatable: Locator | Frame | Page, part: string) {
    return locatable.locator(`[data-tidy-sheet-part="${part}"]`);
  }

  page: Page;
  ref: DocumentRef;
  $sheet: Locator;

  constructor(page: Page, ref: DocumentRef) {
    this.page = page;
    this.ref = ref;
    this.$sheet = page.locator(
      `[data-sheet-module="${CONSTANTS.MODULE_ID}"][id$="${ref.id}"]`
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
    const $tab = this.$sheet.locator(`nav [data-tab-id="${tabId}"]`);

    const tabContentsAreHidden = await this.getTabContentsLocator(
      tabId
    ).isHidden();

    if (tabContentsAreHidden) {
      await $tab.click();
    }

    return $tab;
  }

  getTabContentsLocator(tabId: string) {
    return this.$sheet.locator(`[data-tab-contents-for="${tabId}"]`);
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

  async deleteEmbeddedItem(itemRef: DocumentRef) {
    await this.page.evaluate(
      async ({ itemRef }) => {
        const item = await fromUuid(itemRef.uuid);
        await item.delete();
      },
      {
        itemRef,
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

  getToolbarCommandLocator($tabContents: Locator, title: string) {
    return SheetHelper.sheetPart(
      $tabContents,
      CONSTANTS.SHEET_PARTS.UTILITY_TOOLBAR_COMMAND
    ).and($tabContents.getByTitle(title));
  }

  async openSectionConfiguration(
    tabId: string
  ): Promise<DocumentTabSectionConfigApplicationPom> {
    await this.tab(tabId);
    const $contents = this.getTabContentsLocator(tabId);
    await this.getToolbarCommandLocator(
      $contents,
      'Configure Sections'
    ).click();
    const config = new DocumentTabSectionConfigApplicationPom(this.page);
    await config.isReady();
    return config;
  }

  getSectionLocator(tabId: string, sectionKey: string) {
    return this.getTabContentsLocator(tabId).locator(
      `[data-tidy-section-key="${sectionKey}"]`
    );
  }

  async getSectionsInCurrentOrder(tabId: string): Promise<string[]> {
    await this.tab(tabId);
    const $tabContents = this.getTabContentsLocator(tabId);
    const sectionKeyLocators = await $tabContents
      .locator(`[data-tidy-section-key]`)
      .all();

    const sections: string[] = [];
    for (const $key of sectionKeyLocators) {
      sections.push((await $key.getAttribute('data-tidy-section-key')) ?? '');
    }

    return sections;
  }

  async lockSheet() {
    await this.setFlag(TidyFlags.allowEdit.key, false);
  }

  async setFlag(flag: string, value: unknown) {
    await this.page.evaluate(
      async ({ uuid, constants, flag, value }) => {
        const doc = await fromUuid(uuid);
        await doc.setFlag(constants.MODULE_ID, flag, value);
      },
      { uuid: this.ref.uuid, constants: CONSTANTS, flag, value }
    );
  }
}
