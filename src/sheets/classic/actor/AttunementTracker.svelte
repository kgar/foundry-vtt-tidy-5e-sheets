<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import AttunementSummaryTooltip from 'src/tooltips/AttunementSummaryTooltip.svelte';
  import { Tooltip } from 'src/tooltips/Tooltip';
  import type { Item5e } from 'src/types/item.types';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const localize = FoundryAdapter.localize;

  $: attunedItems = $context.actor.items
    .filter((i: Item5e) => i.system.attuned)
    .sort((a: Item5e, b: Item5e) =>
      a.name.localeCompare(b.name, game.i18n.lang),
    );

  let attunementSummaryTooltip: AttunementSummaryTooltip;

  function showAttunementSummaryTooltip(
    event: MouseEvent & { currentTarget: EventTarget & HTMLDivElement },
  ): any {
    if (!attunedItems.length) {
      return;
    }

    Tooltip.show(event?.currentTarget, attunementSummaryTooltip.getMarkup());
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
  class="attunement-tracker {$$restProps.class ?? ''}"
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
