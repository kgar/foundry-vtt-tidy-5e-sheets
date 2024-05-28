import { sectionsTest } from './sections-test-fixture';
import { SheetHelper } from 'tests/helpers/SheetHelper';
import { CONSTANTS } from 'src/constants';

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
      });
      await sheetHelper.addFavoriteItem(testItem1.uuid);
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
      });
      await sheetHelper.addFavoriteItem(testItem2.uuid);
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });
      await sheetHelper.addFavoriteItem(testItem3.uuid);

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
        type: CONSTANTS.ITEM_TYPE_WEAPON
      });
      await sheetHelper.addFavoriteItem(testItem1.uuid);
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
      });
      await sheetHelper.addFavoriteItem(testItem2.uuid);
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_FEAT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });
      await sheetHelper.addFavoriteItem(testItem3.uuid);
      const testItem4 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 4',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });
      await sheetHelper.addFavoriteItem(testItem4.uuid);
      const testItem5 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 5',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.section.key]: customItemSection,
          },
        },
      });
      await sheetHelper.addFavoriteItem(testItem5.uuid);

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

  sectionsTest(
    'actions - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific action items - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );
      // action
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_ACTION,
          },
          equipped: true,
        },
      });
      // bonus
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_BONUS,
          },
          preparation: {
            mode: CONSTANTS.SPELL_PREPARATION_MODE_PREPARED,
          },
        },
      });
      // custom
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.actionSection.key]: customItemSection,
            [TidyFlags.actionFilterOverride.key]: true,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ACTIVATION_COST_ACTION,
        section2: CONSTANTS.ACTIVATION_COST_BONUS,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );
});

sectionsTest.describe('NPC', () => {
  sectionsTest(
    'abilities - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific abilities - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestNpc
      );
      // passive
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Feat 1',
        type: CONSTANTS.ITEM_TYPE_FEAT,
      });
      // actions
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
        section1: CONSTANTS.NPC_ABILITY_SECTION_PASSIVE,
        section2: CONSTANTS.NPC_ABILITY_SECTION_ACTIONS,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_NPC_ABILITIES,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  sectionsTest(
    'spellbook - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific spells - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestNpc
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
        tabId: CONSTANTS.TAB_NPC_SPELLBOOK,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );

  sectionsTest(
    'actions - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific action items - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestNpc
      );
      // action
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_ACTION,
          },
          equipped: true,
        },
      });
      // bonus
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_BONUS,
          },
          preparation: {
            mode: CONSTANTS.SPELL_PREPARATION_MODE_PREPARED,
          },
        },
      });
      // custom
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.actionSection.key]: customItemSection,
            [TidyFlags.actionFilterOverride.key]: true,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ACTIVATION_COST_ACTION,
        section2: CONSTANTS.ACTIVATION_COST_BONUS,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );
});

sectionsTest.describe('vehicle', () => {
  sectionsTest(
    'actions - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific action items - have at least one custom section
      const sheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestVehicle
      );
      // action
      const testItem1 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_ACTION,
          },
          equipped: true,
        },
      });
      // bonus
      const testItem2 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_SPELL,
        system: {
          activation: {
            type: CONSTANTS.ACTIVATION_COST_BONUS,
          },
          preparation: {
            mode: CONSTANTS.SPELL_PREPARATION_MODE_PREPARED,
          },
        },
      });
      // custom
      const testItem3 = await sheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_LOOT,
        flags: {
          [CONSTANTS.MODULE_ID]: {
            [TidyFlags.actionSection.key]: customItemSection,
            [TidyFlags.actionFilterOverride.key]: true,
          },
        },
      });

      await runStandardSectionConfigTests({
        section1: CONSTANTS.ACTIVATION_COST_ACTION,
        section2: CONSTANTS.ACTIVATION_COST_BONUS,
        section3: customItemSection,
        sheetHelper: sheetHelper,
        tabId: CONSTANTS.TAB_ACTOR_ACTIONS,
      });

      await sheetHelper.deleteEmbeddedItem(testItem1);
      await sheetHelper.deleteEmbeddedItem(testItem2);
      await sheetHelper.deleteEmbeddedItem(testItem3);
    }
  );
});

sectionsTest.describe('container', () => {
  sectionsTest(
    'contents - core functionality',
    async ({ sectionPage, data }) => {
      // Add specific items - have at least one custom section
      const characterSheetHelper = new SheetHelper(
        sectionPage,
        data.sectionConfigTestCharacter
      );

      const testContainer = await characterSheetHelper.createEmbeddedItem({
        name: 'Test Container',
        type: CONSTANTS.ITEM_TYPE_CONTAINER,
      });
      const testItem1 = await characterSheetHelper.createEmbeddedItem({
        name: 'Test Item 1',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        system: {
          container: testContainer.id,
        },
      });
      const testItem2 = await characterSheetHelper.createEmbeddedItem({
        name: 'Test Item 2',
        type: CONSTANTS.ITEM_TYPE_EQUIPMENT,
        system: {
          container: testContainer.id,
        },
      });
      const testItem3 = await characterSheetHelper.createEmbeddedItem({
        name: 'Test Item 3',
        type: CONSTANTS.ITEM_TYPE_WEAPON,
        system: {
          container: testContainer.id,
        },
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
        sheetHelper: new SheetHelper(sectionPage, testContainer),
        tabId: CONSTANTS.TAB_CONTAINER_CONTENTS,
      });

      await characterSheetHelper.deleteEmbeddedItem(testItem1);
      await characterSheetHelper.deleteEmbeddedItem(testItem2);
      await characterSheetHelper.deleteEmbeddedItem(testItem3);
      await characterSheetHelper.deleteEmbeddedItem(testContainer);
    }
  );
});

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
      const currentPositions = (await config.getOptionsInCurrentOrder()).reduce<
        Record<string, { key: string; currentIndex: number }>
      >((prev, curr, i) => {
        prev[curr] = { key: curr, currentIndex: i };
        return prev;
      }, {});

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
