// To Do: Exercise the core Tidy Custom Item Sections specifications for PC, NPC, and Container

import { CONSTANTS } from 'src/constants';
import { Inventory } from 'src/features/sections/Inventory';
import { PageHelper } from 'tests/utils/PageHelper';
import type { DocumentRef } from 'tests/tests.types';
import { SheetHelper } from 'tests/utils/SheetHelper';
import { TidyFlags } from 'src/foundry/TidyFlags';
import test from '@playwright/test';
import { sectionTestDataProvider } from './sections-test-data';

test.beforeEach(async ({ page }) => {
  await PageHelper.routeToTestGame(page);
});

test.describe('Tidy Custom Sections: Core Functionality', () => {
  const itemTypesToTest: {
    type: string;
    name: string;
    tabId: string;
    customSection: string;
    customActionSection: string;
    defaultSection?: string;
  }[] = [
    ...Inventory.inventoryItemTypes.map((t) => ({
      type: t,
      name: `Custom Section Test ${t}`,
      tabId: CONSTANTS.TAB_CHARACTER_INVENTORY,
      customSection: `Custom ${t}`,
      customActionSection: `Custom Action ${t}`,
    })),
    {
      type: CONSTANTS.ITEM_TYPE_SPELL,
      name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_SPELL}`,
      tabId: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      customSection: `Custom ${CONSTANTS.ITEM_TYPE_SPELL}`,
      customActionSection: `Custom Action ${CONSTANTS.ITEM_TYPE_SPELL}`,
      defaultSection: 'spell1',
    },
    {
      type: CONSTANTS.ITEM_TYPE_FEAT,
      name: `Custom Section Test ${CONSTANTS.ITEM_TYPE_FEAT}`,
      tabId: CONSTANTS.TAB_CHARACTER_FEATURES,
      customSection: `Custom ${CONSTANTS.ITEM_TYPE_FEAT}`,
      customActionSection: `Custom Action ${CONSTANTS.ITEM_TYPE_FEAT}`,
      defaultSection: 'passive',
    },
  ];

  const data = sectionTestDataProvider.get();

  for (const itemTestInfo of itemTypesToTest) {
    test(`item: ${itemTestInfo.name}`, async ({ page }) => {
      const characterSheet = new SheetHelper(page, data.sectionTestCharacter);
      // API create item on actor
      const item = await page.evaluate(
        async ({
          itemTestInfo,
          data,
          actionOverrideFlagProp,
        }): Promise<DocumentRef> => {
          const parent = await fromUuid(data.sectionTestCharacter.uuid);
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
          data,
          actionOverrideFlagProp: TidyFlags.actionFilterOverride.prop,
        }
      );

      await characterSheet.showSheet();

      await characterSheet.tab(itemTestInfo.tabId);

      const $itemTableRow = characterSheet.$sheet.locator(
        `[data-tab-contents-for="${itemTestInfo.tabId}"] [data-item-id="${item.id}"][data-tidy-table-row]`
      );

      const itemTableRowTextContent = await $itemTableRow.textContent();
      const theItemUnderTestHasTheExpectedName =
        itemTableRowTextContent?.includes(item.name);

      test
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

      test
        .expect(
          isInDefaultSection,
          `item should be in default section with key "${itemTestInfo.type}"`
        )
        .toBe(true);

      const itemSheet = new SheetHelper(page, item);

      await itemSheet.showSheet();

      await itemSheet.tab(CONSTANTS.TAB_ITEM_DESCRIPTION_ID);

      const $sectionInput = itemSheet.$sheet.locator(
        // TODO: Move the flag management code to TidyFlags so it doesn't rely on FoundryAdapter; then restore these references.
        `[data-tidy-field="${TidyFlags.section.prop}"]`
      );
      const $actionSectionInput = itemSheet.$sheet.locator(
        `[data-tidy-field="${TidyFlags.actionSection.prop}"]`
      );

      await $sectionInput.scrollIntoViewIfNeeded();

      await test
        .expect($sectionInput, 'item custom section input must be available')
        .toBeVisible();

      await $sectionInput.fill(itemTestInfo.customSection);
      await $sectionInput.press('Tab');

      await $actionSectionInput.scrollIntoViewIfNeeded();

      await test
        .expect(
          $actionSectionInput,
          'item custom action section input must be available'
        )
        .toBeVisible();

      await $actionSectionInput.fill(itemTestInfo.customActionSection);
      await $actionSectionInput.press('Tab');

      await characterSheet.showSheet();

      const isInCustomSection = await $itemTableRow.evaluate(
        (row, { sectionKey }) => {
          return !!row.closest(`[data-tidy-section-key="${sectionKey}"]`);
        },
        {
          sectionKey: itemTestInfo.customSection,
        }
      );

      test
        .expect(
          isInCustomSection,
          `item should be in custom section with key "${itemTestInfo.customSection}"`
        )
        .toBe(true);

      await characterSheet.showSheet();
      await characterSheet.tab(CONSTANTS.TAB_ACTOR_ACTIONS);

      const $actionItemTableRow = characterSheet.$sheet.locator(
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

      test
        .expect(
          isInCustomActionSection,
          `item should be in custom section with key "${itemTestInfo.customActionSection}"`
        )
        .toBeTruthy();
    });
  }
});
