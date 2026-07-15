import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { DefaultTableColumns } from '../types';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import ActivityTimeColumn from 'src/sheets/quadrone/item/columns/ActivityTimeColumn.svelte';
import ActivityDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ActivityDamageFormulasColumn.svelte';

export function getDefaultActivityColumns() {
  return {
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
