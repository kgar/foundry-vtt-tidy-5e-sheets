<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import AttunementSummaryTooltip from 'src/tooltips/AttunementSummaryTooltip.svelte';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const localize = FoundryAdapter.localize;

  $: attunedItems = $context.items
    .filter((i) => i.system.attuned)
    .sort((a, b) => a.name.localeCompare(b.name));

  let attunementSummaryTooltip: AttunementSummaryTooltip;

  function showAttunementSummaryTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
  ): any {
    if (!attunedItems.length) {
      return;
    }

    game.tooltip.activate(event?.currentTarget, {
      text: attunementSummaryTooltip.getMarkup(),
      cssClass: 'tidy5e-sheet',
    });
  }
</script>

<div class="hidden">
  <AttunementSummaryTooltip
    bind:this={attunementSummaryTooltip}
    {attunedItems}
  />
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="attuned-items-counter"
  class:overattuned={$context.actor.system.attributes.attunement.value >
    $context.actor.system.attributes.attunement.max}
  data-tooltip-direction="UP"
  on:mouseover={(ev) => showAttunementSummaryTooltip(ev)}
>
  <i class="attunement-icon fas fa-sun" />
  <span class="attuned-items-current" title={localize('TIDY5E.AttunementItems')}
    >{$context.system.attributes.attunement.value}</span
  >
  /
  {#if $context.editable && FoundryAdapter.userIsGm()}
    <NumberInput
      selectOnFocus={true}
      document={$context.actor}
      field="system.attributes.attunement.max"
      cssClass="attuned-items-max"
      value={$context.system.attributes.attunement.max}
      placeholder="0"
      title={localize('TIDY5E.AttunementMax')}
      disabled={!$context.editable || $context.lockSensitiveFields}
    />
  {:else}
    <span class="attuned-items-max" title={localize('TIDY5E.AttunementMax')}
      >{$context.system.attributes.attunement.max}</span
    >
  {/if}
</div>

<style lang="scss">
  .attuned-items-counter {
    display: flex;
    align-items: center;
    margin-left: 0.1875rem;
    padding-left: 0.625rem;
    border-radius: 0.3125rem;
    background: var(--t5e-faint-color);

    .attunement-icon {
      color: var(--t5e-primary-accent-color);
    }

    &.overattuned {
      animation: overflowing-with-arcane-power 2s infinite;
    }

    @keyframes overflowing-with-arcane-power {
      0% {
        box-shadow: 0 0 0 0 var(--t5e-primary-accent-color);
      }
      100% {
        box-shadow: 0 0 0 0.375rem rgba(0, 0, 0, 0);
      }
    }

    span {
      font-size: 1rem;
    }

    i {
      opacity: 0.6;
      font-size: 1.25rem;
      margin-right: 0.3125rem;
      margin-left: 0.0625rem;
    }

    :global(.attuned-items-max) {
      width: 1.5rem;
    }

    :global(input) {
      font-size: 1rem;
      font-family: var(--t5e-body-font-family);
    }
  }
</style>
