import {
  SheetHelper,
  type SheetHelperItemCreationArgs,
} from 'tests/helpers/SheetHelper';
import { sectionsTest } from './sections-test-fixture';
import type { Page } from '@playwright/test';
import { PageHelper } from 'tests/utils/PageHelper';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DocumentRef } from 'tests/tests.types';
import { delay } from 'src/utils/asynchrony';

let page: Page;

sectionsTest.beforeAll(async ({ browser }) => {
  await page?.close();
  page = await browser.newPage();
  await PageHelper.routeToTestGame(page);
});

sectionsTest.afterAll(async () => {
  await page?.close();
});

sectionsTest.beforeEach(async () => {
  await PageHelper.routeToTestGame(page);
});

sectionsTest.describe(
  'drag and drop owned items in custom sections to manually sort',
  () => {
    sectionsTest('character inventory', async ({ data }) => {
      const sheetHelper = new SheetHelper(page, data.sectionTestCharacter);
      await runDragDropOrderTest({
        firstItemRef: await sheetHelper.createEmbeddedItem({
          name: 'PC Inv Drag Drop First Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'PC Drag Drop Sort Test',
            },
          },
        }),
        secondItemRef: await sheetHelper.createEmbeddedItem({
          name: 'PC Inv Drag Drop Second Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'PC Drag Drop Sort Test',
            },
          },
        }),
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
      });
    });

    sectionsTest('NPC abilities', async ({ data }) => {
      const sheetHelper = new SheetHelper(page, data.sectionTestNpc);
      await runDragDropOrderTest({
        firstItemRef: await sheetHelper.createEmbeddedItem({
          name: 'NPC Abilities Drag Drop First Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'NPC Drag Drop Sort Test',
            },
          },
        }),
        secondItemRef: await sheetHelper.createEmbeddedItem({
          name: 'NPC Abilities Drag Drop Second Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'NPC Drag Drop Sort Test',
            },
          },
        }),
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
      });
    });

    sectionsTest('container contents', async ({ data }) => {
      const characterSheetHelper = new SheetHelper(
        page,
        data.sectionTestCharacter
      );
      const containerSheetHelper = new SheetHelper(
        page,
        data.sectionTestOwnedContainer
      );
      await runDragDropOrderTest({
        firstItemRef: await characterSheetHelper.createEmbeddedItem({
          name: 'Container Contents Drag Drop First Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          system: {
            container: data.sectionTestOwnedContainer.id,
          },
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'Container Drag Drop Sort Test',
            },
          },
        }),
        secondItemRef: await characterSheetHelper.createEmbeddedItem({
          name: 'Container Contents Drag Drop Second Test Item',
          type: CONSTANTS.ITEM_TYPE_LOOT,
          system: {
            container: data.sectionTestOwnedContainer.id,
          },
          flags: {
            [CONSTANTS.MODULE_ID]: {
              [TidyFlags.section.key]: 'Container Drag Drop Sort Test',
            },
          },
        }),
        sheetHelper: containerSheetHelper,
        tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
      });
    });
  }
);

type RunDragDropOrderTestParams = {
  firstItemRef: DocumentRef;
  secondItemRef: DocumentRef;
  sheetHelper: SheetHelper;
  tabId: string;
};

async function runDragDropOrderTest({
  firstItemRef,
  secondItemRef,
  sheetHelper,
  tabId,
}: RunDragDropOrderTestParams) {
  await sheetHelper.showSheet();
  await sheetHelper.tab(tabId);

  const $tab = sheetHelper.$sheet.locator(`[data-tab-contents-for="${tabId}"]`);
  const $firstItemEntry = $tab.locator(
    `[data-item-id="${firstItemRef.id}"]:is([data-tidy-table-row], [data-tidy-grid-item])`
  );
  const $secondItemEntry = $tab.locator(
    `[data-item-id="${secondItemRef.id}"]:is([data-tidy-table-row], [data-tidy-grid-item])`
  );

  const itemsBeforeDragAndDrop = await $firstItemEntry
    .or($secondItemEntry)
    .evaluateAll((items) => items.map((i) => i.getAttribute('data-item-id')));
  sectionsTest.expect(itemsBeforeDragAndDrop[0]).toEqual(firstItemRef.id);
  sectionsTest.expect(itemsBeforeDragAndDrop[1]).toEqual(secondItemRef.id);

  await $firstItemEntry.dragTo($secondItemEntry);
  await delay(100);

  const itemsAfterDragAndDrop = await $firstItemEntry
    .or($secondItemEntry)
    .evaluateAll((items) => items.map((i) => i.getAttribute('data-item-id')));
  sectionsTest.expect(itemsAfterDragAndDrop[0]).toEqual(secondItemRef.id);
  sectionsTest.expect(itemsAfterDragAndDrop[1]).toEqual(firstItemRef.id);
}

type RunSidebarDropToSheetTestParams = {
  item: SheetHelperItemCreationArgs;
  sheetHelper: SheetHelper;
  tabId: string;
};

async function runSidebarDropToSheetTest({
  item,
  sheetHelper,
  tabId,
}: RunSidebarDropToSheetTestParams) {
  // Create sidebar item
  // Open Items sidebar tab and search for target item
  // Open sheet to target tab
  // Drag item onto sheet by sudebar item ID
  // Verify the sheet now has the item with the custom section
}
