import { CONSTANTS } from 'src/constants';
import { Inventory } from 'src/features/sections/Inventory';
import { SheetHelper } from 'tests/helpers/SheetHelper';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { sectionsTest } from './sections-test-fixture';
import type { DefaultSectionTestParams } from './sections.spec.types';
import {
  testDefaultSection,
  testCustomSection,
  verifyItemExistsInSection,
} from './sections-shared';

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
          sectionsTest(
            `${itemToTest.itemCreationArgs.name} defaults to section key "${itemToTest.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testDefaultSection(
                itemToTest,
                new SheetHelper(sectionPage, data.sectionTestCharacter)
              );
            }
          );

          const favoriteItemToTest = structuredClone(itemToTest);
          favoriteItemToTest.tabId = CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
          favoriteItemToTest.itemCreationArgs = {
            ...itemToTest.itemCreationArgs,
            name: `Favorite ${itemToTest.itemCreationArgs.name}`,
          };
          sectionsTest(
            `${favoriteItemToTest.itemCreationArgs.name} defaults to section key "${favoriteItemToTest.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testDefaultSection(
                favoriteItemToTest,
                new SheetHelper(sectionPage, data.sectionTestCharacter),
                async (item, helper) => await helper.addFavoriteItem(item.uuid)
              );
            }
          );

          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          sectionsTest(
            `${itemWithCustomSection.itemCreationArgs.name} can be assigned to custom section "${itemWithCustomSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testCustomSection(
                itemWithCustomSection,
                new SheetHelper(sectionPage, data.sectionTestCharacter),
                'section'
              );
            }
          );

          const favoriteWithCustomSection = structuredClone(itemToTest);
          favoriteWithCustomSection.itemCreationArgs.name = `Favorite Custom Section ${itemToTest.itemCreationArgs.name}`;
          favoriteWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          favoriteWithCustomSection.tabId = CONSTANTS.TAB_CHARACTER_ATTRIBUTES;
          favoriteWithCustomSection.itemCreationArgs = {
            ...itemToTest.itemCreationArgs,
          };
          sectionsTest(
            `${favoriteWithCustomSection.itemCreationArgs.name} can be assigned to custom section "${favoriteWithCustomSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              const sheetHelper = new SheetHelper(
                sectionPage,
                data.sectionTestCharacter
              );

              await testCustomSection(
                favoriteWithCustomSection,
                sheetHelper,
                'section',
                async (item, helper) => await helper.addFavoriteItem(item.uuid)
              );
            }
          );

          const itemWithCustomActionSection = structuredClone(itemToTest);
          itemWithCustomActionSection.itemCreationArgs.name = `Custom Action Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomActionSection.sectionKey = `Custom Action Section ${itemToTest.sectionKey}`;
          itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;
          sectionsTest(
            `${itemWithCustomActionSection.itemCreationArgs.name} can be assigned to custom section "${itemWithCustomActionSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testCustomSection(
                itemWithCustomActionSection,
                new SheetHelper(sectionPage, data.sectionTestCharacter),
                'actionSection'
              );
            }
          );
        }
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
            async ({ data, sectionPage }) => {
              // arrange
              const characterSheetHelper = new SheetHelper(
                sectionPage,
                data.sectionTestCharacter
              );
              const containerSheetHelper = new SheetHelper(
                sectionPage,
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
            `can be assigned custom section section "${itemWithCustomSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              // arrange
              const characterSheetHelper = new SheetHelper(
                sectionPage,
                data.sectionTestCharacter
              );
              const containerSheetHelper = new SheetHelper(
                sectionPage,
                data.sectionTestOwnedContainer
              );
              const item = await characterSheetHelper.createEmbeddedItem({
                ...itemWithCustomSection.itemCreationArgs,
                system: { container: data.sectionTestOwnedContainer.id },
              });
              const itemSheetHelper = new SheetHelper(sectionPage, item);

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
          sectionsTest(
            `${itemToTest.itemCreationArgs.name} defaults to section key "${itemToTest.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testDefaultSection(
                itemToTest,
                new SheetHelper(sectionPage, data.sectionTestNpc)
              );
            }
          );

          const itemWithCustomSection = structuredClone(itemToTest);
          itemWithCustomSection.itemCreationArgs.name = `Custom Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomSection.sectionKey = `Custom Section ${itemToTest.sectionKey}`;
          sectionsTest(
            `${itemWithCustomSection.itemCreationArgs.name} can be assigned custom section "${itemWithCustomSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testCustomSection(
                itemWithCustomSection,
                new SheetHelper(sectionPage, data.sectionTestNpc),
                'section'
              );
            }
          );

          const itemWithCustomActionSection = structuredClone(itemToTest);
          itemWithCustomActionSection.itemCreationArgs.name = `Custom Action Section ${itemToTest.itemCreationArgs.name}`;
          itemWithCustomActionSection.sectionKey = `Custom Action Section ${itemToTest.sectionKey}`;
          itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;
          sectionsTest(
            `${itemWithCustomActionSection.itemCreationArgs.name} can be assigned custom section "${itemWithCustomActionSection.sectionKey}"`,
            async ({ data, sectionPage }) => {
              await testCustomSection(
                itemWithCustomActionSection,
                new SheetHelper(sectionPage, data.sectionTestNpc),
                'actionSection'
              );
            }
          );
        }
      );
    }
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

    for (const itemToTest of itemsToTest) {
      sectionsTest(
        `${itemToTest.itemCreationArgs.name} can be assigned custom section "${itemToTest.sectionKey}"`,
        async ({ data, sectionPage }) => {
          await testCustomSection(
            itemToTest,
            new SheetHelper(sectionPage, data.sectionTestVehicle),
            'actionSection'
          );
        }
      );
    }
  });
});
