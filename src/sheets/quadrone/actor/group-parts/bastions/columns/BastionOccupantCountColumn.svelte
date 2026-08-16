<script lang="ts">
  import type { FacilityOccupancyContext } from 'src/types/types';

  interface Props {
    occupancy: FacilityOccupancyContext;
  }

  let { occupancy }: Props = $props();
</script>

{#if occupancy.max > 0}
  <span class="bastion-occupancy">
    <span class="value font-data-medium">{occupancy.occupants}</span><span
      class="separator color-text-lightest">&sol;</span
    ><span class="max font-label-medium color-text-lighter"
      >{occupancy.max}</span
    >
  </span>
{:else}
  <!-- Basic facilities have no slots and will always use this. -->
  <span class="color-text-lightest">&mdash;</span>
{/if}
