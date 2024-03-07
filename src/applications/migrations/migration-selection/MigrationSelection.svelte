<script lang="ts">
  import type { SelectableMigrationSelectionParams } from './migration-selection.types';
  import TidyTableV2 from 'src/components/item-list/v2/TidyTableV2.svelte';
  import TidyTableCellV2 from 'src/components/item-list/v2/TidyTableCellV2.svelte';
  import TidyTableHeaderCellV2 from 'src/components/item-list/v2/TidyTableHeaderCellV2.svelte';
  import TidyTableHeaderRowV2 from 'src/components/item-list/v2/TidyTableHeaderRowV2.svelte';
  import TidyTableRowV2 from 'src/components/item-list/v2/TidyTableRowV2.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let params: SelectableMigrationSelectionParams<any>;

  let searchCriteria: string = '';

  $: visibleSelectablesIdSubset = new Set<string>(
    params.selectables
      .filter(
        (s) =>
          searchCriteria.trim() === '' ||
          s.document.name?.toLowerCase().includes(searchCriteria.toLowerCase()),
      )
      .map((d) => d.document.id),
  );

  let gridTemplateColumns: string;

  $: {
    gridTemplateColumns = `/* Select */ 2.5rem`;
    params.columns.forEach((c) => {
      const measurement = c.cellWidth === 'primary' ? '1fr' : c.cellWidth;
      gridTemplateColumns += ` /* ${c.name} */ ${measurement}`;
    });
  }
  $: totalSelected = params.selectables.filter((t) => t.selected).length;
  $: allSelected = totalSelected >= params.selectables.length;

  function onMigrateClicked() {
    const selectedTargets = params.selectables
      .filter((t) => t.selected)
      .map((t) => t.document);
    params.onConfirm(selectedTargets);
  }

  function toggleAll() {
    const targetState = !allSelected;
    params.selectables.forEach((o) => (o.selected = targetState));
  }

  const localize = FoundryAdapter.localize;
</script>

<section>
  <div role="presentation" class="search-container">
    <Search bind:value={searchCriteria} />
  </div>
  <div role="presentation" class="scroll-container">
    <TidyTableV2
      location="bulk-selection"
      toggleable={false}
      --grid-template-columns={gridTemplateColumns}
    >
      <svelte:fragment slot="header">
        <TidyTableHeaderRowV2>
          <TidyTableHeaderCellV2>
            <input
              type="checkbox"
              bind:checked={allSelected}
              on:click={() => toggleAll()}
              title={localize(
                'TIDY5E.Settings.Migrations.Selection.SelectAllNoneTooltip',
              )}
            />
          </TidyTableHeaderCellV2>
          {#each params.columns as column}
            <TidyTableHeaderCellV2 primary={column?.cellWidth === 'primary'}>
              {column.name}
            </TidyTableHeaderCellV2>
          {/each}
        </TidyTableHeaderRowV2>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {#each params.selectables as selectable}
          <TidyTableRowV2
            hidden={!visibleSelectablesIdSubset.has(selectable.document.id)}
          >
            <TidyTableCellV2>
              <input type="checkbox" bind:checked={selectable.selected} />
            </TidyTableCellV2>
            {#each params.columns as column}
              {@const text = FoundryAdapter.getProperty(
                selectable.document,
                column.field.propPath,
              )}
              <TidyTableCellV2
                primary={column?.cellWidth === 'primary'}
                class="flex-row small-gap"
              >
                {#if column.field.onClick}
                  <button
                    type="button"
                    on:click={() => column.field.onClick?.(selectable.document)}
                    class="inline-transparent-button"
                  >
                    {text}
                  </button>
                {:else}
                  <div>{text}</div>
                {/if}
              </TidyTableCellV2>
            {/each}
          </TidyTableRowV2>
        {/each}
      </svelte:fragment>
    </TidyTableV2>
  </div>
  <footer>
    <p>
      {localize('TIDY5E.Settings.Migrations.Selection.TotalSelectedLabel', {
        total: totalSelected,
      })}
    </p>
    <button on:click={() => onMigrateClicked()}
      >{localize('TIDY5E.ButtonConfirm.Text')}</button
    >
  </footer>
</section>

<style lang="scss">
  section {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0rem;

    > .scroll-container {
      flex: 1;
    }
  }

  .search-container {
    margin-block-end: 0.5rem;
  }

  footer {
    margin-left: -0.5rem;
    margin-right: -0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-top: 1px solid var(--t5e-faint-color);
  }

  input[type='checkbox'] {
    flex-basis: 0.75rem;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    line-height: 0.75rem;
  }
</style>
