<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import InlineQuantityTracker from './InlineQuantityTracker.svelte';

  interface Props {
    item: Item5e;
    field?: string;
    disabled?: boolean;
  }

  let { item, field = 'system.quantity', disabled = false }: Props = $props();

  let quantity = $derived(
    FoundryAdapter.getProperty<number>(item, field)?.toString() ?? '',
  );

  let localize = FoundryAdapter.localize;
</script>

<InlineQuantityTracker
  aria-label={localize('DND5E.Quantity')}
  data-tooltip="DND5E.Quantity"
  min="0"
  {disabled}
  property={field}
  value={quantity}
/>
