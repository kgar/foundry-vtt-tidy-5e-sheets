<script lang="ts">
  import TidyEffectTableRow from 'src/components/table-quadrone/TidyEffectTableRow.svelte';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    AdvancementItemContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import type { Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';

  let localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  let advancements = $derived(Object.entries(context.advancement));

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    AdvancementItemContext,
    {}
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({
          doc: context.item.advancement?.byId[args.data.id],
        }),
      } satisfies TableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: context.item.advancement?.byId[args.data.id],
          deleteFn: () =>
            context.item.advancement?.byId[args.data.id]?.deleteDialog(),
        }),
      } satisfies TableAction<typeof DeleteButton>);
    }

    return result;
  });

  let columnSpecs = $derived({
    value: {
      columnWidth: '3.125rem',
    },
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + tableActions.length}) + var(--t5e-size-halfx))`,
    },
  });
</script>

<ol>
  <li>Make tidy tables for advancements</li>
  <li>Add the actor-owned view - tie to locked/unlocked</li>
  <li>Add partial config UI</li>
  <li>Add false config UI</li>
  <li>Ensure all interactibles are included</li>
</ol>

{#each advancements as [key, entries]}
  <TidyTable {key}>
    {#snippet header()}
      <TidyTableHeaderRow class="theme-dark">
        <TidyTableHeaderCell primary={true} class="header-label-cell">
          <h3>
            {#if key === '0'}
              {localize('DND5E.AdvancementLevelAnyHeader')}
            {:else if key === 'unconfigured'}
              {localize('DND5E.AdvancementLevelNoneHeader')}
            {:else}
              {localize('DND5E.AdvancementLevelHeader', { key })}
            {/if}
          </h3>
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    {/snippet}
  </TidyTable>
{/each}
