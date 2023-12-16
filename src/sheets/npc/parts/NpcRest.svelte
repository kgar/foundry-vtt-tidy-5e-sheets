<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<NpcSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div
  class="rest-container"
  class:has-rounded-portrait={$context.useRoundedPortraitStyle}
  title={localize('T5EK.RestHint')}
>
  <div class="resting">
    <span class="resting-icon">
      <i class="rest-icon fas fa-bed" />
    </span>
    <button
      type="button"
      class="rest short-rest inline-icon-button"
      title={localize('T5EK.ShortRest')}
      on:click={(ev) => $context.shortRest(ev)}
      disabled={!$context.editable}
      tabindex={!$settingStore.useDefaultSheetHpTabbing ? 0 : -1}
    >
      <i class="fas fa-hourglass-half" />
    </button>
    <button
      type="button"
      class="rest long-rest inline-icon-button"
      title={localize('T5EK.LongRest')}
      on:click={(ev) => $context.longRest(ev)}
      disabled={!$context.editable}
      tabindex={!$settingStore.useDefaultSheetHpTabbing ? 0 : -1}
    >
      <i class="fas fa-hourglass-end" />
    </button>
  </div>
</div>

<style lang="scss">
  .rest-container {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .resting {
    width: 1.5rem;
    height: 1.25rem;
    border-radius: 0 0 0 0.3125rem;
    overflow: hidden;
    transition: width 0.3s ease;
    background: var(--t5ek-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5ek-icon-outline-color);
    color: var(--t5ek-icon-font-color);

    &:hover,
    &:focus-within {
      width: 5.875rem;
    }

    .rest {
      flex: 0 0 1.875rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.875rem;
      height: 1.125rem;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      color: var(--t5ek-tertiary-color);
      padding: 0;
      font-size: 0.75rem;
      line-height: 1.125rem;
      font-family: var(--t5ek-body-font-family);
      font-weight: 700;
      transition: color 0.3s ease, transform 0.3s ease;

      &:hover,
      &:focus-within {
        color: var(--t5ek-primary-font-color);
      }
    }

    .resting-icon {
      flex: 0 0 1.5rem;
      display: flex;

      width: 1.5rem;
      height: 1.125rem;
      margin-right: 0.5rem;
      justify-content: center;
      align-items: center;
      border-radius: 0;
      font-size: 0.75rem;
      color: var(--t5ek-primary-font-color);
    }
  }

  .rest-container.has-rounded-portrait {
    left: 0.4375rem;
    bottom: 0;

    .resting {
      border-radius: 0.3125rem 0 0 0.3125rem;
      transition: all 0.3s ease;
    }

    .resting:not(:is(:hover, :focus-within)) {
      background: transparent;
      box-shadow: none;
      border-color: transparent;
    }
  }
</style>
