<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';

  let localize = FoundryAdapter.localize;

  let context = $derived(getCharacterSheetQuadroneContext());

  let inspirationSource = $derived(context.inspirationSource);

  let inspired = $derived(context.actor.system.attributes.inspiration);

  // TODO: Determine if we can use greensock or something to make a sick animation when inspiration toggles on/off.
</script>

<div
  class="inspiration-badge"
  class:single={!inspirationSource}
  class:stacked={!!inspirationSource}
>
  {#if !inspirationSource}
    <button
      type="button"
      class={[
        'inspiration button button-borderless button-icon-only single',
        { inspired: inspired },
      ]}
      aria-label={localize('DND5E.Inspiration')}
      data-tooltip="DND5E.Inspiration"
      onclick={(ev) =>
        context.actor.update({
          ['system.attributes.inspiration']: !inspired,
        })}
    >
    </button>
  {:else}
    <button
      aria-label="Inspiration"
      type="button"
      class="inspiration button button-borderless button-icon-only stacked"
      class:inspired={inspirationSource.value > 0}
    >
      <span class="level-container">
        <span class="level font-data-medium color-text-inverse">
          {inspirationSource.value}
        </span>
      </span>
    </button>
    <div class="inspiration-controls">
      <button
        type="button"
        class="button button-borderless button-icon-only"
        aria-label="Remove Inspiration"
        disabled={inspirationSource.value === 0}
        onclick={() => inspirationSource.change(-1)}
      >
        <i class="fas fa-hexagon-minus"></i>
      </button>
      <button
        type="button"
        class="button button-borderless button-icon-only"
        aria-label="Add Inspiration"
        disabled={inspirationSource.value === inspirationSource.max}
        onclick={() => inspirationSource.change(1)}
      >
        <i class="fas fa-hexagon-plus"></i>
      </button>
    </div>
  {/if}
</div>

<style lang="scss">
  .inspiration-controls {
    display: none;
  }
  .inspiration-badge:hover {
    .inspiration-controls {
      display: flex;
      position: absolute;
      left: 0;
      bottom: 0.25rem;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      .button.button-borderless {
        --size: 1.5rem;
        min-width: var(--size);
        border-radius: 100%;
        position: relative;
        i {
          font-size: var(--font-size-14);
          position: relative;
        }

        &:hover {
          background-color: transparent;
        }

        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateY(-50%) translateX(-50%);
          background: rgba(0, 0, 0, 0.5);
          width: 1rem;
          height: 1rem;
          border-radius: 100%;
          z-index: -1;
        }
        &:not(:disabled):hover::before {
          width: 1rem;
          height: 1rem;
          background-color: black;
        }

        &:disabled,
        &:disabled:hover {
          background-color: transparent;
          i {
            color: var(--t5e-color-icon-disabled);
            text-shadow: none;
          }
        }
      }
    }
  }
</style>
