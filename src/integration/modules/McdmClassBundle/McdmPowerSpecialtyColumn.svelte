<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import Dnd5eIcon from 'src/components/icon/Dnd5eIcon.svelte';

  let { rowDocument }: ColumnCellProps = $props();

  let powerSpecialtiesConfig = $derived(
    CONFIG.MCDM.specialties[rowDocument.system.specialty],
  );
</script>

{#if powerSpecialtiesConfig?.icon}
  <span class="power-specialty-icon" data-tooltip={powerSpecialtiesConfig.label}>
    <Dnd5eIcon src={powerSpecialtiesConfig.icon} />
  </span>
{:else}
  <span class="color-text-disabled">—</span>
{/if}