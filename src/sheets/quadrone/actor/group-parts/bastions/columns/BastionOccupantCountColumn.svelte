<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FacilityOccupantSlotLabelsMap } from 'src/features/facility/facility';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { FacilityOccupancyContext } from 'src/types/types';
  import type OccupantSummaryTooltip from 'src/tooltips/OccupantSummaryTooltip.svelte';
  import { getContext } from 'svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  interface Props {
    occupancy: FacilityOccupancyContext;
  }

  let { occupancy }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getGroupSheetQuadroneContext());

  // Share a single tooltip instance across all cells
  const getOccupantSummaryTooltip = getContext<
    () => OccupantSummaryTooltip | undefined
  >(CONSTANTS.SVELTE_CONTEXT.OCCUPANT_SUMMARY_TOOLTIP);

  // A full facility has nowhere to put another occupant. The sheet re-checks
  // ownership before it writes anything.
  let canAddOccupant = $derived(
    context.editable && occupancy.occupants.length < occupancy.max,
  );

  function showOccupantTooltip(
    ev: Event & { currentTarget: EventTarget & HTMLElement },
  ) {
    getOccupantSummaryTooltip?.()?.tryShow(
      ev as MouseEvent & { currentTarget: EventTarget & HTMLElement },
      occupancy.occupants,
      localize(FacilityOccupantSlotLabelsMap[occupancy.slot]),
      // Hang the tooltip off the whole cell rather than the hovered number.
      ev.currentTarget.closest<HTMLElement>('.tidy-table-cell'),
    );
  }
</script>

{#if occupancy.max > 0}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    role="button"
    tabindex={0}
    class={['bastion-occupancy', { interactive: canAddOccupant }]}
    data-tooltip-direction="RIGHT"
    data-occupant-slot={occupancy.slot}
    data-action={canAddOccupant ? 'addMemberFacilityOccupant' : undefined}
    onmouseover={showOccupantTooltip}
    onfocus={showOccupantTooltip}
    {@attach InputAttachments.triggerClickOnKeydown}
  >
    <span class="value font-data-medium">{occupancy.occupants.length}</span
    ><span class="separator color-text-lightest">&sol;</span><span
      class="max font-label-medium color-text-lighter">{occupancy.max}</span
    >
  </div>
{:else}
  <!-- Basic facilities have no slots and will always use this. -->
  <span class="color-text-lightest">&mdash;</span>
{/if}
