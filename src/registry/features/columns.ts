import HtmlColumn from 'src/sheets/quadrone/item/columns/HtmlColumn.svelte';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import type {
  ActivityColumnSpec,
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
    containerContents: {},
    effect: {},
    encounterCombatant: {},
    encounterMember: {},
    feature: {},
    groupMember: {},
    inventory: {
      capacityBar: {
        header: {
          component: HtmlColumn,
          props: (args) => ({ html: '' }),
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
          props: (args) => ({ html: '' }),
        },
        cell: {
          component: InlineCapacityTrackerColumn,
          props: (args) => ({}),
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
          props: (args) => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({}),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      formula: {
        header: {
          component: HtmlColumn,
          props: (args) => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
          }),
        },
        cell: {
          component: ItemDamageFormulasColumn,
          props: (args) => ({}),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<
        typeof HtmlColumn,
        typeof ItemDamageFormulasColumn
      >,
      price: {
        header: {
          component: HtmlColumn,
          props: (args) => ({ html: FoundryAdapter.localize('DND5E.Price') }),
        },
        cell: {
          component: ItemPriceColumn,
          props: (args) => ({}),
        },
        widthRems: 5.5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemPriceColumn>,
      quantity: {
        header: {
          component: HtmlColumn,
          props: (args) => ({
            html: FoundryAdapter.localize('DND5E.Quantity'),
          }),
        },
        cell: {
          component: ItemQuantityColumn,
          props: (args) => ({}),
        },
        widthRems: 5,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemQuantityColumn>,
      roll: {
        header: {
          component: HtmlColumn,
          props: (args) => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
          }),
        },
        cell: {
          component: ItemRollColumn,
          props: (args) => ({}),
        },
        widthRems: 3.125,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemRollColumn>,
      time: {
        header: {
          component: HtmlColumn,
          props: (args) => ({
            html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
          }),
        },
        cell: {
          component: ItemTimeColumn,
          props: (args) => ({}),
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemTimeColumn>,
      uses: {
        header: {
          component: HtmlColumn,
          props: (args) => ({ html: FoundryAdapter.localize('DND5E.Uses') }),
        },
        cell: {
          component: ItemUsesColumn,
          props: (args) => ({}),
          classes: 'inline-uses',
        },
        widthRems: 4,
      } satisfies ItemColumnSpec<typeof HtmlColumn, typeof ItemUsesColumn>,
      weight: {
        header: {
          component: HtmlColumn,
          props: (args) => ({ html: FoundryAdapter.localize('DND5E.Weight') }),
        },
        cell: {
          component: ItemWeightColumn,
          props: (args) => ({}),
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
    spell: {},
    vehicleAssignedCrew: {},
    vehicleDraftAnimal: {},
    vehiclePassenger: {},
    vehicleUnassignedCrew: {},
  };
}
