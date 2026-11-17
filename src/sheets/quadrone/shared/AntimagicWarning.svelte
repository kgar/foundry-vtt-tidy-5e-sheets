<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSheetQuadroneContext } from 'src/types/types';
  import type {
    ContainerSheetQuadroneContext,
    ItemSheetQuadroneContext,
  } from 'src/types/item.types';

  interface Props {
    variant: 'subtitle' | 'action-bar';
  }

  let { variant }: Props = $props();

  let context = $derived(
    getSheetContext<
      | ActorSheetQuadroneContext
      | ContainerSheetQuadroneContext
      | ItemSheetQuadroneContext
    >(),
  );

  const localize = FoundryAdapter.localize;
</script>

{#snippet icon()}
  <svg
    class="antimagic-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    aria-hidden="true"
  >
    <path
      fill="currentColor"
      d="M2.925 2.933a1.793 1.793 0 0 1 2.543 0L9.375 6.84A7.22 7.22 0 0 1 14.4 4.8h22.8a3.6 3.6 0 0 1 3.6 3.6V30a3.61 3.61 0 0 1-2.4 3.398v2.467l6.675 6.675a1.793 1.793 0 0 1 0 2.543 1.8 1.8 0 0 1-2.542 0L2.925 5.483a1.793 1.793 0 0 1 0-2.543zm15.57 8.107-.007-.007-.885 1.77-1.508.757 3.96 3.96.758-1.507 1.77-.885a.8.8 0 0 0 0-1.433l-1.77-.885-.885-1.77a.8.8 0 0 0-1.433 0M7.2 36V14.835L25.965 33.6H14.4A2.397 2.397 0 0 0 12 36c0 1.328 1.073 2.4 2.4 2.4h16.365l4.8 4.8H14.4A7.2 7.2 0 0 1 7.2 36m20.94-20.055-1.5 3.495-3.262 1.403 2.662 2.662.6.255.255.6 2.663 2.663 1.402-3.263 3.495-1.5a.716.716 0 0 0 0-1.32l-3.495-1.5-1.5-3.495a.716.716 0 0 0-1.32 0"
    />
  </svg>
{/snippet}

{#if context.antimagic}
  {#if variant === 'subtitle'}
    <span
      class="antimagic-warning antimagic-warning-subtitle"
      data-tooltip={localize('TIDY5E.SHEET.Antimagic.warning')}
    >
      {@render icon()}
      <span class="font-label-medium"
        >{localize('TIDY5E.SHEET.Antimagic.label')}</span
      >
    </span>
    <div class="divider-dot"></div>
  {:else}
    <span
      class="antimagic-warning antimagic-warning-action-bar"
      role="img"
      aria-label={localize('TIDY5E.SHEET.Antimagic.label')}
      data-tooltip={localize('TIDY5E.SHEET.Antimagic.warning')}
    >
      {@render icon()}
    </span>
  {/if}
{/if}

<style>
  .antimagic-warning {
    --warning-color: var(--t5e-color-yellow);
    display: inline-flex;
    align-items: center;
    gap: var(--t5e-size-1x);
    cursor: help;
  }

  .antimagic-icon {
    flex-shrink: 0;
    inline-size: 1rem;
    block-size: 1rem;
  }

  .antimagic-warning-subtitle {
    color: var(--warning-color);
  }

  :global(.theme-light:is(.theme-basic, .item)) .antimagic-warning-subtitle {
    --warning-color: var(--t5e-color-palette-orange-55);
  }

  .antimagic-warning-action-bar {
    background-color: var(--warning-color);
    border: var(--t5e-size-1) solid transparent;
    width: var(--t5e-field-size-default);
    height: var(--t5e-field-size-default);
    border-radius: var(--t5e-size-halfx);
    display: flex;
    align-items: center;
    justify-content: center;

    .antimagic-icon {
      color: var(--t5e-component-card-darker);
    }
  }

  :global(.theme-light) .antimagic-warning-action-bar {
    --warning-color: var(--t5e-color-palette-orange-55);
    border-color: var(--t5e-color-palette-orange-40);
  }
</style>
