<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';

  let context = getContext<Writable<CurrentSettings>>('context');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabLocks.header')}</h2>
  <p class="tab-notes">{localize('T5EK.Settings.TabLocks.hint')}</p>
  <p class="tab-notes">{localize('T5EK.Settings.TabLocks.hint2')}</p>

  <CheckboxSetting
    bind:value={$context.useTotalSheetLock}
    name={'T5EK.Settings.UseTotalSheetLock.name'}
    hint={'T5EK.Settings.UseTotalSheetLock.hint'}
    id="useTotalSheetLock"
  />

  <h3>{localize('T5EK.Settings.TabLocks.labelGeneralLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.lockExpChanges}
    name={'T5EK.Settings.LockExpChanges.name'}
    hint={'T5EK.Settings.LockExpChanges.hint'}
    id="lockExpChanges"
  />

  <CheckboxSetting
    bind:value={$context.lockHpMaxChanges}
    name={'T5EK.Settings.LockHpMaxChanges.name'}
    hint={'T5EK.Settings.LockHpMaxChanges.hint'}
    id="lockHpMaxChanges"
  />

  <CheckboxSetting
    bind:value={$context.lockConfigureSheet}
    name={'T5EK.Settings.LockConfigureSheet.name'}
    hint={'T5EK.Settings.LockConfigureSheet.hint'}
    id="lockConfigureSheet"
  />

  <h3>{localize('T5EK.Settings.TabLocks.labelInventoryLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.lockMoneyChanges}
    name={'T5EK.Settings.LockMoneyChanges.name'}
    hint={'T5EK.Settings.LockMoneyChanges.hint'}
    id="lockMoneyChanges"
  />

  <h3>{localize('T5EK.Settings.TabLocks.labelFeaturesLocks')}</h3>

  <CheckboxSetting
    bind:value={$context.lockLevelSelector}
    name={'T5EK.Settings.LockLevelSelector.name'}
    hint={'T5EK.Settings.LockLevelSelector.hint'}
    id="lockLevelSelector"
  />

  <CheckboxSetting
    bind:value={$context.lockItemQuantity}
    name={'T5EK.Settings.LockItemQuantity.name'}
    hint={'T5EK.Settings.LockItemQuantity.hint'}
    id="lockItemQuantity"
  />
{/if}
