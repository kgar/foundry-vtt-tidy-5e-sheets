<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import AttunementSummaryTooltip from 'src/tooltips/AttunementSummaryTooltip.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';

  interface Props {
    [key: string]: any;
  }

  let { ...rest }: Props = $props();

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());
  const localize = FoundryAdapter.localize;

  let attunedItems = $derived(
    context.actor.items
      .filter((i: Item5e) => i.system.attuned)
      .sort((a: Item5e, b: Item5e) =>
        a.name.localeCompare(b.name, game.i18n.lang),
      ),
  );

  let attunementSummaryTooltip: AttunementSummaryTooltip;
</script>

<AttunementSummaryTooltip
  bind:this={attunementSummaryTooltip}
  sheetDocument={context.document}
  {attunedItems}
/>

<div
  class="attunement-tracker {rest.class ?? ''}"
  class:overattuned={context.actor.system.attributes.attunement.value >
    context.actor.system.attributes.attunement.max}
  data-tooltip-direction="UP"
  onmouseover={(ev) => attunementSummaryTooltip.tryShow(ev)}
>
  <i class="attunement-icon fas fa-sun"></i>
  <span class="attuned-items-current" title={localize('TIDY5E.AttunementItems')}
    >{context.system.attributes.attunement.value}</span
  >
  /
  {#if context.editable && FoundryAdapter.userIsGm()}
    <NumberInput
      selectOnFocus={true}
      document={context.actor}
      field="system.attributes.attunement.max"
      cssClass="attuned-items-max"
      value={context.system.attributes.attunement.max}
      placeholder="0"
      title={localize('TIDY5E.AttunementMax')}
      disabled={!context.editable || context.lockSensitiveFields}
    />
  {:else}
    <span class="attuned-items-max" title={localize('TIDY5E.AttunementMax')}
      >{context.system.attributes.attunement.max}</span
    >
  {/if}
</div>
