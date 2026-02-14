<script lang="ts">
  import { type SheetPreferenceOption } from './ApplyTidySheetPreferencesApplication.svelte';
  import { ApplyTidySheetPreferencesApplication } from './ApplyTidySheetPreferencesApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyTable from 'src/components/table-quadrone/TidyTable.svelte';
  import TidyTableRow from 'src/components/table-quadrone/TidyTableRow.svelte';
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';

  interface Props {
    options: SheetPreferenceOption[];
    onConfirm: ApplyTidySheetPreferencesApplication['_onConfirm'];
  }

  let { options, onConfirm }: Props = $props();

  const localize = FoundryAdapter.localize;

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
  <div class="settings-actions flexrow">
    <button
      type="button"
      class="button button-secondary use-default-btn"
      onclick={() => {
        options.forEach((o) => (o.selected = false));
      }}
    >
    <i class="fas fa-xmark"></i>
      {localize('TIDY5E.Settings.SheetPreferences.disableAll')}
    </button>
    
    <button
      type="button"
      class="button button-primary use-default-btn"
      onclick={() => {
        options.forEach((o) => (o.selected = true));
      }}
    >
    <i class="fas fa-check-double"></i>
      {localize('TIDY5E.Settings.SheetPreferences.enableAll')}
    </button>
  </div>
  <div class="title-underlined">
    <h3>{localize('Sheet')}</h3>
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </div>
  <div class="scroll-container">
    <TidyTable key="default-sheet-preferences" toggleable={false}>
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
    class="button button-primary button-large button-save use-default-btn"
    onclick={() => onConfirm()}
  >
  <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
