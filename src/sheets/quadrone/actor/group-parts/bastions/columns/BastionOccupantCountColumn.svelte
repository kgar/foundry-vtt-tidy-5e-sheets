<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FacilityOccupantSlotLabelsMap } from 'src/features/facility/facility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { FacilityOccupancyContext } from 'src/types/types';
  import type OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import { getContext } from 'svelte';

  interface Props {
    occupancy: FacilityOccupancyContext;
  }

  let { occupancy }: Props = $props();

  const localize = FoundryAdapter.localize;

  // Share a single tooltip instance across all cells
  const getOccupantSummaryTooltip = getContext<
    () => OccupantSummaryTooltip | undefined
  >(CONSTANTS.SVELTE_CONTEXT.OCCUPANT_SUMMARY_TOOLTIP);

  function showOccupantTooltip(
    ev: Event & { currentTarget: EventTarget & HTMLElement },
  ) {
    getOccupantSummaryTooltip?.()?.tryShow(
      ev as MouseEvent & { currentTarget: EventTarget & HTMLElement },
      occupancy.occupants,
      localize(FacilityOccupantSlotLabelsMap[occupancy.slot]),
    );
  }
</script>

{#if occupancy.max > 0}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    role="button"
    tabindex={0}
    class="bastion-occupancy"
    data-tooltip-direction="RIGHT"
    onmouseover={showOccupantTooltip}
    onfocus={showOccupantTooltip}
    onkeydown={(ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        showOccupantTooltip(ev);
      }
    }}
  >
    <span class="value font-data-medium">{occupancy.occupants.length}</span><span
      class="separator color-text-lightest">&sol;</span
    ><span class="max font-label-medium color-text-lighter">{occupancy.max}</span>
  </div>
{:else}
  <!-- Basic facilities have no slots and will always use this. -->
  <span class="color-text-lightest">&mdash;</span>
{/if}
