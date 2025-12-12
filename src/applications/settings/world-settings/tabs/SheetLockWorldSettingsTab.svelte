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
  
  <CheckboxSetting
    bind:value={context.settings.lockMoneyChanges}
    name={'TIDY5E.Settings.LockMoneyChanges.name'}
    hint={'TIDY5E.Settings.LockMoneyChanges.hint'}
    id="lockMoneyChanges"
  />

</div>
