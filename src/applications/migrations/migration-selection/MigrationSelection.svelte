<script lang="ts">
  import type { SelectableMigrationSelectionParams } from './migration-selection.types';
  import ItemTableV2 from 'src/components/item-list/v1/ItemTable.svelte';
  import ItemTableCellV2 from 'src/components/item-list/v2/ItemTableCellV2.svelte';
  import ItemTableHeaderCellV2 from 'src/components/item-list/v2/ItemTableHeaderCellV2.svelte';
  import ItemTableHeaderRowV2 from 'src/components/item-list/v2/ItemTableHeaderRowV2.svelte';
  import ItemTableRowV2 from 'src/components/item-list/v2/ItemTableRowV2.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let params: SelectableMigrationSelectionParams<any>;

  function onMigrateClicked() {
    const selectedTargets = params.selectables
      .filter((t) => t.selected)
      .map((t) => t.document);
    params.onConfirm(selectedTargets);
  }

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

  function toggleAll() {
    const targetState = !allSelected;
    params.selectables.forEach((o) => (o.selected = targetState));
  }

  const localize = FoundryAdapter.localize;
</script>

<section class="name-me-container">
  <div class="scroll-container">
    <ItemTableV2
      location="bulk-selection"
      toggleable={false}
      --grid-template-columns={gridTemplateColumns}
    >
      <svelte:fragment slot="header">
        <ItemTableHeaderRowV2>
          <ItemTableHeaderCellV2>
            <input
              type="checkbox"
              bind:checked={allSelected}
              on:click={() => toggleAll()}
              title={localize(
                'TIDY5E.Settings.Migrations.Selection.SelectAllNoneTooltip',
              )}
            />
          </ItemTableHeaderCellV2>
          {#each params.columns as column}
            <ItemTableHeaderCellV2 primary={column?.cellWidth === 'primary'}>
              {column.name}
            </ItemTableHeaderCellV2>
          {/each}
        </ItemTableHeaderRowV2>
      </svelte:fragment>
      <svelte:fragment slot="body">
        {#each params.selectables as selectable}
          <ItemTableRowV2>
            <ItemTableCellV2>
              <input type="checkbox" bind:checked={selectable.selected} />
            </ItemTableCellV2>
            {#each params.columns as column}
              {@const text = FoundryAdapter.getProperty(
                selectable.document,
                column.field.propPath,
              )}
              <ItemTableCellV2
                primary={column?.cellWidth === 'primary'}
                cssClass="flex-row small-gap"
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
              </ItemTableCellV2>
            {/each}
          </ItemTableRowV2>
        {/each}
      </svelte:fragment>
    </ItemTableV2>
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
