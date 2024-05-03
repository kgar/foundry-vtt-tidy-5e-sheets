import { CONSTANTS } from 'src/constants';
import { Inventory } from 'src/features/sections/Inventory';
import { PageHelper } from 'tests/utils/PageHelper';
import type { DocumentRef } from 'tests/tests.types';
import {
  SheetHelper,
  type SheetHelperItemCreationArgs,
} from 'tests/helpers/SheetHelper';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { expect, type Page } from '@playwright/test';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { sectionsTest } from './sections-test-fixture';
import type { SectionsTestData } from './sections-test-data';

type CustomSectionItemParameters = {
  type: string;
  name: string;
  tabId: string;
  customSection: string;
  customActionSection: string;
  defaultSection?: string;
};

sectionsTest.beforeEach(async ({ page }) => {
  await PageHelper.routeToTestGame(page);
});

type DefaultSectionTestParams = {
  itemCreationArgs: SheetHelperItemCreationArgs;
  tabId: string;
  sectionKey: string;
};
sectionsTest.describe('sections core functionality', () => {
  sectionsTest.describe('character', () => {
    const itemsToTest: DefaultSectionTestParams[] = [
      ...Inventory.inventoryItemTypes.map((itemType) => ({
        itemCreationArgs: {
          name: `Test ${itemType}`,
          type: itemType,
        },
        tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
        sectionKey: itemType,
      })),
      {
        itemCreationArgs: {
          name: 'Test lvl 1 spell',
          type: CONSTANTS.ITEM_TYPE_SPELL,
          system: {
            level: 1,
          },
        },
        sectionKey: 'spell1',
        tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      },
      {
        itemCreationArgs: {
          name: 'Test active feature',
          type: CONSTANTS.ITEM_TYPE_FEAT,
          system: {
            activation: {
              type: CONSTANTS.ACTIVATION_COST_ACTION,
            },
          },
        },
        sectionKey: 'active',
        tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
      },
      {
        itemCreationArgs: {
          name: 'Test passive feature',
          type: CONSTANTS.ITEM_TYPE_FEAT,
        },
        sectionKey: 'passive',
        tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
      },
    ];

    for (const itemToTest of itemsToTest) {
      sectionsTest.describe(
        `item: "${itemToTest.itemCreationArgs.name}" | type "${itemToTest.itemCreationArgs.type}"`,
        () => {
          testSection(itemToTest, 'sectionTestCharacter');

          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          testCustomSection(
            itemWithCustomSection,
            'sectionTestCharacter',
            'section'
          );

          const itemWithCustomActionSection = structuredClone(itemToTest);
          itemWithCustomActionSection.itemCreationArgs.name = `Custom Action Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomActionSection.sectionKey = `Custom Action Section ${itemToTest.sectionKey}`;
          itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;
          testCustomSection(
            itemWithCustomActionSection,
            'sectionTestCharacter',
            'actionSection'
          );
        }
      );

      // TODO: Do the custom test for each relevant tab (not each relevant item), using localization keys for the section names; verify localizeable
    }
  });

  sectionsTest.describe('NPC', () => {
    const itemsToTest: DefaultSectionTestParams[] = [
      ...NpcSheetSections.abilitiesItemTypes.map((itemType) => ({
        itemCreationArgs: {
          name: `Test ${itemType}`,
          type: itemType,
        },
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
        sectionKey:
          itemType === CONSTANTS.ITEM_TYPE_WEAPON
            ? CONSTANTS.NPC_ABILITY_SECTION_WEAPONS
            : itemType === CONSTANTS.ITEM_TYPE_FEAT
            ? CONSTANTS.NPC_ABILITY_SECTION_PASSIVE
            : CONSTANTS.NPC_ABILITY_SECTION_EQUIPMENT,
      })),
      {
        itemCreationArgs: {
          name: 'Test lvl 1 spell',
          type: CONSTANTS.ITEM_TYPE_SPELL,
          system: {
            level: 1,
          },
        },
        sectionKey: 'spell1',
        tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
      },
      {
        itemCreationArgs: {
          name: 'Test action',
          type: CONSTANTS.ITEM_TYPE_FEAT,
          system: {
            activation: {
              type: CONSTANTS.ACTIVATION_COST_ACTION,
            },
          },
        },
        sectionKey: CONSTANTS.NPC_ABILITY_SECTION_ACTIONS,
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
      },
      {
        itemCreationArgs: {
          name: 'Test passive feature',
          type: CONSTANTS.ITEM_TYPE_FEAT,
        },
        sectionKey: 'passive',
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
      },
    ];

    for (const itemToTest of itemsToTest) {
      sectionsTest.describe(
        `item: "${itemToTest.itemCreationArgs.name}" | type "${itemToTest.itemCreationArgs.type}"`,
        () => {
          testSection(itemToTest, 'sectionTestNpc');

          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          testCustomSection(itemWithCustomSection, 'sectionTestNpc', 'section');

          const itemWithCustomActionSection = structuredClone(itemToTest);
          itemWithCustomActionSection.itemCreationArgs.name = `Custom Action Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomActionSection.sectionKey = `Custom Action Section ${itemToTest.sectionKey}`;
          itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;
          testCustomSection(
            itemWithCustomActionSection,
            'sectionTestNpc',
            'actionSection'
          );
        }
      );
    }
  });

  sectionsTest.describe('vehicle', () => {});
});

