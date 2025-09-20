import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ColumnSpecificationCalculatedWidthArgs,
  DefaultTableColumns,
} from '../types';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import ActivityTimeColumn from 'src/sheets/quadrone/item/columns/ActivityTimeColumn.svelte';
import ActivityDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ActivityDamageFormulasColumn.svelte';
import DocumentActionsColumn from 'src/sheets/quadrone/item/columns/DocumentActionsColumn.svelte';
import ActivityActionsColumnHeader from 'src/sheets/quadrone/item/columns/ActivityActionsColumnHeader.svelte';

export function getDefaultActivityColumns() {
  return {
    actions: {
      headerClasses: 'header-cell-actions',
      headerContent: {
        type: 'component',
        component: ActivityActionsColumnHeader,
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
    uses: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.Uses'),
      },
      cellContent: {
        type: 'component',
        component: ActivityUsesColumn,
      },
      widthRems: 5,
      cellClasses: 'inline-uses',
    },
    time: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Time'),
      },
      cellContent: {
        type: 'component',
        component: ActivityTimeColumn,
      },
      widthRems: 5,
    },
    formulas: {
      headerContent: {
        type: 'html',
        html: FoundryAdapter.localize('DND5E.SpellHeader.Formula'),
      },
      cellContent: {
        type: 'component',
        component: ActivityDamageFormulasColumn,
      },
      widthRems: 5,
    },
  } satisfies DefaultTableColumns;
}
