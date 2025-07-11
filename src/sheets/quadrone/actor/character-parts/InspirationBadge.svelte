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
  data-tidy-sheet-part="inspiration-tracker-container"
>
  {#if inspirationSource}
    {#if inspirationSource.max > 0}
      <button
        aria-label="Inspiration"
        type="button"
        class="inspiration button button-borderless button-icon-only stacked"
        class:inspired={inspirationSource.value > 0}
        data-tidy-sheet-part="banked-inspiration-value"
      >
        <span class="inspiration-level">
          <span class="level font-data-large color-text-inverse">
            {inspirationSource.value}
          </span>
        </span>
      </button>
      <div
        class="inspiration-controls"
        data-tidy-sheet-part="banked-inspiration-controls-container"
      >
        <button
          type="button"
          class="button button-borderless button-icon-only"
          aria-label="Remove Inspiration"
          disabled={inspirationSource.value === 0}
          onclick={() => inspirationSource.change(-1)}
          data-tidy-sheet-part="banked-inspiration-decrementer"
        >
          <i class="fas fa-hexagon-minus"></i>
        </button>
        <button
          type="button"
          class="button button-borderless button-icon-only"
          aria-label="Add Inspiration"
          disabled={inspirationSource.value === inspirationSource.max}
          onclick={() => inspirationSource.change(1)}
          data-tidy-sheet-part="banked-inspiration-incrementer"
        >
          <i class="fas fa-hexagon-plus"></i>
        </button>
      </div>
    {/if}
  {:else}
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
      data-tidy-sheet-part="inspiration-tracker-toggle"
    >
    </button>
  {/if}
</div>
