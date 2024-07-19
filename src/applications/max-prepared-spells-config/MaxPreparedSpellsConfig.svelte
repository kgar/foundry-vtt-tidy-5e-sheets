<script lang="ts">
  import { getContext } from 'svelte';
  import type { MaxPreparedSpellsConfigContext } from './MaxPreparedSpellsConfigFormApplication';
  import type { Writable } from 'svelte/store';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);
  const context = getContext<Writable<MaxPreparedSpellsConfigContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<section class="flex-column">
  <div class="form-field">
    <label for="max-prepared-spells-edit-{appId}"
      >{localize('DND5E.Formula')}</label
    >
    <input
      id="max-prepared-spells-edit-{appId}"
      type="text"
      placeholder="0"
      bind:value={$context.maxPreparedSpells}
    />
  </div>
  <div role="presentation">
    <h3>{localize('TIDY5E.MaxPreparedSpellsConfig.ExamplesHeader')}</h3>
    <p class="flex-row flex-wrap sample-formulas">
      {#each $context.formulas as formula}
        <button
          type="button"
          class="highlight-on-hover"
          on:click={() => {
            $context.maxPreparedSpells = formula.value;
          }}>{localize(formula.label)}</button
        >
      {/each}
    </p>
    <p>
      <a
        target="_blank"
        href="https://github.com/kgar/foundry-vtt-tidy-5e-sheets/wiki/Max-Prepared-Spells-Formulas"
        >{localize('TIDY5E.MaxPreparedSpellsConfig.MoreFormulas')}</a
      >
    </p>
  </div>
  <button type="submit">
    <i class="far fa-save" />
    {localize('Save')}
  </button>
</section>

<style lang="scss">
  .sample-formulas {
    button {
      flex: 0 0 1rem;
    }
  }
</style>
