<script lang="ts">
  import { type SheetPreferenceOption } from './ApplyTidySheetPreferencesApplication.svelte';
  import { ApplyTidySheetPreferencesApplication } from './ApplyTidySheetPreferencesApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable, {
    type TidyTableColumns,
  } from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';

  interface Props {
    options: SheetPreferenceOption[];
    onConfirm: ApplyTidySheetPreferencesApplication['_onConfirm'];
  }

  let { options, onConfirm }: Props = $props();

  const localize = FoundryAdapter.localize;

  const gridTemplateColumns: TidyTableColumns = [
    {
      name: 'Select',
      width: '2.5rem',
    },
    {
      name: 'Label',
      width: '1fr',
    },
  ];

  let totalSelected = $derived(options.filter((t) => t.selected).length);
  let allSelected = $derived(totalSelected >= options.length);

  function toggleAll() {
    const targetState = !allSelected;
    options.forEach((o) => (o.selected = targetState));
  }

  function getRandomId() {
    return foundry.utils.randomID();
  }
</script>

<div class="sheet-preferences-container">
  <div>
    {localize('TIDY5E.Settings.SheetPreferences.explanation')}
  </div>
  <div class="scroll-container">
    <TidyTable
      key="default-sheet-preferences"
      toggleable={false}
      {gridTemplateColumns}
    >
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
          <TidyTableHeaderCell primary={true}
            >{localize('Sheet')}</TidyTableHeaderCell
          >
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each options as option}
          {@const checkboxId = getRandomId()}
          <TidyTableRow>
            <TidyTableCell
              ><input
                type="checkbox"
                id={checkboxId}
                bind:checked={option.selected}
              /></TidyTableCell
            >
            <TidyTableCell primary={true}
              ><label for={checkboxId}>{option.label}</label></TidyTableCell
            >
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
    <button class="confirm" type="button" onclick={() => onConfirm()}
      >{localize('TIDY5E.ButtonConfirm.Text')}</button
    >
  </footer>
</div>

<style lang="scss">
  .sheet-preferences-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    > .scroll-container {
      flex: 1;
    }
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

  label {
    flex: 1;
    padding: 0.25rem 0;
  }

  button.confirm {
    --button-size: 1.5rem;
    width: 100%;
  
  }
</style>