async function testSection(
  itemToTest: DefaultSectionTestParams,
  testDataKey: keyof SectionsTestData
) {
  sectionsTest(
    `defaults to section key "${itemToTest.sectionKey}"`,
    async ({ page, data }) => {
      // arrange
      const characterSheetHelper = new SheetHelper(page, data[testDataKey]);

      // act
      const item = await characterSheetHelper.createEmbeddedItem(
        page,
        itemToTest.itemCreationArgs
      );

      // assert
      await characterSheetHelper.showSheet();
      await characterSheetHelper.tab(itemToTest.tabId);
      await verifyItemExistsInSection({
        sheetHelper: characterSheetHelper,
        itemRef: item,
        page,
        sectionKey: itemToTest.sectionKey,
        tabId: itemToTest.tabId,
      });
    }
  );
}

async function testCustomSection(
  itemToTest: DefaultSectionTestParams,
  testDataKey: keyof SectionsTestData,
  sectionType: 'section' | 'actionSection'
) {
  sectionsTest(
    `defaults to section key "${itemToTest.sectionKey}"`,
    async ({ page, data }) => {
      // arrange
      const sheetHelper = new SheetHelper(page, data[testDataKey]);
      const item = await sheetHelper.createEmbeddedItem(
        page,
        itemToTest.itemCreationArgs
      );
      const itemSheetHelper = new SheetHelper(page, item);

      // act
      await itemSheetHelper.showSheet();
      await itemSheetHelper.tab(CONSTANTS.TAB_ITEM_DESCRIPTION_ID);
      const $sectionInput = itemSheetHelper.$sheet.locator(
        `[data-tidy-field="${TidyFlags[sectionType].prop}"]`
      );
      await $sectionInput.fill(itemToTest.sectionKey);
      await $sectionInput.press('Tab');

      // assert
      await sheetHelper.showSheet();
      await sheetHelper.tab(itemToTest.tabId);
      await verifyItemExistsInSection({
        sheetHelper: sheetHelper,
        itemRef: item,
        page,
        sectionKey: itemToTest.sectionKey,
        tabId: itemToTest.tabId,
      });
    }
  );
}

async function verifyItemExistsInSection(args: {
  sheetHelper: SheetHelper;
  page: Page;
  tabId: string;
  itemRef: DocumentRef;
  sectionKey: string;
}) {
  const { sheetHelper, page, tabId, itemRef, sectionKey } = args;

  await sheetHelper.showSheet();
  await sheetHelper.tab(args.tabId);

  const $row = page.locator(
    `[data-tab-contents-for="${tabId}"] [data-item-id="${itemRef.id}"][data-tidy-table-row]`
  );
  const rowText = await $row.textContent();
  const actualSectionKey = await $row.evaluate((row) =>
    row
      .closest('[data-tidy-section-key]')
      ?.getAttribute('data-tidy-section-key')
  );

  expect(rowText).toContain(itemRef.name);
  expect(actualSectionKey).toEqual(sectionKey);
}

sectionsTest.describe('Tidy Custom Sections: Core Functionality', () => {

  sectionsTest.describe('vehicles', () => {
    // Vehicles are a special case, in that the action tab is the only custom section content they support at present
    const vehicleItemTypesToTest: CustomSectionItemParameters[] = [
      ...Inventory.inventoryItemTypes.map((t) => ({
        type: t,
        name: `Custom Section Test ${t}`,
        tabId: 'unused for this test',
        customSection: `unused for this test`,
        customActionSection: `Custom Action ${t}`,
      })),
      {
        type: CONSTANTS.ITEM_TYPE_SPELL,
        name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_SPELL}`,
        tabId: 'unused for this test',
        customSection: `unused for this test`,
        customActionSection: `Custom Action ${CONSTANTS.ITEM_TYPE_SPELL}`,
        defaultSection: 'spell1',
      },
      {
        type: CONSTANTS.ITEM_TYPE_FEAT,
        name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_FEAT}`,
        tabId: 'unused for this test',
        customSection: `unused for this test`,
        customActionSection: `Custom Action ${CONSTANTS.ITEM_TYPE_FEAT}`,
        defaultSection: 'passive',
      },
    ];

    for (const itemTestInfo of vehicleItemTypesToTest) {
      sectionsTest(`item: ${itemTestInfo.name}`, async ({ page, data }) => {
        // arrange
        const item = await createItem(
          page,
          itemTestInfo,
          data.sectionTestVehicle
        );

        // act
        await applyCustomSectionsToItem(page, item, itemTestInfo);

        // assert
        const vehicleSheetHelper = new SheetHelper(
          page,
          data.sectionTestVehicle
        );
        await verifyCustomActionSection(vehicleSheetHelper, item, itemTestInfo);
      });
    }
  });
});

