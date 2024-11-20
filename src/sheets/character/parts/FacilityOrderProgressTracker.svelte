<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CharacterSheetRuntime } from 'src/runtime/CharacterSheetRuntime';
  import type {
    ChosenFacilityContext,
  } from 'src/types/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  export let chosen: ChosenFacilityContext;

  function getOrderLabel(order: string) {
    return CONFIG.DND5E.facilities.orders[order]?.label ?? order;
  }

  const localize = FoundryAdapter.localize;
</script>

{#if chosen.progress.max || chosen.executing}
  {@const icon = CharacterSheetRuntime.getTidyFacilityIcon(
    chosen.progress.order,
  )}

  <div class="sub-header">
    {localize('DND5E.FACILITY.FIELDS.order.label')}
  </div>
  <!-- TODO: To Component with TODO about svelte 5 snippets -->
  <div
    class="meter progress"
    role="meter"
    aria-valuemin="0"
    aria-valuenow={chosen.progress.pct}
    aria-valuetext={chosen.progress.value?.toString()}
    aria-valuemax={chosen.progress.max}
    style="--bar-percentage: {chosen.progress.pct}%"
  >
    <div class="label">
      <span class="order">
        {#if icon?.type === 'fa-icon-class'}
          <i class={icon.className}></i>
        {:else if icon?.type === 'dnd5e-icon'}
          <Dnd5eIcon src={icon.src}></Dnd5eIcon>
        {/if}
        {getOrderLabel(chosen.progress.order)}
      </span>
      <span class="counter">
        <span class="value">{chosen.progress.value}</span> &sol;
        <span class="max">{chosen.progress.max}</span>
      </span>
    </div>
    <!-- TODO: Handle showing item image when crafting an item -->
  </div>
{/if}
