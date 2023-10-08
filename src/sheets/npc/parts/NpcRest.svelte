<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div
  class="rest-container"
  class:has-rounded-portrait={$store.useRoundedPortraitStyle}
  title={localize('T5EK.RestHint')}
>
  <div class="resting">
    <span class="resting-icon">
      <i class="rest-icon fas fa-bed" />
    </span>
    <a
      class="rest short-rest"
      title={localize('T5EK.RestS')}
      on:click={(ev) => $store.shortRest(ev)}
    >
      <i class="fas fa-hourglass-half" />
    </a>
    <a
      class="rest long-rest"
      title={localize('T5EK.RestL')}
      on:click={(ev) => $store.longRest(ev)}
    >
      <i class="fas fa-hourglass-end" />
    </a>
  </div>
</div>

<style lang="scss">
  .rest-container {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 25;
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

    &:hover {
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

      &:hover {
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

    .resting:not(:hover) {
      background: transparent;
      box-shadow: none;
      border-color: transparent;
    }
  }
</style>
