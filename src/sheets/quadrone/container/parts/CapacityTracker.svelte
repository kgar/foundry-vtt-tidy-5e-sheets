<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  interface Props {
    container: Item5e;
    capacity: ContainerCapacityContext;
    showIcon?: boolean;
  }

  let { container, capacity, showIcon = true }: Props = $props();

  let value = $derived(
    FoundryAdapter.formatNumber((capacity.value ?? 0).toNearest(0.01)),
  );
  
  let max = $derived(
    capacity.max === Infinity
      ? '∞'
      : FoundryAdapter.formatNumber(capacity.max.toNearest(0.01)),
  );
</script>

<div class="label">
  {#if showIcon}
    <i class="fas fa-weight-hanging text-label-icon"></i>
  {/if}
  <span class="value font-weight-label">{value}</span>
  <span class="separator">/</span>
  <span class="max color-text-default">{max}</span>
  {#if capacity.units}
    <span class="units color-text-lightest">{capacity.units}</span>
  {/if}
</div>
