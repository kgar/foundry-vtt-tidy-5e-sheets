<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div class="rest-container" class:rounded={$context.useRoundedPortraitStyle}>
  <div class="resting">
    <span class="resting-icon" title={localize('TIDY5E.RestHint')}
      ><i class="rest-icon fas fa-bed" /></span
    >
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="rest icon-button"
      title={localize('TIDY5E.ShortRest')}
      on:click={(event) =>
        $context.editable && $context.actor.sheet.onShortRest(event)}
    >
      <i class="fas fa-hourglass-half" />
    </a>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a
      class="rest icon-button"
      title={localize('TIDY5E.LongRest')}
      on:click={(event) =>
        $context.editable && $context.actor.sheet.onLongRest(event)}
    >
      <i class="fas fa-hourglass-end" />
    </a>
  </div>
</div>

<style lang="scss">
  .rest-container {
    position: absolute;
    left: 0;
    bottom: 0;

    &.rounded {
      bottom: -0.4375rem;

      .resting {
        border-radius: 1.25rem;
      }
    }

    .resting {
      &:is(:hover),
      &:has(button:focus-visible) {
        width: 6.875rem;
      }
    }
  }

  .resting {
    width: 2.125rem;
    height: 2.125rem;
    overflow: hidden;
    border-radius: 0 0.3125rem 0 0.3125rem;
    transition: width 0.3s ease;
    background: var(--t5e-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);
    color: var(--t5e-icon-font-color);

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
      font-size: 1.125rem;
      line-height: 2rem;
      font-weight: 700;
    }
  }
</style>
