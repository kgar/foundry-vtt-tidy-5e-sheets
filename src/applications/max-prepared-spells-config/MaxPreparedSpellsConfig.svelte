<script lang="ts">
  import { getContext } from 'svelte';
  import {
    MaxPreparedSpellsConfigFormApplication,
    type MaxPreparedSpellsConfigContext,
  } from './MaxPreparedSpellsConfigFormApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);
  const context = getContext<
    CoarseReactivityProvider<MaxPreparedSpellsConfigContext>
  >(CONSTANTS.SVELTE_CONTEXT.CONTEXT).data;
  const save =
    getContext<MaxPreparedSpellsConfigFormApplication['_save']>('save');

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
      bind:value={context.maxPreparedSpells}
    />
  </div>
  <div role="presentation">
    <h3>{localize('TIDY5E.MaxPreparedSpellsConfig.ExamplesHeader')}</h3>
    <p class="flex-row flex-wrap sample-formulas">
      {#each context.formulas as formula}
        <button
          type="button"
          class="highlight-on-hover"
          onclick={() => {
            context.maxPreparedSpells = formula.value;
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
  <button type="button" onclick={() => save()}>
    <i class="far fa-save"></i>
    {localize('Save')}
  </button>
</section>

<style lang="less">
  .sample-formulas {
    button {
      flex: 0 0 1rem;
    }
  }
</style>
