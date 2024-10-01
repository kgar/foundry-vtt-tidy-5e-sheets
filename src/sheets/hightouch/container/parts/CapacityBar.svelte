<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';
  import type { ContainerCapacityContext } from 'src/types/types';

  export let container: Item5e;
  export let capacity: ContainerCapacityContext;
  export let showLabel = true;

  $: readableValue =
    container.system.capacity.type === CONSTANTS.ITEM_CAPACITY_TYPE_WEIGHT
      ? (capacity.value ?? 0).toFixed(2)
      : Math.ceil(capacity.value ?? 0);

  $: capacityLabel = `${readableValue}/${capacity.max} ${capacity.units}`;

  $: percentage = Math.round(capacity.pct);
  const localize = FoundryAdapter.localize;
</script>

Hello, capacity bar! 🌊
