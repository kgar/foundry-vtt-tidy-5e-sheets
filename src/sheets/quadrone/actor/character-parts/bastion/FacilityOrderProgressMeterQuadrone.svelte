<script lang="ts">
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';
  import { getTidyFacilityIcon } from 'src/features/facility/facility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ChosenFacilityContext } from 'src/types/types';

  interface Props {
    chosen: ChosenFacilityContext;
    showCraftName?: boolean;
    [key: string]: any;
  }

  let { chosen, showCraftName = true, ...rest }: Props = $props();

  let icon = $derived(getTidyFacilityIcon(chosen.progress.order));

  let orderLabel = $derived(
    CONFIG.DND5E.facilities.orders[chosen.progress.order]?.label ??
      chosen.progress.order,
  );

  const localize = FoundryAdapter.localize;
</script>

<div
  class="meter progress facility-progress {rest.class ?? ''}"
  role="meter"
  aria-valuemin="0"
  aria-valuenow={chosen.progress.pct}
  aria-valuetext={chosen.progress.value?.toString()}
  aria-valuemax={chosen.progress.max}
  style="--bar-percentage: {chosen.progress.pct}%"
>
  <div class="label">
    {#if !chosen.disabled}
      <span class="order flex1">
        {#if icon?.type === 'fa-icon-class'}
          <i class={icon.className}></i>
        {:else if icon?.type === 'dnd5e-icon'}
          <Dnd5eIcon src={icon.src}></Dnd5eIcon>
        {/if}
        <span class="progress-meter-label truncate">
          {#if chosen.craft && showCraftName}
            {localize('TIDY5E.Facilities.Progress.OrderAndCraftLabel', {
              orderName: orderLabel,
              craftingItemName: chosen.craft.name,
            })}
          {:else}
            {orderLabel}
          {/if}
        </span>
      </span>
      <span class="counter flexshrink">
        <span class="value font-data-medium">{chosen.progress.value}</span><span class="separator">&sol;</span><span class="max font-label-medium color-text-lighter">{chosen.progress.max}</span>
        <span class="units font-label-medium color-text-lighter lowercase">{localize('DND5E.TimeDay')}</span>
      </span>
    {:else}
      <span class="order">
        {#if icon?.type === 'fa-icon-class'}
          <i class={icon.className}></i>
        {:else if icon?.type === 'dnd5e-icon'}
          <Dnd5eIcon src={icon.src}></Dnd5eIcon>
        {/if}
        <span class="progress-meter-label truncate">
          {orderLabel}
        </span>
      </span>
    {/if}
  </div>
</div>