async function verifyCoreCustomSectionFunctionality(
  page: Page,
  actorRef: DocumentRef,
  itemTestInfo: CustomSectionItemParameters
) {
  const actorSheetHelper = new SheetHelper(page, actorRef);

  // API create item on actor
  const item = await createItem(page, itemTestInfo, actorRef);

  await actorSheetHelper.showSheet();

  await actorSheetHelper.tab(itemTestInfo.tabId);

  const $itemTableRow = actorSheetHelper.$sheet.locator(
    `[data-tab-contents-for="${itemTestInfo.tabId}"] [data-item-id="${item.id}"][data-tidy-table-row]`
  );

  const itemTableRowTextContent = await $itemTableRow.textContent();
  const theItemUnderTestHasTheExpectedName = itemTableRowTextContent?.includes(
    item.name
  );

  sectionsTest
    .expect(
      theItemUnderTestHasTheExpectedName,
      `item should have been successfully located in item tables`
    )
    .toBeTruthy();

  const isInDefaultSection = await $itemTableRow.evaluate(
    (row, { sectionKey }) => {
      return !!row.closest(`[data-tidy-section-key="${sectionKey}"]`);
    },
    {
      sectionKey: itemTestInfo.defaultSection ?? itemTestInfo.type,
    }
  );

  sectionsTest
    .expect(
      isInDefaultSection,
      `item should be in default section with key "${itemTestInfo.type}"`
    )
    .toBe(true);

  await applyCustomSectionsToItem(page, item, itemTestInfo);

  await actorSheetHelper.showSheet();

  const isInCustomSection = await $itemTableRow.evaluate(
    (row, { sectionKey }) => {
      return !!row.closest(`[data-tidy-section-key="${sectionKey}"]`);
    },
    {
      sectionKey: itemTestInfo.customSection,
    }
  );

  sectionsTest
    .expect(
      isInCustomSection,
      `item should be in custom section with key "${itemTestInfo.customSection}"`
    )
    .toBe(true);

  await verifyCustomActionSection(actorSheetHelper, item, itemTestInfo);
}
async function verifyCustomActionSection(
  actorSheetHelper: SheetHelper,
  item: DocumentRef,
  itemTestInfo: CustomSectionItemParameters
) {
  await actorSheetHelper.showSheet();
  await actorSheetHelper.tab(CONSTANTS.TAB_ACTOR_ACTIONS);

  const $actionItemTableRow = actorSheetHelper.$sheet.locator(
    `[data-tab-contents-for="${CONSTANTS.TAB_ACTOR_ACTIONS}"] [data-item-id="${item.id}"]`
  );

  const isInCustomActionSection = await $actionItemTableRow.evaluate(
    (row, { sectionKey }) => {
      return !!row.closest(`[data-tidy-section-key="${sectionKey}"]`);
    },
    {
      sectionKey: itemTestInfo.customActionSection,
    }
  );

  sectionsTest
    .expect(
      isInCustomActionSection,
      `item should be in custom action section with key "${itemTestInfo.customActionSection}"`
    )
    .toBeTruthy();
}

async function applyCustomSectionsToItem(
  page: Page,
  item: DocumentRef,
  itemTestInfo: CustomSectionItemParameters
) {
  const itemSheet = new SheetHelper(page, item);

  await itemSheet.showSheet();

  await itemSheet.tab(CONSTANTS.TAB_ITEM_DESCRIPTION_ID);

  const $sectionInput = itemSheet.$sheet.locator(
    `[data-tidy-field="${TidyFlags.section.prop}"]`
  );
  const $actionSectionInput = itemSheet.$sheet.locator(
    `[data-tidy-field="${TidyFlags.actionSection.prop}"]`
  );

  await $sectionInput.scrollIntoViewIfNeeded();

  await sectionsTest
    .expect($sectionInput, 'item custom section input must be available')
    .toBeVisible();

  await $sectionInput.fill(itemTestInfo.customSection);
  await $sectionInput.press('Tab');

  await $actionSectionInput.scrollIntoViewIfNeeded();

  await sectionsTest
    .expect(
      $actionSectionInput,
      'item custom action section input must be available'
    )
    .toBeVisible();

  await $actionSectionInput.fill(itemTestInfo.customActionSection);
  await $actionSectionInput.press('Tab');
}

async function createItem(
  page: Page,
  itemTestInfo: CustomSectionItemParameters,
  parent: DocumentRef
) {
  return await page.evaluate(
    async ({
      itemTestInfo,
      parentUuid,
      actionOverrideFlagProp,
    }): Promise<DocumentRef> => {
      const parent = await fromUuid(parentUuid);
      const item = await dnd5e.documents.Item5e.create(
        {
          name: itemTestInfo.name,
          type: itemTestInfo.type,
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
      itemTestInfo,
      parentUuid: parent.uuid,
      actionOverrideFlagProp: TidyFlags.actionFilterOverride.prop,
    }
  );
}
