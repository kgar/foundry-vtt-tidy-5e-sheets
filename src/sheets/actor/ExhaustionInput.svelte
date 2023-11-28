<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { PortraitCharmRadiusClass } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;
  export let level: number;
  export let onlyShowOnHover: boolean = false;

  const localize = FoundryAdapter.localize;
  const dispatch = createEventDispatcher<{
    levelSelected: { level: number };
  }>();

  let fontScales = ['1.25rem', '1rem', '0.75rem'] as const;

  let inputFontSize: string;
  $: {
    inputFontSize =
      !level || level < 100
        ? fontScales[0]
        : level < 1000
          ? fontScales[1]
          : fontScales[2];
  }
</script>

<div
  class="exhaustion-container {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
  title={localize('T5EK.Settings.Exhaustion.Header')}
  style="--t5ek-exhaustion-input-font-size: {inputFontSize}"
>
  <div class="exhaustion-wrap {radiusClass}">
    <input
      type="number"
      on:change={() => dispatch('levelSelected', { level: level })}
      bind:value={level}
      placeholder="0"
      on:focus={(ev) => ev.currentTarget.select()}
    />
  </div>
  <!-- <div class="exhaustion-wrap {radiusClass}">
    <div
      class="exhaustion-icon colorized"
      title={`${localize('DND5E.Exhaustion')} ${localize(
        'DND5E.AbbreviationLevel',
      )} ${level}, ${localize(selectedHintKey)}`}
    >
      <i class={selectedLevel.iconCssClass ?? ''} />
    </div>
    <ul class="exhaustion-levels">
      {#each iconsWithSeverities as _, i}
        <li>
          <button
            type="button"
            class="exhaustion-level-option transparent-button"
            class:colorized={i <= level}
            title={localize(exhaustionConfig.hints[i] ?? '')}
            on:click={() => dispatch('levelSelected', { level: i })}
            disabled={!$context.owner}
          >
            {i}
          </button>
        </li>
      {/each}
    </ul>
  </div> -->
  <!-- <div class="level-display" class:colorized={level > 0}>
    {level}
  </div> -->
</div>

<style lang="scss">
  .exhaustion-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 2.125rem;
    width: 2.125rem;
    z-index: 1;
    color: var(--t5ek-icon-font-color);

    .exhaustion-wrap {
      height: 2.125rem;
      width: 2.125rem;
      overflow: hidden;
      background: var(--t5ek-icon-background);
      display: flex;
      align-items: center;
      box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5ek-icon-outline-color);

      &.rounded {
        border-radius: 1.25rem;
      }

      input {
        text-align: center;
        font-size: var(--t5ek-exhaustion-input-font-size);
        border-radius: 1.25rem;
        color: var(--t5ek-tertiary-color);
        transition: color 0.3s ease;

        &:focus {
          color: var(--t5ek-primary-font-color);
        }
      }
    }
  }
</style>
