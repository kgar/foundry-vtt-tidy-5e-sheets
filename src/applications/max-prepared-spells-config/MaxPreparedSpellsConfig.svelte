<script lang="ts">
  import { getContext } from 'svelte';
  import type { MaxPreparedSpellsConfigContext } from './MaxPreparedSpellsConfigFormApplication';
  import type { Writable } from 'svelte/store';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  const appId = getContext<string>('appId');
  const context =
    getContext<Writable<MaxPreparedSpellsConfigContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<section>
  <div class="form-field">
    <label for="max-prepared-spells-edit-{appId}"
      >{localize('T5EK.MaxPreparedSpellsConfig.Label')}</label
    >

    <input
      id="max-prepared-spells-edit-{appId}"
      type="text"
      placeholder="0"
      bind:value={$context.maxPreparedSpells}
    />
  </div>
</section>
<p>
  TODO: Add buttons for each class to plunk in the standard calculation. It'll
  help the average user get started.
</p>
<button type="submit">
  <i class="far fa-save" />
  {localize('Save')}
</button>
