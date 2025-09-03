<script lang="ts">
  import type { ColumnCellProps } from 'src/runtime/types';
  import type { GroupMemberQuadroneContext } from 'src/types/types';

  let {
    rowDocument,
    rowContext,
  }: ColumnCellProps<any, GroupMemberQuadroneContext> = $props();

  let cargoCount = 75; // TODO: prep cargo count
  let cargoMax = $derived(rowDocument.system.attributes.capacity.cargo);
  let cargoPct = $derived(
    cargoMax === 0 ? 0 : Math.clamp((cargoCount / cargoMax) * 100, 0, 100),
  );
</script>

<div
  class="meter meter-small progress capacity"
  style="--bar-percentage: {cargoPct}%;"
></div>
<div class="flexrow">
  <span class="font-data-large color-text-default">{cargoCount}</span>
  <span class="font-body-medium color-text-lightest separator">/</span>
  <span class="font-label-medium color-text-default">{cargoMax}</span>
</div>
