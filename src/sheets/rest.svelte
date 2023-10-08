<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import type { CharacterSheetContext } from 'src/types/types';
    import { getContext } from 'svelte';
    import type { Readable } from 'svelte/store';

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<div class="rest-container" class:rounded={$store.useRoundedPortraitStyle}>
  <div class="resting">
    <span class="resting-icon" title={localize('T5EK.RestHint')}
      ><i class="rest-icon fas fa-bed" /></span
    >
    <a
      class="rest"
      title={localize('T5EK.RestS')}
      on:click={(event) => $store.actor.sheet.onShortRest(event)}
      ><i class="fas fa-hourglass-half" /></a
    >
    <a
      class="rest"
      title={localize('T5EK.RestL')}
      on:click={(event) => $store.actor.sheet.onLongRest(event)}
      ><i class="fas fa-hourglass-end" /></a
    >
  </div>
</div>

<style lang="scss">
  .rest-container {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 25;

    &.rounded {
      bottom: -7px;

      .resting {
        border-radius: 20px;

        &:hover {
          width: 110px;
        }
      }
    }
  }

  .resting {
    width: 2.125rem;
    height: 2.125rem;
    overflow: hidden;
    border-radius: 0 0.3125rem 0 0.3125rem;
    transition: width 0.3s ease;
    background: var(--t5ek-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5ek-icon-outline-color);
    color: var(--t5ek-icon-font-color);

    .resting-icon {
      flex: 0 0 2rem;
      display: flex;
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 1rem;
    }

    .rest {
      flex: 0 0 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      padding: 0;
      font-size: 1.125rem;
      line-height: 2rem;
      font-family: var(--t5ek-body-font-family);
      font-weight: 700;
      transition: color 0.3s ease, transform 0.3s ease;

      &:hover {
        color: var(--t5ek-icon-hover-color);
      }
    }
  }
</style>
