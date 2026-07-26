import HtmlColumn from 'src/sheets/quadrone/item/columns/HtmlColumn.svelte';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import type {
  ActivityColumnSpec,
  EffectColumnSpec,
  ItemAdvancementColumnSpec,
  ItemColumnSpec,
} from 'src/types/columns.types';
import type { TidyColumnRegistry } from 'src/types/registry.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import ActivityTimeColumn from 'src/sheets/quadrone/item/columns/ActivityTimeColumn.svelte';
import ActivityDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ActivityDamageFormulasColumn.svelte';
import AdvancementValueColumn from 'src/sheets/quadrone/item/columns/AdvancementValueColumn.svelte';
import InlineCapacityBarColumn from 'src/sheets/quadrone/item/columns/InlineCapacityBarColumn.svelte';
import InlineCapacityTrackerColumn from 'src/sheets/quadrone/item/columns/InlineCapacityTrackerColumn.svelte';
import ItemUsesColumn from 'src/sheets/quadrone/item/columns/ItemUsesColumn.svelte';
import ItemDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ItemDamageFormulasColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import ItemRollColumn from 'src/sheets/quadrone/item/columns/ItemRollColumn.svelte';
import ItemTimeColumn from 'src/sheets/quadrone/item/columns/ItemTimeColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import VehicleItemHpColumn from 'src/sheets/quadrone/item/columns/VehicleItemHpColumn.svelte';
import VehicleItemUsesColumn from 'src/sheets/quadrone/item/columns/VehicleItemUsesColumn.svelte';
import VehicleItemCrewColumn from 'src/sheets/quadrone/item/columns/VehicleItemCrewColumn.svelte';
import EffectSourceColumn from 'src/sheets/quadrone/item/columns/EffectSourceColumn.svelte';
import EffectDurationColumn from 'src/sheets/quadrone/item/columns/EffectDurationColumn.svelte';
import ItemRangeColumn from 'src/sheets/quadrone/item/columns/ItemRangeColumn.svelte';
import ItemTargetColumn from 'src/sheets/quadrone/item/columns/ItemTargetColumn.svelte';
import ItemRecoveryColumn from 'src/sheets/quadrone/item/columns/ItemRecoveryColumn.svelte';
import ItemFeatureSourceColumn from 'src/sheets/quadrone/item/columns/ItemFeatureSourceColumn.svelte';
import ItemSpellComponentsColumn from 'src/sheets/quadrone/item/columns/ItemSpellComponentsColumn.svelte';
import ItemSpellSchoolColumn from 'src/sheets/quadrone/item/columns/ItemSpellSchoolColumn.svelte';
import VehicleMemberCrColumn from 'src/sheets/quadrone/item/columns/VehicleMemberCrColumn.svelte';
import VehicleMemberHpColumn from 'src/sheets/quadrone/item/columns/VehicleMemberHpColumn.svelte';

