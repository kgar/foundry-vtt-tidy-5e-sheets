import { SheetHelper } from 'tests/helpers/SheetHelper';
import { sectionsTest } from './sections-test-fixture';
import type { Page } from '@playwright/test';
import { PageHelper } from 'tests/utils/PageHelper';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { DocumentRef } from 'tests/tests.types';
import { delay } from 'src/utils/asynchrony';
import { WorldHelper } from 'tests/helpers/WorldHelper';

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

sectionsTest.describe(
  'drag and drop sidebar item with custom section creates the item with the custom section included',
  () => {
    sectionsTest('character inventory', async ({ data }) => {
      const sectionKey =
        'Test Drop Sidebar to Character Inventory Custom Section';
      const worldHelper = new WorldHelper(page);
      const itemRef = await worldHelper.createItem({
        name: 'Test PC Inventory Drop From Sidebar',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: sectionKey,
          },
        },
      });

      await runSidebarDropToSheetTest({
        itemRef: itemRef,
        sectionKey: sectionKey,
        sheetHelper: new SheetHelper(page, data.sectionTestCharacter),
        tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
      });
    });

    sectionsTest('NPC abilities', async ({ data }) => {
      const sectionKey = 'Test Drop Sidebar to NPC Abilities Custom Section';
      const worldHelper = new WorldHelper(page);
      const itemRef = await worldHelper.createItem({
        name: 'Test NPC Inventory Drop From Sidebar',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: sectionKey,
          },
        },
      });

      await runSidebarDropToSheetTest({
        itemRef: itemRef,
        sectionKey: sectionKey,
        sheetHelper: new SheetHelper(page, data.sectionTestNpc),
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
      });
    });

    sectionsTest('vehicle actions', async ({ data }) => {
      const sectionKey = 'Test Drop Sidebar to Vehicle Actions Custom Section';
      const worldHelper = new WorldHelper(page);
      const itemRef = await worldHelper.createItem({
        name: 'Test Vehicle Action Drop From Sidebar',
        type: CONSTANTS.ITEM_TYPE_CONSUMABLE,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.actionSection.key]: sectionKey,
            [TidyFlags.actionFilterOverride.key]: true,
          },
        },
      });

      await runSidebarDropToSheetTest({
        itemRef: itemRef,
        sectionKey: sectionKey,
        sheetHelper: new SheetHelper(page, data.sectionTestVehicle),
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      });
    });

    sectionsTest('container contents', async ({ data }) => {
      const sectionKey =
        'Test Drop Sidebar to Container Contents Custom Section';
      const worldHelper = new WorldHelper(page);
      const itemRef = await worldHelper.createItem({
        name: 'Test Container Inventory Drop From Sidebar',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: sectionKey,
          },
        },
      });

      await runSidebarDropToSheetTest({
        itemRef: itemRef,
        sectionKey: sectionKey,
        sheetHelper: new SheetHelper(page, data.sectionTestOwnedContainer),
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
  itemRef: DocumentRef;
  sheetHelper: SheetHelper;
  tabId: string;
  sectionKey: string;
};

async function runSidebarDropToSheetTest({
  itemRef,
  sheetHelper,
  tabId,
  sectionKey,
}: RunSidebarDropToSheetTestParams) {
  // Prepare sheet for drag and drop
  await sheetHelper.showSheet();
  await sheetHelper.tab(tabId);
  const $tabContents = sheetHelper.$sheet.locator(
    `[data-tab-contents-for="${tabId}"]`
  );

  // Prepare sidebar for drag and drop
  await page.locator(`#sidebar nav [data-tab="items"]`).click();
  const $sidebarActorsSection = page.locator(
    `#sidebar section[data-tab="items"]`
  );
  const $sidebarSearch = $sidebarActorsSection.locator(`input[name="search"]`);
  await $sidebarSearch.clear();
  await $sidebarSearch.fill(itemRef.name);
  await $sidebarSearch.press('Tab');
  const $sidebarItem = $sidebarActorsSection.locator(
    `[data-document-id="${itemRef.id}"]`
  );

  // Drag item onto sheet
  await $sidebarItem.dragTo($tabContents);
  await delay(100);

  // Verify the sheet now has the item with the custom section
  const newItem = await sheetHelper.$sheet.evaluate(
    async (sheet, { itemName, itemOwnerUuid }) => {
      const itemOwner = await fromUuid(itemOwnerUuid);
      const item = (itemOwner?.items ?? itemOwner?.system.contents).find(
        (i: any) => i.name === itemName
      );

      const tableEntry = sheet.querySelector(
        `[data-item-id="${item.id}"]:is([data-tidy-table-row], [data-tidy-grid-item])`
      );

      const sectionName = tableEntry
        ?.closest('[data-tidy-section-key]')
        ?.getAttribute('data-tidy-section-key');

      return {
        itemExists: !!item,
        itemSection: sectionName,
      };
    },
    { itemName: itemRef.name, itemOwnerUuid: sheetHelper.ref.uuid }
  );

  sectionsTest.expect(newItem.itemExists).toBeTruthy();
  sectionsTest.expect(newItem.itemSection).toEqual(sectionKey);
}
