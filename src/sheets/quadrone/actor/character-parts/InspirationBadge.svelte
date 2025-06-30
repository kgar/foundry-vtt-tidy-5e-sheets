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
  {#if inspirationSource}
    <button
      aria-label="Inspiration"
      type="button"
      class="inspiration button button-borderless button-icon-only stacked"
      class:inspired={inspirationSource.value > 0}
    >
      <span class="inspiration-level">
        <span class="level font-data-large color-text-inverse">
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
    >
    </button>
  {/if}
</div>
