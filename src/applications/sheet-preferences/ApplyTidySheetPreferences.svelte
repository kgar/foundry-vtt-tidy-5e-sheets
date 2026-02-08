<script lang="ts">
  import { type SheetPreferenceOption } from './ApplyTidySheetPreferencesApplication.svelte';
  import { ApplyTidySheetPreferencesApplication } from './ApplyTidySheetPreferencesApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  interface Props {
    options: SheetPreferenceOption[];
    onConfirm: ApplyTidySheetPreferencesApplication['_onConfirm'];
  }

  let { options, onConfirm }: Props = $props();

  const localize = FoundryAdapter.localize;

  const gridTemplateColumns = [
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

<div class="dialog-content-container flexcol">
  <h2 class="settings-header">{localize('TIDY5E.Settings.SheetPreferences.name')}</h2>
  <div class="settings-description">
    {localize('TIDY5E.Settings.SheetPreferences.explanation')}
  </div>
  <div class="scroll-container">
    <TidyTable key="default-sheet-preferences" toggleable={false}>
      {#snippet header()}
        <TidyTableHeaderRow class="theme-dark">
          <TidyTableHeaderCell primary={true} class="header-label-cell">
            <input
              type="checkbox"
              checked={allSelected}
              onclick={() => toggleAll()}
              title={localize(
                'TIDY5E.Settings.Migrations.Selection.SelectAllNoneTooltip',
              )}
            />
            <!-- TODO: eliminate inline style -->
            <span style="margin-inline-start: 0.5rem">
              {localize('Sheet')}
            </span>
          </TidyTableHeaderCell>
        </TidyTableHeaderRow>
      {/snippet}
      {#snippet body()}
        {#each options as option}
          {@const checkboxId = getRandomId()}
          <TidyTableRow>
            <TidyTableCell primary={true}>
              <input
                type="checkbox"
                id={checkboxId}
                bind:checked={option.selected}
              />
              <label for={checkboxId} class="item-name">{option.label}</label
              ></TidyTableCell
            >
          </TidyTableRow>
        {/each}
      {/snippet}
    </TidyTable>
  </div>
</div>
<div class="button-bar">
  <p>
    {localize('TIDY5E.Settings.Migrations.Selection.TotalSelectedLabel', {
      total: totalSelected,
    })}
  </p>
  <button
    type="button"
    class="button button-primary button-large use-default-btn"
    onclick={() => onConfirm()}
  >
  <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
