<script lang="ts">
  import type { FacilityOccupancyContext } from 'src/types/types';
  import OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';

  interface Props {
    occupancy: FacilityOccupancyContext;
    sheetDocument?: any;
    tooltipTitle?: string;
  }

  let { occupancy, sheetDocument, tooltipTitle = '' }: Props = $props();

  let occupantSummaryTooltip = $state<OccupantSummaryTooltip>();

  let showTooltip = $derived(
    !!sheetDocument && !!tooltipTitle && occupancy.occupants.length > 0,
  );

  function showOccupantTooltip(
    ev: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (!showTooltip) {
      return;
    }

    occupantSummaryTooltip!.tryShow(ev, occupancy.occupants, tooltipTitle);
  }
</script>

{#if occupancy.max > 0}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_mouse_events_have_key_events -->
  <span class="bastion-occupancy" onmouseover={showOccupantTooltip}>
    <span class="value font-data-medium">{occupancy.occupants}</span><span
      class="separator color-text-lightest">&sol;</span
    ><span class="max font-label-medium color-text-lighter">{occupancy.max}</span>
  </span>

  {#if sheetDocument}
    <OccupantSummaryTooltip bind:this={occupantSummaryTooltip} {sheetDocument} />
  {/if}
{:else}
  <!-- Basic facilities have no slots and will always use this. -->
  <span class="color-text-lightest">&mdash;</span>
{/if}
