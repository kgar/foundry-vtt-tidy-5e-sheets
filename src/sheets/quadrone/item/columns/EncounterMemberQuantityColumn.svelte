<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { EncounterMemberQuadroneContext } from 'src/types/types';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, EncounterMemberQuadroneContext> = $props();
</script>

<!-- {#if unlocked} -->
<!-- <TextInputQuadrone
  class="uninput"
  tooltip="Quantity roll formula"
  /> -->
<!-- {/if} -->
<span class="font-label-large color-text-default"
  >{rowDocument.quantity.value}</span
>