export function getColumnsRegistry(): TidyColumnRegistry {
  return {
    activity: {
      uses: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.Uses'),
          }),
        },
        cell: {
          component: ActivityUsesColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            rowContext: args.rowContext,
          }),
          classes: 'inline-uses',
        },
        widthRems: 5,
      } satisfies ActivityColumnSpec<
        typeof HtmlColumn,
        typeof ActivityUsesColumn
      >,
      time: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ActivityTimeColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            rowContext: args.rowContext,
          }),
        },
        widthRems: 5,
      } satisfies ActivityColumnSpec<
        typeof HtmlColumn,
        typeof ActivityTimeColumn
      >,
      formulas: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
          }),
        },
        cell: {
          component: ActivityDamageFormulasColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            rowContext: args.rowContext,
          }),
        },
        widthRems: 5,
      } satisfies ActivityColumnSpec<
        typeof HtmlColumn,
        typeof ActivityDamageFormulasColumn
      >,
    },
    containerContents: {
      capacityBar: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: '' }),
        },
        cell: {
          component: InlineCapacityBarColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            containerContents: args.rowContext?.containerContents,
          }),
          classes: 'text-cell',
        },
        widthRems: 7,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof InlineCapacityBarColumn
      >,
      capacityTracker: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: '' }),
        },
        cell: {
          component: InlineCapacityTrackerColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
          classes: 'text-cell',
        },
        widthRems: 7,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof InlineCapacityTrackerColumn
      >,
      price: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Price') }),
        },
        cell: {
          component: ItemPriceColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5.5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemPriceColumn>,
      quantity: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.Quantity'),
          }),
        },
        cell: {
          component: ItemQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemQuantityColumn>,
      time: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ItemTimeColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>,
      uses: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      weight: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Weight') }),
        },
        cell: {
          component: ItemWeightColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemWeightColumn>,
    },
    effect: {
      source: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SOURCE.FIELDS.source.label'),
          }),
        },
        cell: {
          component: EffectSourceColumn,
          props: (args) => ({
            rowContext: args.rowContext,
          }),
        },
        widthRems: 8,
      } satisfies EffectColumnSpec<
        typeof HtmlColumn,
        typeof EffectSourceColumn
      >,
      duration: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.Duration'),
          }),
        },
        cell: {
          component: EffectDurationColumn,
          props: (args) => ({
            rowContext: args.rowContext,
          }),
        },
        widthRems: 6,
      } satisfies EffectColumnSpec<
        typeof HtmlColumn,
        typeof EffectDurationColumn
      >,
    },
    encounterCombatant: {},
    encounterMember: {},
    feature: {
      charges: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      roll: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
          }),
        },
        cell: {
          component: ItemRollColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.125,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRollColumn>,
      formula: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
          }),
        },
        cell: {
          component: ItemDamageFormulasColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemDamageFormulasColumn
      >,
      range: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Range'),
          }),
        },
        cell: {
          component: ItemRangeColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRangeColumn>,
      target: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Target'),
          }),
        },
        cell: {
          component: ItemTargetColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTargetColumn>,
      time: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ItemTimeColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>,
      uses: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      recovery: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Recovery') }),
        },
        cell: {
          component: ItemRecoveryColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 6.25,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRecoveryColumn>,
      featureSource: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SOURCE.FIELDS.source.label'),
          }),
        },
        cell: {
          component: ItemFeatureSourceColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 6.25,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemFeatureSourceColumn
      >,
    },
    groupMember: {},
    inventory: {
      capacityBar: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: '' }),
        },
        cell: {
          component: InlineCapacityBarColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            containerContents: args.rowContext?.containerContents,
          }),
          classes: 'text-cell',
        },
        widthRems: 7,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof InlineCapacityBarColumn
      >,
      capacityTracker: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: '' }),
        },
        cell: {
          component: InlineCapacityTrackerColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
          classes: 'text-cell',
        },
        widthRems: 7,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof InlineCapacityTrackerColumn
      >,
      charges: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      formula: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
          }),
        },
        cell: {
          component: ItemDamageFormulasColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemDamageFormulasColumn
      >,
      price: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Price') }),
        },
        cell: {
          component: ItemPriceColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5.5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemPriceColumn>,
      quantity: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.Quantity'),
          }),
        },
        cell: {
          component: ItemQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemQuantityColumn>,
      roll: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
          }),
        },
        cell: {
          component: ItemRollColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.125,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRollColumn>,
      time: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ItemTimeColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>,
      uses: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      vehicleItemHp: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.HP') }),
        },
        cell: {
          component: VehicleItemHpColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof VehicleItemHpColumn>,
      vehicleItemUses: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: VehicleItemUsesColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof VehicleItemUsesColumn
      >,
      vehicleItemCrew: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
          }),
        },
        cell: {
          component: VehicleItemCrewColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
            rowContext: args.rowContext,
          }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof VehicleItemCrewColumn
      >,
      weight: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Weight') }),
        },
        cell: {
          component: ItemWeightColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemWeightColumn>,
    },
    itemAdvancement: {
      value: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Value') }),
        },
        cell: {
          component: AdvancementValueColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies ItemAdvancementColumnSpec<
        typeof HtmlColumn,
        typeof AdvancementValueColumn
      >,
    },
    spell: {
      uses: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      components: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Components') }),
        },
        cell: {
          component: ItemSpellComponentsColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5.625,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemSpellComponentsColumn
      >,
      school: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: `<i class="fa-solid fa-cauldron" data-tooltip="DND5E.SpellSchool"></i>`,
          }),
        },
        cell: {
          component: ItemSpellSchoolColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 2.5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemSpellSchoolColumn
      >,
      time: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ItemTimeColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>,
      target: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Target'),
          }),
        },
        cell: {
          component: ItemTargetColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTargetColumn>,
      range: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Range'),
          }),
        },
        cell: {
          component: ItemRangeColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRangeColumn>,
      roll: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
          }),
        },
        cell: {
          component: ItemRollColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.125,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRollColumn>,
    },
    vehicleAssignedCrew: {},
    vehicleDraftAnimal: {
      cr: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.AbbreviationCR'),
          }),
        },
        cell: {
          component: VehicleMemberCrColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberCrColumn
      >,
      hp: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('TIDY5E.Vehicle.Equipment.HP.Label'),
          }),
        },
        cell: {
          component: VehicleMemberHpColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberHpColumn
      >,
    },
    vehiclePassenger: {},
    vehicleUnassignedCrew: {},
  };
}
