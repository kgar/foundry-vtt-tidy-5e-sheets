import HtmlColumn from 'src/sheets/quadrone/item/columns/HtmlColumn.svelte';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import BastionCostColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionCostColumn.svelte';
import BastionFacilityNameColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionFacilityNameColumn.svelte';
import BastionMemberColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionMemberColumn.svelte';
import BastionOccupantCountColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionOccupantCountColumn.svelte';
import BastionOrderColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionOrderColumn.svelte';
import BastionProgressColumn from 'src/sheets/quadrone/actor/group-parts/bastions/columns/BastionProgressColumn.svelte';
import { calculateOccupancy } from 'src/features/facility/Bastion';
import type {
  ActivityColumnSpec,
  BastionFacilityColumnSpec,
  BastionOrderColumnSpec,
  EffectColumnSpec,
  EncounterCombatantColumnSpec,
  EncounterMemberColumnSpec,
  GroupMemberColumnSpec,
  ItemAdvancementColumnSpec,
  ItemColumnSpec,
  VehicleCrewColumnSpec,
  VehicleDraftAnimalColumnSpec,
  VehiclePassengerColumnSpec,
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
import EncounterMemberCrColumn from 'src/sheets/quadrone/item/columns/EncounterMemberCrColumn.svelte';
import EncounterMemberQuantityColumn from 'src/sheets/quadrone/item/columns/EncounterMemberQuantityColumn.svelte';
import EncounterMemberInitiativeColumn from 'src/sheets/quadrone/item/columns/EncounterMemberInitiativeColumn.svelte';
import EncounterMemberQtyFormulaColumn from 'src/sheets/quadrone/item/columns/EncounterMemberQtyFormulaColumn.svelte';
import GroupMemberHpColumn from 'src/sheets/quadrone/item/columns/GroupMemberHpColumn.svelte';
import GroupXpColumn from 'src/sheets/quadrone/item/columns/GroupXpColumn.svelte';
import GroupMemberInspirationColumn from 'src/sheets/quadrone/item/columns/GroupMemberInspirationColumn.svelte';
import GroupMemberHdColumn from 'src/sheets/quadrone/item/columns/GroupMemberHdColumn.svelte';
import GroupMemberAcColumn from 'src/sheets/quadrone/item/columns/GroupMemberAcColumn.svelte';
import GroupCharacterXpColumn from 'src/sheets/quadrone/item/columns/GroupXpColumn.svelte';
import VehicleCrewMemberAssignedColumn from 'src/sheets/quadrone/item/columns/VehicleCrewMemberAssignedColumn.svelte';
import VehicleMemberQuantityColumn from 'src/sheets/quadrone/item/columns/VehicleMemberQuantityColumn.svelte';
import VehicleCrewAssignToColumn from 'src/sheets/quadrone/item/columns/VehicleCrewAssignToColumn.svelte';
import GroupVehicleCrewColumn from 'src/sheets/quadrone/item/columns/GroupVehicleCrewColumn.svelte';
import GroupVehicleDtColumn from 'src/sheets/quadrone/item/columns/GroupVehicleDtColumn.svelte';

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

    bastionFacility: {
      order: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.FACILITY.FIELDS.order.label'),
          }),
        },
        cell: {
          component: BastionOrderColumn,
          props: (args) => ({
            orderKey: args.rowContext.progress.order,
            label:
              CONFIG.DND5E.facilities.orders[args.rowContext.progress.order]
                ?.label ?? args.rowContext.progress.order,
          }),
        },
        widthRems: 7,
      } satisfies BastionFacilityColumnSpec<
        typeof HtmlColumn,
        typeof BastionOrderColumn
      >,
      progress: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'DND5E.FACILITY.Progress',
            ),
          }),
        },
        cell: {
          component: BastionProgressColumn,
          props: (args) => ({ 
            progress: args.rowContext.progress 
          }),
        },
        widthRems: 10,
      } satisfies BastionFacilityColumnSpec<
        typeof HtmlColumn,
        typeof BastionProgressColumn
      >,
      hirelings: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'DND5E.FACILITY.FIELDS.hirelings.max.label',
            ),
          }),
        },
        cell: {
          component: BastionOccupantCountColumn,
          props: (args) => ({
            occupancy: calculateOccupancy([args.rowContext], 'hirelings'),
          }),
        },
        widthRems: 5,
      } satisfies BastionFacilityColumnSpec<
        typeof HtmlColumn,
        typeof BastionOccupantCountColumn
      >,
      defenders: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'DND5E.FACILITY.FIELDS.defenders.max.label',
            ),
          }),
        },
        cell: {
          component: BastionOccupantCountColumn,
          props: (args) => ({
            occupancy: calculateOccupancy([args.rowContext], 'defenders'),
          }),
        },
        widthRems: 5,
      } satisfies BastionFacilityColumnSpec<
        typeof HtmlColumn,
        typeof BastionOccupantCountColumn
      >,
    },
    bastionOrder: {
      facility: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'TYPES.Item.facility',
            ),
          }),
        },
        cell: {
          component: BastionFacilityNameColumn,
          props: (args) => ({
            name: args.rowContext.facilityName,
            uuid: args.rowDocument.uuid,
          }),
        },
        widthRems: 8,
      } satisfies BastionOrderColumnSpec<
        typeof HtmlColumn,
        typeof BastionFacilityNameColumn
      >,
      player: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('TYPES.Actor.character'),
          }),
        },
        cell: {
          component: BastionMemberColumn,
          props: (args) => ({ member: args.rowContext.member }),
        },
        widthRems: 10,
      } satisfies BastionOrderColumnSpec<
        typeof HtmlColumn,
        typeof BastionMemberColumn
      >,
      progress: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'TIDY5E.Facilities.Progress.Label',
            ),
          }),
        },
        cell: {
          component: BastionProgressColumn,
          props: (args) => ({ progress: args.rowContext.progress }),
        },
        widthRems: 10,
      } satisfies BastionOrderColumnSpec<
        typeof HtmlColumn,
        typeof BastionProgressColumn
      >,
      cost: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.Cost'),
          }),
        },
        cell: {
          component: BastionCostColumn,
          props: (args) => ({ cost: args.rowContext.cost }),
        },
        widthRems: 6,
      } satisfies BastionOrderColumnSpec<
        typeof HtmlColumn,
        typeof BastionCostColumn
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
    customItem: {},
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
    encounterCombatant: {
      cr: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.AbbreviationCR'),
          }),
        },
        cell: {
          component: EncounterMemberCrColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 2.5,
      } satisfies EncounterCombatantColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberCrColumn
      >,
      quantity: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Quantity') }),
        },
        cell: {
          component: EncounterMemberQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4.75,
      } satisfies EncounterCombatantColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberQuantityColumn
      >,
      initiative: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Initiative') }),
        },
        cell: {
          component: EncounterMemberInitiativeColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4.5,
      } satisfies EncounterCombatantColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberInitiativeColumn
      >,
    },
    encounterMember: {
      cr: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.AbbreviationCR'),
          }),
        },
        cell: {
          component: EncounterMemberCrColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 2.5,
      } satisfies EncounterMemberColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberCrColumn
      >,
      quantity: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Quantity') }),
        },
        cell: {
          component: EncounterMemberQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4.75,
      } satisfies EncounterMemberColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberQuantityColumn
      >,
      qtyFormulaColumn: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Formula') }),
        },
        cell: {
          component: EncounterMemberQtyFormulaColumn,
          props: (args) => ({
            rowContext: args.rowContext,
          }),
        },
        widthRems: 4,
      } satisfies EncounterMemberColumnSpec<
        typeof HtmlColumn,
        typeof EncounterMemberQtyFormulaColumn
      >,
      hp: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.HP') }),
        },
        cell: {
          component: GroupMemberHpColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 2.5,
      } satisfies EncounterMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupMemberHpColumn
      >,
      npcXp: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'DND5E.ExperiencePoints.Abbreviation',
            ),
          }),
        },
        cell: {
          component: GroupXpColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 4,
      } satisfies EncounterMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupXpColumn
      >,
    },
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
    groupMember: {
      crew: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Label'),
          }),
        },
        cell: {
          component: GroupVehicleCrewColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
          classes: 'truncate',
        },
        widthRems: 3.75,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupVehicleCrewColumn
      >,
      dt: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.HITPOINTS.DT.abbr'),
          }),
        },
        cell: {
          component: GroupVehicleDtColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
          classes: 'truncate',
        },
        widthRems: 3,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupVehicleDtColumn
      >,
      inspiration: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.Inspiration') }),
        },
        cell: {
          component: GroupMemberInspirationColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.75,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupMemberInspirationColumn
      >,
      hp: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.HP') }),
        },
        cell: {
          component: GroupMemberHpColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.75,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupMemberHpColumn
      >,
      hd: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.HitDie') }),
        },
        cell: {
          component: GroupMemberHdColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.75,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupMemberHdColumn
      >,
      ac: {
        header: {
          component: HtmlColumn,
          props: () => ({ html: FoundryAdapter.localize('DND5E.AC') }),
        },
        cell: {
          component: GroupMemberAcColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupMemberAcColumn
      >,
      xp: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'DND5E.ExperiencePoints.Abbreviation',
            ),
          }),
        },
        cell: {
          component: GroupCharacterXpColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 3.75,
      } satisfies GroupMemberColumnSpec<
        typeof HtmlColumn,
        typeof GroupCharacterXpColumn
      >,
    },
    inventory: {
      capacityBar: {
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
    },
    vehicleAssignedCrew: {
      cr: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.AbbreviationCR'),
          }),
        },
        cell: {
          component: VehicleMemberCrColumn,
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 3,
      } satisfies VehicleCrewColumnSpec<
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
          props: (args) => ({ rowDocument: args.rowDocument }),
        },
        widthRems: 4,
      } satisfies VehicleCrewColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberHpColumn
      >,
      assigned: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.VEHICLE.Crew.Assigned'),
          }),
        },
        cell: {
          component: VehicleCrewMemberAssignedColumn,
          props: (args) => ({ rowContext: args.rowContext }),
        },
        widthRems: 10,
      } satisfies VehicleCrewColumnSpec<
        typeof HtmlColumn,
        typeof VehicleCrewMemberAssignedColumn
      >,
    },
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
      } satisfies VehicleDraftAnimalColumnSpec<
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
      } satisfies VehicleDraftAnimalColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberHpColumn
      >,
    },
    vehiclePassenger: {
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
      } satisfies VehiclePassengerColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberCrColumn
      >,
      qty: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.QuantityAbbr'),
          }),
        },
        cell: {
          component: VehicleMemberQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies VehiclePassengerColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberQuantityColumn
      >,
    },
    vehicleUnassignedCrew: {
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
        widthRems: 3,
      } satisfies VehicleCrewColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberCrColumn
      >,
      qty: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize('DND5E.QuantityAbbr'),
          }),
        },
        cell: {
          component: VehicleMemberQuantityColumn,
          props: (args) => ({
            rowContext: args.rowContext,
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 5,
      } satisfies VehicleCrewColumnSpec<
        typeof HtmlColumn,
        typeof VehicleMemberQuantityColumn
      >,
      assignTo: {
        header: {
          component: HtmlColumn,
          props: () => ({
            html: FoundryAdapter.localize(
              'TIDY5E.Vehicle.Member.AssignTo.Label',
            ),
          }),
        },
        cell: {
          component: VehicleCrewAssignToColumn,
          props: (args) => ({
            rowDocument: args.rowDocument,
          }),
        },
        widthRems: 10,
      } satisfies VehicleCrewColumnSpec<
        typeof HtmlColumn,
        typeof VehicleCrewAssignToColumn
      >,
    },
  };
}
