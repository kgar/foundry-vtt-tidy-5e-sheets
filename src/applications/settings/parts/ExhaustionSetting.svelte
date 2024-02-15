<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext, onMount } from 'svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import type { ExhaustionConfig } from 'src/features/exhaustion/exhaustion.types';

  export let name: string;
  export let hint: string;
  export let config: ExhaustionConfig;

  let appId = getContext('appId');

  $: levelsIterator =
    config.type === 'specific' ? Array(config.levels + 1).fill(0) : [];
  const localize = FoundryAdapter.localize;
</script>

<article class="setting group">
  <section>
    <div class="description">
      <label for="exhaustionConfigType-{appId}">{localize(name)}</label>
      <p class="tidy5e-notes">{localize(hint)}</p>
    </div>
    <div class="settings-group">
      <select id="exhaustionConfigType-{appId}" bind:value={config.type}>
        <SelectOptions
          data={{
            specific: 'TIDY5E.WorldSettings.Exhaustion.options.specific.text',
            open: 'TIDY5E.WorldSettings.Exhaustion.options.open.text',
          }}
        ></SelectOptions>
      </select>
      {#if config.type === 'open'}
        <p class="tidy5e-notes">
          {localize('TIDY5E.WorldSettings.Exhaustion.options.open.explanation')}
        </p>
      {/if}
    </div>
  </section>
</article>

{#if config.type === 'specific'}
  <article class="setting group">
    <section>
      <div class="description">
        <label for="exhaustionConfigTypeLevels-{appId}"
          >{localize(
            'TIDY5E.WorldSettings.Exhaustion.options.specific.levels.name',
          )}</label
        >
        <p class="tidy5e-notes">
          {localize('TIDY5E.WorldSettings.Exhaustion.options.specific.levels.hint')}
        </p>
      </div>
      <div class="settings-group">
        <input type="number" bind:value={config.levels} min="1" />
      </div>
    </section>
  </article>

  {#if config.type === 'specific'}
    {#each levelsIterator as _, i (i)}
      <article class="setting group">
        <section class="">
          <div class="description">
            <label
              for="exhaustion-level-{i}-{appId}"
              title={localize(config.hints[i])}
              class="flex-row small-gap align-items-center"
            >
              {localize(
                'TIDY5E.WorldSettings.Exhaustion.options.specific.levels.tooltip.name',
                {
                  level: i,
                },
              )}
              <i class="fas fa-info-circle"></i>
            </label>
            <p class="tidy5e-notes">
              {localize(
                'TIDY5E.WorldSettings.Exhaustion.options.specific.levels.tooltip.hint',
              )}
            </p>
          </div>
          <div class="settings-group">
            <input
              type="text"
              id="exhaustion-level-{i}-{appId}"
              bind:value={config.hints[i]}
            />
          </div>
        </section>
      </article>
    {/each}
  {/if}
{/if}
