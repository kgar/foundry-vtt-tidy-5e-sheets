import type { Page } from '@playwright/test';
import { PageHelper } from 'tests/utils/PageHelper';
import { sectionsTest } from './sections-test-fixture';
import type { DocumentRef } from 'tests/tests.types';
import {
  SheetHelper,
  type SheetHelperItemCreationArgs,
} from 'tests/helpers/SheetHelper';
import { CONSTANTS } from 'src/constants';
import { delay } from 'src/utils/asynchrony';

import { Inventory } from 'src/features/sections/Inventory';
import { TidyFlags } from 'src/foundry/TidyFlags';

// Test Flow:
// before all: create items
// after all: delete items
// verify current order
// sort items
// verify new order
// toggle two of three item sections to hidden
// verify section visibility on sheet tab

type RunSectionConfigTestsArgs = {
  sheetHelper: SheetHelper;
  section1: string;
  section2: string;
  section3: string;
  tabId: string;
};

const customItemSection = 'Custom Test Section';

// Character - verify can order and show/hide sections
sectionsTest.describe('character', () => {
  // - Attributes
  sectionsTest(
    'attributes - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific items/spells/features and favorite them - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
            [TidyFlags.favorite.key]: true,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ITEM_TYPE_WEAPON,
        section2: 'spell1',
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  // - Attributes - multiple sections of same name
  sectionsTest(
    'attributes - multi-tab section',
    async ({ sectionPage, data }) => {
      // Add specific items/spells/features and favorite them:
      // - have at least one standard section
      // - have the same custom section across inventory / spellbook / features
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem4 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 4',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
            [TidyFlags.favorite.key]: true,
          },
        },
      });
      const testItem5 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 5',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
            [TidyFlags.favorite.key]: true,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ITEM_TYPE_WEAPON,
        section2: 'spell1',
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
      await sheetHelper.deleteEmbeddedItem(testItem4);
      await sheetHelper.deleteEmbeddedItem(testItem5);
    }
  );

  // - Inventory
  sectionsTest(
    'inventory - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific items - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
      });
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_EQUIPMENT,
      });
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ITEM_TYPE_WEAPON,
        section2: CONSTANTS.ITEM_TYPE_EQUIPMENT,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  // - Spellbook
  sectionsTest(
    'spellbook - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific spells - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Spell 1',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        system: {
          level: 0,
        },
      });
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Spell 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        system: {
          level: 1,
        },
      });
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Spell 3',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: 'spell0',
        section2: 'spell1',
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  // - Features
  sectionsTest(
    'features - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific feats - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      // passive
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Feat 1',
        type: CONSTANTS.ITEM_TYPE_FEAT,
      });
      // active
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Feat 2',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_ACTION,
          },
        },
      });
      // custom
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Feat 3',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.CHARACTER_FEAT_SECTION_PASSIVE,
        section2: CONSTANTS.CHARACTER_FEAT_SECTION_ACTIVE,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  // - Actions
  sectionsTest('actions - core functionality', async ({ data }) => {
    // Add specific items - have at least one custom section
    // Run the test
  });
});

// Specific flows
// - Attributes (Favorites)
// - Given spells, features, and items with identical section names
// - When opening the section config
// - The sections are distinguishable
// - somehow handle multiple duplicate sections in Favorites. Right now, this case causes the section config to error out.
// - suggestion: add the source tab name to custom sections in favorites specifically, while maintaining the correct label

// sectionsTest.describe('character', () => {
//   const itemsToCreate: SheetHelperItemCreationArgs[] = [
//     {
//         name: 'Item Section Config 1',
//         type: CONSTANTS.ITEM_TYPE_LOOT
//     }
//   ]
//     const items: DocumentRef[] = [];
//   sectionsTest.beforeAll(() => {
//     // Set up items with sections in specific order.
//     const sheetHelper =
//   });

//   sectionsTest.afterAll(() => {
//     // Remove all items from this test.
//   });
// });

// Character - verify sections can reorder via drag-and-drop
// - Attributes

