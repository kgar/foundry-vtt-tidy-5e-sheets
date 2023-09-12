<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxSetting from 'src/sheets/settings/parts/CheckboxSetting.svelte';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import type { CurrentSettings } from 'src/settings/settings';
    import TextInputSetting from 'src/sheets/settings/parts/TextInputSetting.svelte';

  let store = getContext<Writable<CurrentSettings>>('store');

  const userIsGm = FoundryAdapter.userIsGm();
  const localize = FoundryAdapter.localize;
</script>

{#if userIsGm}
  <h2>{localize('T5EK.Settings.TabHomebrewRules.header')}</h2>

  <h3>{localize('T5EK.Settings.TabHomebrewRules.labelHBUpcastFreeSpell')}</h3>

  <CheckboxSetting
    bind:value={$store.hbEnableUpcastFreeSpell}
    name={'T5EK.Settings.HBEnableUpcastFreeSpell.name'}
    hint={'T5EK.Settings.HBEnableUpcastFreeSpell.hint'}
    id="hbEnableUpcastFreeSpell"
  />

  <TextInputSetting
    bind:value={$store.hbSetFeaturesForUpcastFreeSpell}
    name={'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.name'}
    hint={'T5EK.Settings.HBSetFeaturesForUpcastFreeSpell.hint'}
    id="hbSetFeaturesForUpcastFreeSpell"
  />
{/if}
