<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  let store = getContext<Writable<CurrentSettings>>('store');

  const localize = FoundryAdapter.localize;
</script>

<h2>{localize('T5EK.Settings.TabPlayers.header')}</h2>

<article class="setting">
  <input
    type="checkbox"
    data-dtype="boolean"
    name="journalTabDisabled"
    id="journalTabDisabled"
    bind:checked={$store.journalTabDisabled}
  />
  <div class="description">
    <label for="journalTabDisabled"
      >{localize('T5EK.Settings.JournalTab.name')}</label
    >
    <p class="notes">{localize('T5EK.Settings.JournalTab.hint')}</p>
  </div>
</article>
<article class="setting">
  <input
    type="checkbox"
    data-dtype="boolean"
    name="classListDisabled"
    id="classListDisabled"
    bind:checked={$store.classListDisabled}
  />
  <div class="description">
    <label for="classListDisabled"
      >{localize('T5EK.Settings.ClassList.name')}</label
    >
    <p class="notes">{localize('T5EK.Settings.ClassList.hint')}</p>
  </div>
</article>
