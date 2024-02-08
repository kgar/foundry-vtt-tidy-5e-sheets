<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { SettingsSheetContext } from '../SheetSettings.types';

  let context = getContext<Writable<SettingsSheetContext>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('TIDY5E.Settings.TabLocks.header')}</h2>
  <p class="tab-notes">{localize('TIDY5E.Settings.TabLocks.hint')}</p>
  <p class="tab-notes">{localize('TIDY5E.Settings.TabLocks.hint2')}</p>

  <CheckboxSetting
    bind:value={$context.settings.useTotalSheetLock}
    name={'TIDY5E.Settings.UseTotalSheetLock.name'}
    hint={'TIDY5E.Settings.UseTotalSheetLock.hint'}
    id="useTotalSheetLock"
  />

  <h3>{localize('TIDY5E.Settings.TabLocks.labelGeneralLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.settings.lockExpChanges}
    name={'TIDY5E.Settings.LockExpChanges.name'}
    hint={'TIDY5E.Settings.LockExpChanges.hint'}
    id="lockExpChanges"
  />

  <CheckboxSetting
    bind:value={$context.settings.lockHpMaxChanges}
    name={'TIDY5E.Settings.LockHpMaxChanges.name'}
    hint={'TIDY5E.Settings.LockHpMaxChanges.hint'}
    id="lockHpMaxChanges"
  />

  <CheckboxSetting
    bind:value={$context.settings.lockConfigureSheet}
    name={'TIDY5E.Settings.LockConfigureSheet.name'}
    hint={'TIDY5E.Settings.LockConfigureSheet.hint'}
    id="lockConfigureSheet"
  />

  <h3>{localize('TIDY5E.Settings.TabLocks.labelInventoryLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.settings.lockMoneyChanges}
    name={'TIDY5E.Settings.LockMoneyChanges.name'}
    hint={'TIDY5E.Settings.LockMoneyChanges.hint'}
    id="lockMoneyChanges"
  />

  <h3>{localize('TIDY5E.Settings.TabLocks.labelFeaturesLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.settings.lockLevelSelector}
    name={'TIDY5E.Settings.LockLevelSelector.name'}
    hint={'TIDY5E.Settings.LockLevelSelector.hint'}
    id="lockLevelSelector"
  />

  <CheckboxSetting
    bind:value={$context.settings.lockItemQuantity}
    name={'TIDY5E.Settings.LockItemQuantity.name'}
    hint={'TIDY5E.Settings.LockItemQuantity.hint'}
    id="lockItemQuantity"
  />
{/if}
