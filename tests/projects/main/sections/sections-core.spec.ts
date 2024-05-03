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

type DefaultSectionTestParams = {
  itemCreationArgs: SheetHelperItemCreationArgs;
  tabId: string;
  sectionKey: string;
  sectionLabel?: string;
};

let page: Page;

sectionsTest.beforeAll(async ({ browser }) => {
  await page?.close();
  page = await browser.newPage();
});

sectionsTest.afterAll(async () => {
  await page?.close();
});

sectionsTest.beforeEach(async () => {
  await PageHelper.routeToTestGame(page);
});

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
          testDefaultSection(itemToTest, 'sectionTestCharacter');
          const favoriteItemToTest = structuredClone(itemToTest);
          favoriteItemToTest.tabId = CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
          favoriteItemToTest.itemCreationArgs = {
            ...itemToTest.itemCreationArgs,
            name: `Favorite ${itemToTest.itemCreationArgs.name}`,
            flags: {
              ['tidy5e-sheet']: {
                [TidyFlags.favorite.key]: true,
              },
            },
          };
          testDefaultSection(favoriteItemToTest, 'sectionTestCharacter');
          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          testCustomSection(
            itemWithCustomSection,
            'sectionTestCharacter',
            'section'
          );
          {
            const favoriteWithCustomSection = structuredClone(itemToTest);
            favoriteWithCustomSection.itemCreationArgs.name = `Favorite Custom Section ${itemToTest.itemCreationArgs.name}`;
            favoriteWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
            favoriteWithCustomSection.tabId =
              CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
            favoriteWithCustomSection.itemCreationArgs = {
              ...itemToTest.itemCreationArgs,
              flags: {
                ['tidy5e-sheet']: {
                  [TidyFlags.favorite.key]: true,
                },
              },
            };
            testCustomSection(
              favoriteWithCustomSection,
              'sectionTestCharacter',
              'section'
            );
          }
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
    }

    // TODO: the localization aspect should be happening in getData() prep, because label and key are separate from each other, so label can be localized ahead of time
    const localizableItemsToTest: DefaultSectionTestParams[] = [
      {
        itemCreationArgs: {
          name: `Localization weapon test`,
          type: CONSTANTS.ITEM_TYPE_WEAPON,
          flags: {
            ['tidy5e-sheet']: {
              [TidyFlags.section.key]: 'TIDY5E.LocalizationTestKey',
              [TidyFlags.favorite.key]: true,
            },
          },
        },
        sectionKey: 'TIDY5E.LocalizationTestKey',
        sectionLabel: 'Localization Test Key',
        tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
      },
      {
        itemCreationArgs: {
          name: `Localization spell test`,
          type: CONSTANTS.ITEM_TYPE_SPELL,
          flags: {
            ['tidy5e-sheet']: {
              [TidyFlags.section.key]: 'TIDY5E.LocalizationTestKey',
              [TidyFlags.favorite.key]: true,
            },
          },
        },
        sectionKey: 'TIDY5E.LocalizationTestKey',
        sectionLabel: 'Localization Test Key',
        tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      },
      {
        itemCreationArgs: {
          name: `Localization feature test`,
          type: CONSTANTS.ITEM_TYPE_FEAT,
          flags: {
            ['tidy5e-sheet']: {
              [TidyFlags.section.key]: 'TIDY5E.LocalizationTestKey',
              [TidyFlags.favorite.key]: true,
            },
          },
        },
        sectionKey: 'TIDY5E.LocalizationTestKey',
        sectionLabel: 'Localization Test Key',
        tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
      },
    ];

    for (const itemToTest of localizableItemsToTest) {
      const itemWithCustomSection = structuredClone(itemToTest);
      testCustomSection(
        itemWithCustomSection,
        'sectionTestCharacter',
        'section'
      );

      const favoriteWithCustomSection = structuredClone(itemToTest);
      favoriteWithCustomSection.itemCreationArgs.name = `Favorite ${itemToTest.itemCreationArgs.name}`;
      favoriteWithCustomSection.tabId = CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
      testCustomSection(
        favoriteWithCustomSection,
        'sectionTestCharacter',
        'section'
      );

      const itemWithCustomActionSection = structuredClone(itemToTest);
      itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;
      testCustomSection(
        itemWithCustomActionSection,
        'sectionTestCharacter',
        'actionSection'
      );
    }
  });

  sectionsTest.describe('container', () => {
    const itemsToTest: DefaultSectionTestParams[] = [
      ...Inventory.inventoryItemTypes.map<DefaultSectionTestParams>(
        (itemType) => ({
          itemCreationArgs: {
            name: `Test ${itemType}`,
            type: itemType,
          },
          tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
          sectionKey: itemType,
          parent: 'sectionTestCharacter',
        })
      ),
    ];

    for (const itemToTest of itemsToTest) {
      sectionsTest.describe(
        `item: "${itemToTest.itemCreationArgs.name}" | type "${itemToTest.itemCreationArgs.type}"`,
        () => {
          sectionsTest(
            `defaults to section key "${itemToTest.sectionKey}"`,
            async ({ data }) => {
              // arrange
              const characterSheetHelper = new SheetHelper(
                page,
                data.sectionTestCharacter
              );
              const containerSheetHelper = new SheetHelper(
                page,
                data.sectionTestOwnedContainer
              );

              // act
              const item = await characterSheetHelper.createEmbeddedItem({
                ...itemToTest.itemCreationArgs,
                system: { container: data.sectionTestOwnedContainer.id },
              });

              // assert
              await containerSheetHelper.showSheet();
              await containerSheetHelper.tab(itemToTest.tabId);
              await verifyItemExistsInSection({
                sheetHelper: containerSheetHelper,
                itemRef: item,
                tabId: itemToTest.tabId,
                sectionKey: itemToTest.sectionKey,
                sectionLabel: itemToTest.sectionLabel,
              });
            }
          );

          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          sectionsTest(
            `can be assigned custom section "${itemWithCustomSection.sectionKey}"`,
            async ({ data }) => {
              // arrange
              const characterSheetHelper = new SheetHelper(
                page,
                data.sectionTestCharacter
              );
              const containerSheetHelper = new SheetHelper(
                page,
                data.sectionTestOwnedContainer
              );
              const item = await characterSheetHelper.createEmbeddedItem({
                ...itemWithCustomSection.itemCreationArgs,
                system: { container: data.sectionTestOwnedContainer.id },
              });
              const itemSheetHelper = new SheetHelper(page, item);

              // act
              await itemSheetHelper.showSheet();
              await itemSheetHelper.tab(CONSTANTS.TAB_ITEM_DESCRIPTION_ID);
              const $sectionInput = itemSheetHelper.$sheet.locator(
                `[data-tidy-field="${TidyFlags.section.prop}"]`
              );
              await $sectionInput.fill(itemWithCustomSection.sectionKey);
              await $sectionInput.press('Tab');

              // assert
              await containerSheetHelper.showSheet();
              await containerSheetHelper.tab(itemWithCustomSection.tabId);
              await verifyItemExistsInSection({
                sheetHelper: containerSheetHelper,
                itemRef: item,
                tabId: itemWithCustomSection.tabId,
                sectionKey: itemWithCustomSection.sectionKey,
                sectionLabel: itemWithCustomSection.sectionLabel,
              });
            }
          );
        }
      );
    }

    const containerItemLocalizationTest: DefaultSectionTestParams = {
      itemCreationArgs: {
        name: 'Container Localization Test',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
      },
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
      tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
    };

    sectionsTest(
      `can be assigned custom section "${containerItemLocalizationTest.sectionKey}"`,
      async ({ data }) => {
        // arrange
        const characterSheetHelper = new SheetHelper(
          page,
          data.sectionTestCharacter
        );
        const containerSheetHelper = new SheetHelper(
          page,
          data.sectionTestOwnedContainer
        );
        const item = await characterSheetHelper.createEmbeddedItem({
          ...containerItemLocalizationTest.itemCreationArgs,
          system: { container: data.sectionTestOwnedContainer.id },
        });
        const itemSheetHelper = new SheetHelper(page, item);

        // act
        await itemSheetHelper.showSheet();
        await itemSheetHelper.tab(CONSTANTS.TAB_ITEM_DESCRIPTION_ID);
        const $sectionInput = itemSheetHelper.$sheet.locator(
          `[data-tidy-field="${TidyFlags.section.prop}"]`
        );
        await $sectionInput.fill(containerItemLocalizationTest.sectionKey);
        await $sectionInput.press('Tab');

        // assert
        await containerSheetHelper.showSheet();
        await containerSheetHelper.tab(containerItemLocalizationTest.tabId);
        await verifyItemExistsInSection({
          sheetHelper: containerSheetHelper,
          itemRef: item,
          tabId: containerItemLocalizationTest.tabId,
          sectionKey: containerItemLocalizationTest.sectionKey,
          sectionLabel: containerItemLocalizationTest.sectionLabel,
        });
      }
    );
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
          testDefaultSection(itemToTest, 'sectionTestNpc');

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

    // TODO: test localization key section for
    // - Abilities
    // - Spellbook
    // - Actions
  });

  sectionsTest.describe('vehicle', () => {
    const itemsToTest: DefaultSectionTestParams[] = [
      ...Inventory.inventoryItemTypes.map((t) => ({
        itemCreationArgs: {
          name: `Custom Action Section Test ${t}`,
          type: t,
        },
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
        sectionKey: `Custom Action ${t}`,
      })),
      {
        itemCreationArgs: {
          name: `Custom Action Section Test ${CONSTANTS.ITEM_TYPE_SPELL}`,
          type: CONSTANTS.ITEM_TYPE_SPELL,
        },
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
        sectionKey: `Custom Action ${CONSTANTS.ITEM_TYPE_SPELL}`,
      },
      {
        itemCreationArgs: {
          name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_FEAT}`,
          type: CONSTANTS.ITEM_TYPE_FEAT,
        },
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
        sectionKey: `Custom Action ${CONSTANTS.ITEM_TYPE_FEAT}`,
      },
    ];

    for (let itemToTest of itemsToTest) {
      testCustomSection(itemToTest, 'sectionTestVehicle', 'actionSection');
    }

    // TODO: test localization key section for
    // - Actions
  });
});

function testDefaultSection(
  itemToTest: DefaultSectionTestParams,
  testDataKey: keyof SectionsTestData
) {
  sectionsTest(
    `${itemToTest.itemCreationArgs.name} defaults to section key "${itemToTest.sectionKey}"`,
    async ({ data }) => {
      // arrange
      const sheetHelper = new SheetHelper(page, data[testDataKey]);

      // act
      const item = await sheetHelper.createEmbeddedItem(
        itemToTest.itemCreationArgs
      );

      // assert
      await sheetHelper.showSheet();
      await sheetHelper.tab(itemToTest.tabId);
      await verifyItemExistsInSection({
        sheetHelper: sheetHelper,
        itemRef: item,
        tabId: itemToTest.tabId,
        sectionKey: itemToTest.sectionKey,
        sectionLabel: itemToTest.sectionLabel,
      });
    }
  );
}

function testCustomSection(
  itemToTest: DefaultSectionTestParams,
  testDataKey: keyof SectionsTestData,
  sectionType: 'section' | 'actionSection'
) {
  sectionsTest(
    `${itemToTest.itemCreationArgs.name} can be assigned custom ${sectionType} "${itemToTest.sectionKey}"`,
    async ({ data }) => {
      if (
        itemToTest.itemCreationArgs.type === 'spell' &&
        itemToTest.itemCreationArgs.name.toLocaleLowerCase().includes('localiz')
      ) {
        debugger;
      }

      // arrange
      const sheetHelper = new SheetHelper(page, data[testDataKey]);
      const item = await sheetHelper.createEmbeddedItem(
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
        tabId: itemToTest.tabId,
        sectionKey: itemToTest.sectionKey,
        sectionLabel: itemToTest.sectionLabel,
      });
    }
  );
}

async function verifyItemExistsInSection(args: {
  sheetHelper: SheetHelper;
  tabId: string;
  itemRef: DocumentRef;
  sectionKey: string;
  sectionLabel: string | undefined;
}) {
  const { sheetHelper, tabId, itemRef, sectionKey, sectionLabel } = args;

  await sheetHelper.showSheet();
  await sheetHelper.tab(args.tabId);

  const $tab = sheetHelper.$sheet.locator(`[data-tab-contents-for="${tabId}"]`);
  const $row = $tab.locator(
    `[data-item-id="${itemRef.id}"][data-tidy-table-row]`
  );
  const rowText = await $row.textContent();
  const actualSectionKey = await $row.evaluate((row) =>
    row
      .closest('[data-tidy-section-key]')
      ?.getAttribute('data-tidy-section-key')
  );

  if (sectionLabel) {
    const sectionHeaderRowText =
      (await $row.evaluate(
        (row, { actualSectionKey, constants }) =>
          row
            .closest(`[data-tidy-section-key="${actualSectionKey}"]`)
            ?.querySelector(
              `[data-tidy-sheet-part="${constants.SHEET_PARTS.ITEM_TABLE_HEADER_ROW}"], [data-tidy-sheet-part="${constants.SHEET_PARTS.TABLE_HEADER_ROW}"]`
            )?.textContent,
        { actualSectionKey, constants: CONSTANTS }
      )) ?? '🚫';
    expect(sectionHeaderRowText?.toLowerCase()).toContain(
      sectionLabel.toLowerCase()
    );
  }

  expect(rowText).toContain(itemRef.name);

  expect(actualSectionKey).toEqual(sectionKey);
}
