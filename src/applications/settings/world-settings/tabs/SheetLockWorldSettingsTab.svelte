<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/applications/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="settings-form">
  <h2>{localize('TIDY5E.WorldSettings.TabSheetLock.header')}</h2>
  <p class="tab-notes">{localize('TIDY5E.WorldSettings.TabSheetLock.hint')}</p>
  <p class="tab-notes">{localize('TIDY5E.WorldSettings.TabSheetLock.hint2')}</p>

  <CheckboxSetting
    bind:value={context.settings.useTotalSheetLock}
    name={'TIDY5E.Settings.UseTotalSheetLock.name'}
    hint={'TIDY5E.Settings.UseTotalSheetLock.hint'}
    id="useTotalSheetLock"
  />

  <h3>{localize('TIDY5E.WorldSettings.TabSheetLock.labelGeneralLocks')}</h3>

  <CheckboxSetting
    bind:value={context.settings.lockExpChanges}
    name={'TIDY5E.Settings.LockExpChanges.name'}
    hint={'TIDY5E.Settings.LockExpChanges.hint'}
    id="lockExpChanges"
  />

  <CheckboxSetting
    bind:value={context.settings.lockHpMaxChanges}
    name={'TIDY5E.Settings.LockHpMaxChanges.name'}
    hint={'TIDY5E.Settings.LockHpMaxChanges.hint'}
    id="lockHpMaxChanges"
  />

  <h3>{localize('TIDY5E.WorldSettings.TabSheetLock.labelInventoryLocks')}</h3>

  <CheckboxSetting
    bind:value={context.settings.lockMoneyChanges}
    name={'TIDY5E.Settings.LockMoneyChanges.name'}
    hint={'TIDY5E.Settings.LockMoneyChanges.hint'}
    id="lockMoneyChanges"
  />

  <h3>{localize('TIDY5E.WorldSettings.TabSheetLock.labelFeaturesLocks')}</h3>

  <CheckboxSetting
    bind:value={context.settings.lockLevelSelector}
    name={'TIDY5E.Settings.LockLevelSelector.name'}
    hint={'TIDY5E.Settings.LockLevelSelector.hint'}
    id="lockLevelSelector"
  />

  <CheckboxSetting
    bind:value={context.settings.lockItemQuantity}
    name={'TIDY5E.Settings.LockItemQuantity.name'}
    hint={'TIDY5E.Settings.LockItemQuantity.hint'}
    id="lockItemQuantity"
  />
</div>

<style lang="less">
</style>
