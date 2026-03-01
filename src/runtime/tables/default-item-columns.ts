import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import SectionActionsColumnHeader from 'src/sheets/quadrone/item/columns/SectionActionsColumnHeader.svelte';
import type {
  ColumnSpecificationCalculatedWidthArgs,
  DefaultTableColumns,
} from '../types';
import InlineCapacityBarColumn from 'src/sheets/quadrone/item/columns/InlineCapacityBarColumn.svelte';
import InlineCapacityTrackerColumn from 'src/sheets/quadrone/item/columns/InlineCapacityTrackerColumn.svelte';
import ItemWeightColumn from 'src/sheets/quadrone/item/columns/ItemWeightColumn.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import ItemQuantityColumn from 'src/sheets/quadrone/item/columns/ItemQuantityColumn.svelte';
import ItemPriceColumn from 'src/sheets/quadrone/item/columns/ItemPriceColumn.svelte';
import ItemTimeColumn from 'src/sheets/quadrone/item/columns/ItemTimeColumn.svelte';
import ItemUsesColumn from 'src/sheets/quadrone/item/columns/ItemUsesColumn.svelte';
import ItemRollColumn from 'src/sheets/quadrone/item/columns/ItemRollColumn.svelte';
import ItemRangeColumn from 'src/sheets/quadrone/item/columns/ItemRangeColumn.svelte';
import ItemTargetColumn from 'src/sheets/quadrone/item/columns/ItemTargetColumn.svelte';
import ItemSpellSchoolColumn from 'src/sheets/quadrone/item/columns/ItemSpellSchoolColumn.svelte';
import ItemSpellComponentsColumn from 'src/sheets/quadrone/item/columns/ItemSpellComponentsColumn.svelte';
import ItemDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ItemDamageFormulasColumn.svelte';
import ItemRecoveryColumn from 'src/sheets/quadrone/item/columns/ItemRecoveryColumn.svelte';
import ItemFeatureSourceColumn from 'src/sheets/quadrone/item/columns/ItemFeatureSourceColumn.svelte';

export function getDefaultItemColumns() {
  return {
    actions: {
      headerClasses: 'header-cell-actions',
      headerContent: {
        type: 'component',
        component: SectionActionsColumnHeader,
      },
      cellClasses: 'tidy-table-actions',
      cellContent: {
        type: 'component',
        component: DocumentActionsColumn,
      },
      widthRems: (section: ColumnSpecificationCalculatedWidthArgs) => {
        let paddingX = 0.1875;
        let buttonWidth = 1.5;
        return buttonWidth * section.rowActions.length + paddingX;
      },
    },
    capacityTracker: {
      cellContent: {
        type: 'component',
        component: InlineCapacityTrackerColumn,
      },
      widthRems: 7,
      cellClasses: 'text-cell',
    },
    capacityBar: {
      cellContent: {
        type: 'component',
        component: InlineCapacityBarColumn,
      },
      widthRems: 7,
      cellClasses: 'text-cell',
    },
    components: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Components'),
      },
      cellContent: {
        type: 'component',
        component: ItemSpellComponentsColumn,
      },
      widthRems: 5.625,
    },
    featureSource: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SOURCE.FIELDS.source.label'),
      },
      cellContent: {
        type: 'component',
        component: ItemFeatureSourceColumn,
      },
      widthRems: 6.25,
    },
    formula: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
      },
      cellContent: {
        type: 'component',
        component: ItemDamageFormulasColumn,
      },
      widthRems: 5,
    },
    price: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Price'),
      },
      cellContent: {
        type: 'component',
        component: ItemPriceColumn,
      },
      widthRems: 5.5,
    },
    quantity: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Quantity'),
      },
      cellContent: {
        type: 'component',
        component: ItemQuantityColumn,
      },
      widthRems: 5,
    },
    range: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Range'),
      },
      cellContent: {
        type: 'component',
        component: ItemRangeColumn,
      },
      widthRems: 5,
    },
    recovery: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Recovery'),
      },
      cellContent: {
        type: 'component',
        component: ItemRecoveryColumn,
      },
      widthRems: 6.25,
    },
    roll: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Roll'),
      },
      cellContent: {
        type: 'component',
        component: ItemRollColumn,
      },
      widthRems: 3.125,
    },
    school: {
      headerContent: {
        type: 'html',
        html: `<i class="fa-solid fa-cauldron" data-tooltip="DND5E.SpellSchool"></i>`,
      },
      cellContent: {
        type: 'component',
        component: ItemSpellSchoolColumn,
      },
      widthRems: 2.5,
    },
    target: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Target'),
      },
      cellContent: {
        type: 'component',
        component: ItemTargetColumn,
      },
      widthRems: 5,
    },
    time: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
      },
      cellContent: {
        type: 'component',
        component: ItemTimeColumn,
      },
      widthRems: 4,
    },
    uses: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Uses'),
      },
      cellContent: {
        type: 'component',
        component: ItemUsesColumn,
      },
      widthRems: 4,
      cellClasses: 'inline-uses',
    },
    weight: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Weight'),
      },
      cellContent: {
        type: 'component',
        component: ItemWeightColumn,
      },
      widthRems: 5,
    },
  } satisfies DefaultTableColumns;
}
