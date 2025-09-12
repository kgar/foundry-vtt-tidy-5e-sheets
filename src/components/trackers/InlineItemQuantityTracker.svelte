<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import InlineQuantityTracker from './InlineQuantityTracker.svelte';
  import { processInputChangeDeltaFromValues } from 'src/utils/form';

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
  onchange={async (ev) => {
    const input = ev.currentTarget;

    await item.update({
      [field]: processInputChangeDeltaFromValues(
        ev.currentTarget.value,
        quantity,
      ),
    });

    input.value = quantity;
  }}
  value={quantity}
/>
