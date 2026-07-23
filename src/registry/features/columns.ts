import type { Activity5e } from 'src/foundry/dnd5e.types';
import HtmlColumn from 'src/sheets/quadrone/item/columns/HtmlColumn.svelte';
import ActivityUsesColumn from 'src/sheets/quadrone/item/columns/ActivityUsesColumn.svelte';
import type { ColumnSpecificationV2 } from 'src/types/columns.types';
import type {
  Advancement5e,
  AdvancementItemContext,
  Item5e,
} from 'src/types/item.types';
import type { TidyColumnRegistry } from 'src/types/registry.types';
import type { ActivityItemContext, Actor5e } from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import ActivityTimeColumn from 'src/sheets/quadrone/item/columns/ActivityTimeColumn.svelte';
import ActivityDamageFormulasColumn from 'src/sheets/quadrone/item/columns/ActivityDamageFormulasColumn.svelte';
import type { Component } from 'svelte';
import AdvancementValueColumn from 'src/sheets/quadrone/item/columns/AdvancementValueColumn.svelte';

type ActivityDomainColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Actor5e | Item5e,
  any,
  Activity5e,
  ActivityItemContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

type AdvancementDomainColumnSpec<
  TColumnHeaderContent extends Component<any> = Component<any>,
  TColumnCellContent extends Component<any> = Component<any>,
> = ColumnSpecificationV2<
  Item5e,
  any,
  Advancement5e,
  AdvancementItemContext,
  TColumnHeaderContent,
  TColumnCellContent
>;

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
      } satisfies ActivityDomainColumnSpec<
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
      } satisfies ActivityDomainColumnSpec<
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
      } satisfies ActivityDomainColumnSpec<
        typeof HtmlColumn,
        typeof ActivityDamageFormulasColumn
      >,
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
      } satisfies AdvancementDomainColumnSpec<
        typeof HtmlColumn,
        typeof AdvancementValueColumn
      >,
    },
  };
}
