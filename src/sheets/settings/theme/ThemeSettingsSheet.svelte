<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CurrentSettings } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';

  let store = getContext<Writable<CurrentSettings>>('store');

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: npm i svelte-awesome-color-picker -->

<h3>{localize('TIDY5E.Settings.ColorPickerLabel')}</h3>
<article class="setting">
  <input
    type="checkbox"
    data-dtype="boolean"
    id="colorPickerEnabled"
    bind:checked={$store.colorPickerEnabled}
  />
  <div class="description">
    <label for="colorPickerEnabled"
      >{localize('TIDY5E.Settings.ColorPickerEnabled.name')}</label
    >
    <p class="notes">{localize('TIDY5E.Settings.ColorPickerEnabled.hint')}</p>
  </div>
</article>
