<script lang="ts">
  import type { SelectableMigrationSelectionParams } from './migration-selection.types';
  import TidyTable, {
    type TidyTableColumns,
  } from 'src/components/table/TidyTable.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    params: SelectableMigrationSelectionParams<any>;
  }

  let { params }: Props = $props();

  let searchCriteria: string = $state('');

  let visibleSelectablesIdSubset = $derived(
    new Set<string>(
      params.selectables
        .filter(
          (s) =>
            searchCriteria.trim() === '' ||
            s.document.name
              ?.toLowerCase()
              .includes(searchCriteria.toLowerCase()),
        )
        .map((d) => d.document.id),
    ),
  );

  let gridTemplateColumns: TidyTableColumns = $derived.by(() => {
    let result: TidyTableColumns = [
      {
        name: 'Select',
        width: '2.5rem',
      },
    ];

    params.columns.forEach((c) => {
      const measurement = c.cellWidth === 'primary' ? '1fr' : c.cellWidth;
      result.push({
        name: c.name,
        width: measurement,
      });
    });
    return result;
  });

  let totalSelected = $derived(
    params.selectables.filter((t) => t.selected).length,
  );
  let allSelected = $derived(totalSelected >= params.selectables.length);

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
    <TidyTable key="bulk-selection" toggleable={false} {gridTemplateColumns}>
      {#snippet header()}
        <TidyTableHeaderRow>
          <TidyTableHeaderCell>
            <input
              type="checkbox"
              checked={allSelected}
              onclick={() => toggleAll()}
              title={localize(
                'TIDY5E.Settings.Migrations.Selection.SelectAllNoneTooltip',
              )}
            />
          </TidyTableHeaderCell>
          {#each params.columns as column}
            <TidyTableHeaderCell primary={column?.cellWidth === 'primary'}>
              {column.name ?? ''}
            </TidyTableHeaderCell>
          {/each}
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each params.selectables as selectable}
          <TidyTableRow
            hidden={!visibleSelectablesIdSubset.has(selectable.document.id)}
          >
            <TidyTableCell>
              <input type="checkbox" bind:checked={selectable.selected} />
            </TidyTableCell>
            {#each params.columns as column}
              {@const field = column.field}
              <TidyTableCell
                primary={column?.cellWidth === 'primary'}
                class="flex-row small-gap"
              >
                {#if field.type === 'contextual'}
                  {field.getText(selectable.document) ?? ''}
                {:else if column.field.type === 'simple'}
                  {@const text =
                    FoundryAdapter.getProperty(
                      selectable.document,
                      field.propPath,
                    ) ?? ''}
                  {#if field.onClick}
                    <button
                      type="button"
                      onclick={() => field.onClick?.(selectable.document)}
                      class="inline-transparent-button"
                    >
                      {text}
                    </button>
                  {:else}
                    <div>{text}</div>
                  {/if}
                {/if}
              </TidyTableCell>
            {/each}
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  </div>
  <footer>
    <p>
      {localize('TIDY5E.Settings.Migrations.Selection.TotalSelectedLabel', {
        total: totalSelected,
      })}
    </p>
    <button class="confirm" onclick={() => onMigrateClicked()}
      >{localize('TIDY5E.ButtonConfirm.Text')}</button
    >
  </footer>
</section>

<style lang="less">
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
    border-top: 0.0625rem solid var(--t5e-faint-color);
  }

  input[type='checkbox'] {
    flex-basis: 0.75rem;
    width: auto;
    height: auto;
    margin: 0;
    padding: 0;
    line-height: 0.75rem;
  }

  button.confirm {
    --button-size: 1.5rem;
    width: 100%;
  }
</style>
