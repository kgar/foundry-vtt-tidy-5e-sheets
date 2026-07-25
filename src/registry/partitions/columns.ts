import { CONSTANTS } from 'src/constants';
import type { TidyPartitionRegistry } from 'src/types/registry.types';

export function getColumnPartitions(): TidyPartitionRegistry['columns'] {
  return {
    activity: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { order: 100, priority: 500 },
            time: { order: 200, priority: 400 },
            formulas: { order: 300, priority: 300 },
          },
        },
      },
    },
    containerContents: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.ITEM_TYPE_CONSUMABLE]: {
            uses: { order: 100, priority: 300 },
            time: { order: 200, priority: 500 },
            price: { order: 300, priority: 200 },
            quantity: { order: 400, priority: 400 },
            weight: { order: 500, priority: 100 },
          },
          [CONSTANTS.ITEM_TYPE_CONTAINER]: {
            capacityTracker: { order: 100, priority: 200 },
            capacityBar: { order: 200, priority: 100 },
          },
          [CONSTANTS.ITEM_TYPE_LOOT]: {
            price: { order: 100, priority: 200 },
            quantity: { order: 200, priority: 300 },
            weight: { order: 300, priority: 100 },
          },
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { order: 100, priority: 400 },
            time: { order: 200, priority: 500 },
            price: { order: 300, priority: 100 },
            quantity: { order: 400, priority: 300 },
            weight: { order: 500, priority: 200 },
          },
        },
      },
    },
    effect: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            source: { order: 100, priority: 100 },
            duration: { order: 200, priority: 200 },
          },
        },
      },
    },
    encounterCombatant: {},
    encounterMember: {},
    feature: {
      [CONSTANTS.SHEET_TYPE_CHARACTER]: {
        [CONSTANTS.TAB_ACTOR_ACTIONS]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            charges: { order: 100, priority: 500 },
            roll: { order: 200, priority: 400 },
            formula: { order: 300, priority: 600 },
            range: { order: 400, priority: 300 },
            target: { order: 500, priority: 200 },
            time: { order: 600, priority: 250 },
          },
        },
        [CONSTANTS.TAB_CHARACTER_FEATURES]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { order: 100, priority: 500 },
            time: { order: 200, priority: 400 },
            recovery: { order: 400, priority: 200 },
            featureSource: { order: 500, priority: 100 },
          },
        },
      },
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          // inventory, spell, and feature
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { order: 100, priority: 400 },
            uses: { order: 200, priority: 600 },
            roll: { order: 300, priority: 800 },
            formula: { order: 400, priority: 700 },
            range: { order: 500, priority: 300 },
            target: { order: 600, priority: 800 },
            time: { order: 700, priority: 800 },
          },
        },
      },
      [CONSTANTS.SHEET_TYPE_VEHICLE]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { order: 100, priority: 400 },
            uses: { order: 200, priority: 600 },
            roll: { order: 300, priority: 800 },
            formula: { order: 400, priority: 700 },
            range: { order: 500, priority: 300 },
            target: { order: 600, priority: 800 },
            time: { order: 700, priority: 800 },
          },
        },
      },
    },
    groupMember: {},
    inventory: {
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          // TODO: copy over to spell and feature for NPC Statblock Default
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { order: 100, priority: 400 },
            uses: { order: 200, priority: 600 },
            roll: { order: 300, priority: 800 },
            formula: { order: 400, priority: 700 },
            range: { order: 500, priority: 300 },
            target: { order: 600, priority: 800 },
            time: { order: 700, priority: 800 },
          },
        },
      },
      [CONSTANTS.SHEET_TYPE_VEHICLE]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          [CONSTANTS.ITEM_TYPE_WEAPON]: {
            vehicleItemHp: { order: 10, priority: 100 },
            vehicleItemUses: { order: 20, priority: 100 },
            vehicleItemCrew: { order: 30, priority: 80 },
          },
          [CONSTANTS.ITEM_TYPE_EQUIPMENT]: {
            vehicleItemHp: { order: 10, priority: 100 },
            vehicleItemUses: { order: 20, priority: 100 },
            vehicleItemCrew: { order: 30, priority: 80 },
          },
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { order: 100, priority: 400 },
            uses: { order: 200, priority: 600 },
            roll: { order: 300, priority: 800 },
            formula: { order: 400, priority: 700 },
            range: { order: 500, priority: 300 },
            target: { order: 600, priority: 800 },
            time: { order: 700, priority: 800 },
          },
        },
      },
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.ITEM_TYPE_CONSUMABLE]: {
            uses: { order: 100, priority: 300 },
            time: { order: 200, priority: 500 },
            price: { order: 300, priority: 200 },
            quantity: { order: 400, priority: 400 },
            weight: { order: 500, priority: 100 },
          },
          [CONSTANTS.ITEM_TYPE_CONTAINER]: {
            capacityTracker: { order: 100, priority: 200 },
            capacityBar: { order: 200, priority: 100 },
          },
          [CONSTANTS.ITEM_TYPE_LOOT]: {
            price: { order: 100, priority: 200 },
            quantity: { order: 200, priority: 300 },
            weight: { order: 300, priority: 100 },
          },
          [CONSTANTS.ITEM_TYPE_WEAPON]: {
            charges: { order: 100, priority: 400 },
            time: { order: 200, priority: 500 },
            roll: { order: 300, priority: 700 },
            formula: { order: 400, priority: 600 },
            price: { order: 500, priority: 100 },
            quantity: { order: 600, priority: 300 },
            weight: { order: 700, priority: 200 },
          },
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { order: 100, priority: 400 },
            time: { order: 200, priority: 500 },
            price: { order: 300, priority: 100 },
            quantity: { order: 400, priority: 300 },
            weight: { order: 500, priority: 200 },
          },
        },
      },
    },
    itemAdvancement: {
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            value: { order: 600, priority: 250 },
          },
        },
      },
    },
    spell: {
      [CONSTANTS.SHEET_TYPE_NPC]: {
        [CONSTANTS.TAB_STATBLOCK]: {
          // inventory, spell, and feature
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            recovery: { order: 100, priority: 400 },
            uses: { order: 200, priority: 600 },
            roll: { order: 300, priority: 800 },
            formula: { order: 400, priority: 700 },
            range: { order: 500, priority: 300 },
            target: { order: 600, priority: 800 },
            time: { order: 700, priority: 800 },
          },
        },
      },
      [CONSTANTS.COLUMN_SPEC_TYPE_KEY_DEFAULT]: {
        [CONSTANTS.COLUMN_SPEC_TAB_KEY_DEFAULT]: {
          [CONSTANTS.COLUMN_SPEC_SECTION_KEY_DEFAULT]: {
            uses: { order: 100, priority: 200 },
            components: { order: 100, priority: 400 },
            school: { order: 200, priority: 100 },
            time: { order: 300, priority: 500 },
            target: { order: 400, priority: 300 },
            range: { order: 500, priority: 600 },
            roll: { order: 600, priority: 700 },
          },
        },
      },
    },
    vehicleAssignedCrew: {},
    vehicleDraftAnimal: {},
    vehiclePassenger: {},
    vehicleUnassignedCrew: {},
  };
}
