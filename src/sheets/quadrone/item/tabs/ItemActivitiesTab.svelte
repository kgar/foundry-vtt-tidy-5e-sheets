<script lang="ts">
  import type { TidyTableAction } from 'src/components/table-quadrone/table-buttons/table.types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActivityQuadroneContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';
  import type { Component } from 'svelte';
  import EditButton from 'src/components/table-quadrone/table-buttons/EditButton.svelte';
  import DeleteButton from 'src/components/table-quadrone/table-buttons/DeleteButton.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyActivityTableRow from 'src/components/table-quadrone/TidyActivityTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  let context = $derived(getSheetContext<ItemSheetQuadroneContext>());

  const localize = FoundryAdapter.localize;

  type TableAction<TComponent extends Component<any>> = TidyTableAction<
    TComponent,
    ActivityQuadroneContext,
    any
  >;

  let tableActions: TableAction<any>[] = $derived.by(() => {
    let result: TableAction<any>[] = [];

    if (context.unlocked) {
      result.push({
        component: EditButton,
        props: (args) => ({ doc: args.data.doc }),
      } satisfies TableAction<typeof EditButton>);

      result.push({
        component: DeleteButton,
        props: (args) => ({
          doc: args.data.doc,
          deleteFn: () => args.data.doc.deleteDialog(),
        }),
      } satisfies TableAction<typeof DeleteButton>);
    }

    return result;
  });

  let columnSpecs = $derived({
    actions: {
      columnWidth: `calc((var(--t5e-table-button-width) * ${1 + tableActions.length}) + var(--t5e-size-halfx))`,
    },
  });
</script>

<TidyTable key={CONSTANTS.TAB_ITEM_ACTIVITIES_ID}>
  {#snippet header()}
    <TidyTableHeaderRow class="theme-dark">
      <TidyTableHeaderCell primary={true} class="header-label-cell">
        <h3>{localize('DND5E.ACTIVITY.Title.other')}</h3>
        <span class="table-header-count">{context.activities.length}</span>
      </TidyTableHeaderCell>
      <TidyTableHeaderCell {...columnSpecs.actions} class="header-cell-actions">
        <a
          class="tidy-table-button"
          title={localize('DND5E.ACTIVITY.Action.Create')}
          onclick={() => context.item.sheet.addActivity()}
        >
          <i class="fas fa-plus"></i>
        </a>
      </TidyTableHeaderCell>
    </TidyTableHeaderRow>
  {/snippet}
  {#snippet body()}
    {#each context.activities as activity (activity.id)}
      <TidyActivityTableRow {activity}>
        {#snippet children()}
          <a
            class={['tidy-table-button', 'tidy-table-row-use-button']}
            onclick={(ev) => activity.doc.use({ ev })}
          >
            <img class="item-image" alt="" src={activity.img.src} />
            <span class="roll-prompt">
              <i class="fa fa-dice-d20"></i>
            </span>
          </a>
          <TidyTableCell primary={true}>
            <span class="item-name">
              <span class="cell-text">
                <span class="cell-name">{activity.name}</span>
              </span>
              <!-- TODO: Uncomment when we have activity descriptions -->
              <!-- <span class="row-detail-expand-indicator">
                <i
                  class="fa-solid fa-angle-right expand-indicator"
                  class:expanded
                >
                </i>
              </span> -->
            </span>
          </TidyTableCell>
          <TidyTableCell {...columnSpecs.actions} class="tidy-table-actions">
            {#each tableActions as action}
              {@const args = { data: activity, section: undefined }}

              {#if action.condition?.(args) ?? true}
                {@const props = action.props(args)}
                <action.component {...props} />
              {/if}
            {/each}
            <MenuButton targetSelector="[data-context-menu]" />
          </TidyTableCell>
        {/snippet}
      </TidyActivityTableRow>
    {/each}
  {/snippet}
</TidyTable>
