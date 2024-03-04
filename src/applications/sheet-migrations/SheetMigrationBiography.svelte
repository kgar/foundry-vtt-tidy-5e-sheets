<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/types';

  export let actor: Actor5e | undefined;
  let overwrite = false;
  let applyAll = false;
  let deleteFlags = false;

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('DND5E.Biography')}</h2>
<div class="flex-column">
  <ul>
    <li>{localize('DND5E.Age')}</li>
    <li>{localize('DND5E.Eyes')}</li>
    <li>{localize('DND5E.Gender')}</li>
    <li>{localize('DND5E.Hair')}</li>
    <li>{localize('DND5E.Height')}</li>
    <li>{localize('DND5E.Skin')}</li>
    <li>{localize('DND5E.Weight')}</li>
  </ul>
  <div class="grid-auto-columns">
    <label
      class="green-checkbox"
      data-tooltip={localize('TIDY5E.SheetMigrations.OptionOverwrite.Tooltip')}
    >
      <input type="checkbox" bind:checked={overwrite} />
      {localize('TIDY5E.SheetMigrations.OptionOverwrite.Text')}
    </label>

    {#if FoundryAdapter.userIsGm()}
      <label
        class="green-checkbox"
        data-tooltip={localize('TIDY5E.SheetMigrations.OptionApplyAll.Tooltip')}
      >
        <input type="checkbox" bind:checked={applyAll} />
        {localize('TIDY5E.GMOnly.Message', {
          message: localize('TIDY5E.SheetMigrations.OptionApplyAll.Text'),
        })}
      </label>
    {/if}

    <label
      class="green-checkbox"
      data-tooltip={localize(
        'TIDY5E.SheetMigrations.OptionDeleteFlags.Tooltip',
      )}
    >
      <input type="checkbox" bind:checked={deleteFlags} />

      {localize('TIDY5E.SheetMigrations.OptionDeleteFlags.Text')}
    </label>
  </div>
  <button>{localize('TIDY5E.SheetMigrations.ButtonMigration.Text')}</button>
</div>
