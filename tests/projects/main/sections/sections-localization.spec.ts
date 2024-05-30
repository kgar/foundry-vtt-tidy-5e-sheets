import { CONSTANTS } from 'src/constants';
import { SheetHelper } from 'tests/helpers/SheetHelper';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { sectionsTest } from './sections-test-fixture';
import type { DefaultSectionTestParams } from './sections.spec.types';
import {
  testCustomSection,
  verifyItemExistsInSection,
} from './sections-shared';
import { NpcSheetSections } from 'src/features/sections/NpcSheetSections';
import { Inventory } from 'src/features/sections/Inventory';

sectionsTest.describe('character', () => {
  // TODO: the localization aspect should be happening in getData() prep, because label and key are separate from each other, so label can be localized ahead of time
  const localizableItemsToTest: DefaultSectionTestParams[] = [
    {
      itemCreationArgs: {
        name: `Localization weapon test`,
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          ['tidy5e-sheet']: {
            [TidyFlags.section.key]: 'TIDY5E.LocalizationTestKey',
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
          },
        },
      },
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
      tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
    },
  ];

  sectionsTest.describe('list', () => {
    sectionsTest.beforeAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToListView();
    });

    for (const itemToTest of localizableItemsToTest) {
      runAllCharacterTests(itemToTest);
    }
  });

  sectionsTest.describe('grid', () => {
    sectionsTest.beforeAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToGridView();
    });

    sectionsTest.afterAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToListView();
    });

    for (const itemToTest of localizableItemsToTest) {
      runAllCharacterTests(itemToTest);
    }
  });
});

sectionsTest.describe('NPC', () => {
  // TODO: test localization key section for
  // - Abilities -
  const itemsToTest: DefaultSectionTestParams[] = [
    ...NpcSheetSections.abilitiesItemTypes.map((itemType) => ({
      itemCreationArgs: {
        name: `Test ${itemType}`,
        type: itemType,
      },
      tabId: CONSTANTS.TAB_NPC_ABILITIES,
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
    })),
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
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
      tabId: CONSTANTS.TAB_NPC_ABILITIES,
    },
    {
      itemCreationArgs: {
        name: 'Test passive feature',
        type: CONSTANTS.ITEM_TYPE_FEAT,
      },
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
      tabId: CONSTANTS.TAB_NPC_ABILITIES,
    },
  ];
  const spellToTest = {
    itemCreationArgs: {
      name: 'Test lvl 1 spell',
      type: CONSTANTS.ITEM_TYPE_SPELL,
      system: {
        level: 1,
      },
    },
    sectionKey: 'TIDY5E.LocalizationTestKey',
    sectionLabel: 'Localization Test Key',
    tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
  };

  const listItemsToTest = [...itemsToTest, spellToTest];
  const gridItemsToTest = [spellToTest];

  sectionsTest.describe('list', () => {
    sectionsTest.beforeAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToListView();
    });

    for (const itemToTest of listItemsToTest) {
      runAllNpcTests(itemToTest);
    }
  });

  sectionsTest.describe('grid', () => {
    sectionsTest.beforeAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToGridView();
    });

    sectionsTest.afterAll(async ({ data, sectionPage }) => {
      await new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      ).setToListView();
    });

    for (const itemToTest of gridItemsToTest) {
      runAllNpcTests(itemToTest);
    }
  });

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
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
    })),
    {
      itemCreationArgs: {
        name: `Custom Action Section Test ${CONSTANTS.ITEM_TYPE_SPELL}`,
        type: CONSTANTS.ITEM_TYPE_SPELL,
      },
      tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
    },
    {
      itemCreationArgs: {
        name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_FEAT}`,
        type: CONSTANTS.ITEM_TYPE_FEAT,
      },
      tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      sectionKey: 'TIDY5E.LocalizationTestKey',
      sectionLabel: 'Localization Test Key',
    },
  ];

  for (const itemToTest of itemsToTest) {
    runAllVehicleTests(itemToTest);
  }
});

sectionsTest.describe('container', () => {
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
        ...containerItemLocalizationTest.itemCreationArgs,
        system: { container: data.sectionTestOwnedContainer.id },
      });
      const itemSheetHelper = new SheetHelper(sectionPage, item);

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

function runAllCharacterTests(itemToTest: DefaultSectionTestParams) {
  sectionsTest(
    `${itemToTest.itemCreationArgs.name} can be localized`,
    async ({ data, sectionPage }) => {
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionTestCharacter
      );
      await testCustomSection(
        itemToTest,
        sheetHelper,
        'section',
        async (item, helper) => await helper.addFavoriteItem(item.uuid)
      );
    }
  );

  const favoriteWithCustomSection = structuredClone(itemToTest);
  favoriteWithCustomSection.itemCreationArgs.name = `Favorite ${itemToTest.itemCreationArgs.name}`;
  favoriteWithCustomSection.tabId = CONSTANTS.TAB_CHARACTER_ATTRIBUTES;

  sectionsTest(
    `${favoriteWithCustomSection.itemCreationArgs.name} can be localized`,
    async ({ data, sectionPage }) => {
      await testCustomSection(
        favoriteWithCustomSection,
        new SheetHelper(sectionPage, data.sectionTestCharacter),
        'section',
        async (item, helper) => await helper.addFavoriteItem(item.uuid)
      );
    }
  );

  const itemWithCustomActionSection = structuredClone(itemToTest);
  itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;

  sectionsTest(
    `${itemWithCustomActionSection.itemCreationArgs.name} can be localized on action list`,
    async ({ data, sectionPage }) => {
      await testCustomSection(
        itemWithCustomActionSection,
        new SheetHelper(sectionPage, data.sectionTestCharacter),
        'actionSection'
      );
    }
  );
}

function runAllNpcTests(itemToTest: DefaultSectionTestParams) {
  sectionsTest(
    `${itemToTest.itemCreationArgs.name} can be localized`,
    async ({ data, sectionPage }) => {
      await testCustomSection(
        itemToTest,
        new SheetHelper(sectionPage, data.sectionTestNpc),
        'section',
        async (item, helper) => await helper.addFavoriteItem(item.uuid)
      );
    }
  );

  const itemWithCustomActionSection = structuredClone(itemToTest);
  itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;

  sectionsTest(
    `${itemWithCustomActionSection.itemCreationArgs.name} can be localized on action list`,
    async ({ data, sectionPage }) => {
      await testCustomSection(
        itemWithCustomActionSection,
        new SheetHelper(sectionPage, data.sectionTestNpc),
        'actionSection'
      );
    }
  );
}

function runAllVehicleTests(itemToTest: DefaultSectionTestParams) {
  const itemWithCustomActionSection = structuredClone(itemToTest);
  itemWithCustomActionSection.tabId = CONSTANTS.TAB_ACTOR_ACTIONS;

  sectionsTest(
    `${itemWithCustomActionSection.itemCreationArgs.name} can be localized on action list`,
    async ({ data, sectionPage }) => {
      await testCustomSection(
        itemWithCustomActionSection,
        new SheetHelper(sectionPage, data.sectionTestNpc),
        'actionSection'
      );
    }
  );
}
