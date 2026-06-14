<script lang="ts">
  import { type SheetPreferenceOption } from './ApplyTidySheetPreferencesApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableHeaderRow from 'src/components/table-quadrone/TidyTableHeaderRow.svelte';
  import TidyTableHeaderCell from 'src/components/table-quadrone/TidyTableHeaderCell.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  interface Props {
    options: SheetPreferenceOption[];
  }

  let { options }: Props = $props();

  const localize = FoundryAdapter.localize;

  const tidyOptionText = localize('TIDY5E.SheetPreferences.TidySheets');
  const systemOptionText = localize('TIDY5E.SheetPreferences.SystemSheets');
</script>

<div class="dialog-content-container flexcol">
  <h2 class="settings-header">
    {localize('TIDY5E.Settings.SheetPreferences.name')}
  </h2>
  <p class="settings-description">
    {localize('TIDY5E.Settings.SheetPreferences.explanation')}
  </p>

  <div class="controls-row flexrow">
    <button
      type="button"
      class="button button-primary button-large use-default-btn flex1"
      onclick={() => {
        options.forEach((o) => (o.selected = true));
      }}
    >
      <i class="fas fa-check-double"></i>
      {localize('TIDY5E.Settings.SheetPreferences.enableAll')}
    </button>
  </div>

  <TidyTable key="sheet-preferences-table" toggleable={false} class="sheet-preferences-table scrollable-table">
    {#snippet header()}
      <TidyTableHeaderRow class="unset-header-height theme-dark">
        <TidyTableHeaderCell primary={true}>
          <h3 class="sheet-preferences-label">
            {localize('TIDY5E.Settings.SheetPreferences.Sheet')}
          </h3>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell 
          class="sheet-preferences-column-label"
          columnWidth="7rem"
        >
          {localize('TIDY5E.Settings.SheetPreferences.SystemSheets')}
        </TidyTableHeaderCell>
        <TidyTableHeaderCell
          class="sheet-preferences-column-label"
          columnWidth="7rem"
        >
          {localize('TIDY5E.Settings.SheetPreferences.TidySheets')}
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    {/snippet}
    {#snippet body()}
      {#each options as option}
        {@const formControlId = `${option.label.slugify()}`}
        <TidyTableRow>
          <TidyTableCell primary={true}>
            <label for={formControlId}>{option.label}</label>
          </TidyTableCell>
          <TidyTableCell columnWidth="7rem">
            <label class="radio">
              <input
                type="radio"
                checked={!option.selected}
                onclick={() => {
                  option.selected = false;
                }}
              />
              <span class="hidden">{systemOptionText}</span>
            </label>
          </TidyTableCell>
          <TidyTableCell columnWidth="7rem">
            <label class="radio">
              <input
                id={formControlId}
                type="radio"
                checked={option.selected}
                onclick={() => {
                  option.selected = true;
                }}
              />
              <span class="hidden">{tidyOptionText}</span>
            </label>
          </TidyTableCell>
        </TidyTableRow>
      {/each}
    {/snippet}
  </TidyTable>
</div>
