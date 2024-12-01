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
  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();

  let context = getContext<Readable<CharacterSheetContext | NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
  const localize = FoundryAdapter.localize;

  let attunedItems = $derived(
    $context.actor.items
      .filter((i: Item5e) => i.system.attuned)
      .sort((a: Item5e, b: Item5e) =>
        a.name.localeCompare(b.name, game.i18n.lang),
      ),
  );

  let attunementSummaryTooltip: AttunementSummaryTooltip;

  // kgar-migration-task - does it work as advertized?
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

<div
  class="attunement-tracker {rest.class ?? ''}"
  class:overattuned={$context.actor.system.attributes.attunement.value >
    $context.actor.system.attributes.attunement.max}
  data-tooltip-direction="UP"
  onmouseover={(ev) => showAttunementSummaryTooltip(ev)}
>
  <i class="attunement-icon fas fa-sun"></i>
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
