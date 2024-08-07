import { expect } from '@playwright/test';
import { TidyFlags } from 'src/foundry/TidyFlags';
import { CONSTANTS } from 'src/constants';
import { SheetHelper } from 'tests/helpers/SheetHelper';
import type { DocumentRef } from 'tests/tests.types';
import type { DefaultSectionTestParams } from './sections.spec.types';
import type { Item5e } from 'src/types/item.types';

export async function testDefaultSection(
  itemToTest: DefaultSectionTestParams,
  sheetHelper: SheetHelper,
  onItemCreated?: (item: Item5e, helper: SheetHelper) => Promise<void>
) {
  // arrange

  // act
  const item = await sheetHelper.createEmbeddedItem(
    itemToTest.itemCreationArgs
  );
  await onItemCreated?.(item, sheetHelper);

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

export async function testCustomSection(
  itemToTest: DefaultSectionTestParams,
  sheetHelper: SheetHelper,
  sectionType: 'section' | 'actionSection',
  onItemCreated?: (item: DocumentRef, sheetHelper: SheetHelper) => Promise<void>
) {
  // arrange
  const item = await sheetHelper.createEmbeddedItem(
    itemToTest.itemCreationArgs
  );
  await onItemCreated?.(item, sheetHelper);
  const itemSheetHelper = new SheetHelper(sheetHelper.page, item);

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

export async function verifyItemExistsInSection(args: {
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

  const $tableEntry = $tab.locator(
    `[data-item-id="${itemRef.id}"]:is([data-tidy-table-row], [data-tidy-grid-item])`
  );

  const actualSectionKey = await $tableEntry.evaluate((entry) =>
    entry
      .closest('[data-tidy-section-key]')
      ?.getAttribute('data-tidy-section-key')
  );

  if (sectionLabel) {
    const sectionHeaderRowText =
      (await $tableEntry.evaluate(
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

  expect(actualSectionKey).toEqual(sectionKey);
}