// NPC - verify can order and show/hide sections
// - Abilities
// - Spellbook
// - Actions

// Vehicle - verify can order and show/hide sections
// - Actions

// Container - verify can order and show/hide sections
// - Contents

async function runStandardSectionConfigTests(args: RunSectionConfigTestsArgs) {
  const { sheetHelper, section1, section2, section3, tabId } = args;

  await sheetHelper.showSheet();

  await resetToDefault(sheetHelper, tabId);

  // establish initial section order- sections 1-3 should be in positions 1-3
  {
    const config = await sheetHelper.openSectionConfiguration(tabId);

    for (const [intendedPosition, section] of [
      section1,
      section2,
      section3,
    ].entries()) {
      let currentPositions = (
        // instead, get listbox options in current order
        await config.getOptionsInCurrentOrder()
      ).reduce<Record<string, { key: string; currentIndex: number }>>(
        (prev, curr, i) => {
          prev[curr] = { key: curr, currentIndex: i };
          return prev;
        },
        {}
      );

      await config.selectSection(section);

      for (
        let i = 0;
        i < currentPositions[section].currentIndex - intendedPosition;
        i++
      ) {
        await config.$configureSectionMoveItemUpButton.click();
      }
    }

    // save initial order
    await config.saveChanges();

    // verify sections are in initial intended order for the test
    const sections = await sheetHelper.getSectionsInCurrentOrder(tabId);
    sectionsTest.expect(sections[0]).toEqual(section1);
    sectionsTest.expect(sections[1]).toEqual(section2);
    sectionsTest.expect(sections[2]).toEqual(section3);
  }

  {
    // sort items via buttons - 3, 2, 1
    const config = await sheetHelper.openSectionConfiguration(tabId);
    await config.selectSection(section1);
    await config.$configureSectionMoveItemDownButton.click();
    await config.selectSection(section3);
    await config.$configureSectionMoveItemUpButton.click();
    await config.$configureSectionMoveItemUpButton.click();

    // save new order
    await config.saveChanges();

    // verify new order - 3, 2, 1
    const sections = await sheetHelper.getSectionsInCurrentOrder(tabId);
    sectionsTest.expect(sections[0]).toEqual(section3);
    sectionsTest.expect(sections[1]).toEqual(section2);
    sectionsTest.expect(sections[2]).toEqual(section1);
  }

  {
    // sort items via drag and drop - 3, 2, 1 => 2, 1, 3
    const config = await sheetHelper.openSectionConfiguration(tabId);
    await config.dragSectionTo(section2, section3);
    await config.dragSectionTo(section3, section1);

    // save changes
    await config.saveChanges();

    // verify new order - 2, 1, 3
    const sections = await sheetHelper.getSectionsInCurrentOrder(tabId);
    sectionsTest.expect(sections[0]).toEqual(section2);
    sectionsTest.expect(sections[1]).toEqual(section1);
    sectionsTest.expect(sections[2]).toEqual(section3);
  }

  {
    // toggle items 1 and 2 sections to hidden
    const config = await sheetHelper.openSectionConfiguration(tabId);
    await config.hideSection(section1);
    await config.hideSection(section2);

    // save changes
    await config.saveChanges();

    // verify section visibility on sheet tab
    const sections = await sheetHelper.getSectionsInCurrentOrder(tabId);

    await sectionsTest
      .expect(sheetHelper.getSectionLocator(tabId, section1))
      .toBeHidden();
    await sectionsTest
      .expect(sheetHelper.getSectionLocator(tabId, section2))
      .toBeHidden();
    sectionsTest.expect(sections[0]).toEqual(section3);
  }

  await resetToDefault(sheetHelper, tabId);
}

async function resetToDefault(sheetHelper: SheetHelper, tabId: string) {
  const config = await sheetHelper.openSectionConfiguration(tabId);
  await config.$configureSectionsUseDefault.click();
  await config.$configureSectionsUseDefaultYesButton.click();
  await config.$configureSectionsUseDefaultYesButton.waitFor({
    state: 'hidden',
  });
}
