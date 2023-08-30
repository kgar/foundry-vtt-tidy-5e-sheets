<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
    import type { ActorSheetContext } from 'src/types/types';
    import { getContext } from 'svelte';
    import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  export let useRoundedPortraitStyle: boolean;

  const localize = FoundryAdapter.localize;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<div class="rest-container" class:rounded={useRoundedPortraitStyle}>
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
    width: 34px;
    height: 34px;
    overflow: hidden;
    border-radius: 0 5px 0 5px;
    transition: width 0.3s ease;
    background: var(--t5ek-icon-background);
    display: flex;
    box-shadow: 0 0 10px var(--t5ek-icon-shadow) inset;
    border: 1px solid var(--t5ek-icon-outline);
    color: var(--t5ek-icon-font);

    .resting-icon {
      flex: 0 0 32px;
      display: flex;
      width: 32px;
      height: 32px;
      margin-right: 8px;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 16px;
    }

    .rest {
      flex: 0 0 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      padding: 0;
      font-size: 18px;
      line-height: 32px;
      font-family: var(--t5ek-signika);
      font-weight: 700;
      transition: color 0.3s ease, transform 0.3s ease;

      &:hover {
        color: var(--t5ek-icon-hover);
      }
    }
  }
</style>
