<script lang="ts">
  import { type SheetPreferenceOption } from './ApplyTidySheetPreferencesApplication.svelte';
  import { ApplyTidySheetPreferencesApplication } from './ApplyTidySheetPreferencesApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    options: SheetPreferenceOption[];
    onConfirm: ApplyTidySheetPreferencesApplication['_onConfirm'];
  }

  let { options, onConfirm }: Props = $props();

  const localize = FoundryAdapter.localize;

  const tidyOptionText = localize('TIDY5E.SheetPreferences.TidySheets');
  const systemOptionText = localize('TIDY5E.SheetPreferences.SystemSheets');

  let totalSelected = $derived(options.filter((t) => t.selected).length);
</script>

<div class="dialog-content-container flexcol">
  <h2 class="settings-header">
    {localize('TIDY5E.Settings.SheetPreferences.name')}
  </h2>
  <p class="settings-description">
    {localize('TIDY5E.Settings.SheetPreferences.explanation')}
  </p>

  <div class="controls-row">
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

  <div class="scroll-container">
    <table class="sheet-preferences-table">
      <thead>
        <tr>
          <th>
            <h3 class="sheet-preferences-label">
              {localize('TIDY5E.Settings.SheetPreferences.Sheet')}
            </h3>
          </th>
          <th class="sheet-preferences-column-label">
            {localize('TIDY5E.Settings.SheetPreferences.SystemSheets')}
          </th>
          <th class="sheet-preferences-column-label">
            {localize('TIDY5E.Settings.SheetPreferences.TidySheets')}
          </th>
        </tr>
      </thead>
      <tbody>
        {#each options as option}
          {@const formControlId = `${option.label.slugify()}`}
          <tr>
            <td>
              <label for={formControlId}>
                {option.label}
              </label>
            </td>
            <td>
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
            </td>
            <td>
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
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
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
