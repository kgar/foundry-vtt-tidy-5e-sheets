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
      await sheetHelper.lockSheet();
      await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
      });
      await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_EQUIPMENT,
      });
      const customItemSection = 'Custom Weapon Section';
      await sheetHelper.createEmbeddedItem({
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
    }
  );

  // - Attributes - multiple sections of same name
  sectionsTest('attributes - multi-tab section', async ({ data }) => {
    // Add specific items/spells/features and favorite them:
    // - have at least one standard section
    // - have the same custom section across inventory / spellbook / features
    // Run the test
  });

  // - Inventory
  sectionsTest('inventory - core functionality', async ({ data }) => {
    // Add specific items - have at least one custom section
    // Run the test
  });

  // - Spellbook
  sectionsTest('spellbook - core functionality', async ({ data }) => {
    // Add specific items - have at least one custom section
    // Run the test
  });

  // - Features
  sectionsTest('features - core functionality', async ({ data }) => {
    // Add specific items - have at least one custom section
    // Run the test
  });

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

  {
    await resetToDefault(sheetHelper, tabId);

    // verify initial section order - 1, 2, 3
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
    await config.$configureSectionMoveItemUpButton.click({ clickCount: 2 });

    // save new order
    await config.$configureSectionsSaveChanges.click();
    await delay(100);

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
    await config.$configureSectionsSaveChanges.click();
    await delay(100);

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
    await config.$configureSectionsSaveChanges.click();
    await delay(100);

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
  await delay(100);
}
