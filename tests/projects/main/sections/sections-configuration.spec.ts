import type { Page } from '@playwright/test';
import { PageHelper } from 'tests/utils/PageHelper';
import { sectionsTest } from './sections-test-fixture';
import type { DocumentRef } from 'tests/tests.types';
import type {
  SheetHelper,
  SheetHelperItemCreationArgs,
} from 'tests/helpers/SheetHelper';
import { CONSTANTS } from 'src/constants';

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
  item1: DocumentRef;
  item2: DocumentRef;
  item3: DocumentRef;
  tabId: string;
};

async function runSectionConfigTests(args: RunSectionConfigTestsArgs) {
  const { sheetHelper, item1, item2, item3, tabId } = args;
  const $configureSectionsButton = sheetHelper.$sheet.locator(
    `[data-tab-contents-for="${tabId}"] [data-tidy-sheet-part="utility-toolbar"] button[title="Configure Sections"]`
  );
  const $configureSectionsSaveChanges = ;
  const $configureSectionsUseDefault = ;
  const $configureSectionsUseDefaultYesButton = ;
  const $configureSectionMoveItemUpButton = ;
  const $configureSectionMoveItemDownButton = ;
  // TODO: Cut a function that gets locator by listbox role=option then hasText
  // TODO: Cut a function that uses listbox item locator function to then target the visibility option
  // TODO: Use these when toggling order


  await sheetHelper.showSheet();
  await sheetHelper.tab(tabId);

  // Open section config
  // Set to default and confirm

  const itemIdsBeforeSectionOrder = await getItemIdsInOrderOfAppearance(args);

  sectionsTest.expect(itemIdsBeforeSectionOrder[0]).toEqual(item1.id);
  sectionsTest.expect(itemIdsBeforeSectionOrder[1]).toEqual(item2.id);
  sectionsTest.expect(itemIdsBeforeSectionOrder[2]).toEqual(item3.id);

  // sort items

  // verify new order
  const itemIdsAfterSectionOrder = await getItemIdsInOrderOfAppearance(args);

  sectionsTest.expect(itemIdsAfterSectionOrder[0]).toEqual(item3.id);
  sectionsTest.expect(itemIdsAfterSectionOrder[1]).toEqual(item2.id);
  sectionsTest.expect(itemIdsAfterSectionOrder[2]).toEqual(item1.id);

  // toggle items 1 and 2 sections to hidden

  // verify section visibility on sheet tab
  const itemIdsAfterSectionVisibilityToggle =
    await getItemIdsInOrderOfAppearance(args);

  sectionsTest.expect(itemIdsAfterSectionVisibilityToggle.length).toEqual(1);
  sectionsTest.expect(itemIdsAfterSectionVisibilityToggle[0]).toEqual(item3.id);
}

async function getItemIdsInOrderOfAppearance(args: RunSectionConfigTestsArgs) {
  const { sheetHelper, item1, item2, item3, tabId } = args;
  return await sheetHelper.$sheet.evaluate(
    (sheet, { itemIds, tabId }) => {
      const itemSelectors = itemIds
        .map((id) => `[data-item-id="${id}"]`)
        .join(', ');
      const selector = `[data-tab-contents-for="${tabId}"] :is(${itemSelectors})[data-tidy-table-row]`;
      return Array.from(sheet.querySelectorAll(selector)).map((el) =>
        el.getAttribute('data-item-id')
      );
    },
    { itemIds: [item1.id, item2.id, item3.id], tabId }
  );
}
// Character - verify can order and show/hide sections
// - Attributes
// - Inventory
// - Spellbook
// - Features
// - Actions

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

