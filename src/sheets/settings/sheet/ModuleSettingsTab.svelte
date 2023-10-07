<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
  import SelectSetting from 'src/sheets/settings/parts/SelectSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabModules.header')}</h2>

  <h3>{localize('T5EK.Settings.TabModules.labelActionsFavorites')}</h3>

  <SelectSetting
    options={{
      default: 'T5EK.Settings.DefaultActionsTab.default',
      attributes: 'T5EK.Settings.DefaultActionsTab.attributes',
      inventory: 'T5EK.Settings.DefaultActionsTab.inventory',
      spellbook: 'T5EK.Settings.DefaultActionsTab.spellbook',
      features: 'T5EK.Settings.DefaultActionsTab.features',
      effects: 'T5EK.Settings.DefaultActionsTab.effects',
      biography: 'T5EK.Settings.DefaultActionsTab.biography',
      journal: 'T5EK.Settings.DefaultActionsTab.journal',
      actions: 'T5EK.Settings.DefaultActionsTab.actions',
    }}
    bind:value={$store.defaultActionsTab}
    name="T5EK.Settings.DefaultActionsTab.name"
    hint="T5EK.Settings.DefaultActionsTab.hint"
    id="defaultActionsTab"
  />
{/if}
