<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from '../item-list/controls/ItemControl.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
    prepared: boolean;
    title?: string;
  }

  let { item, prepared, title }: Props = $props();

  function toggleSpellPreparation() {
    let newValue =
      (FoundryAdapter.getProperty<number>(item, 'system.prepared') ?? 0) + 1;

    item.update({
      'system.prepared': newValue % 2,
    });
  }
</script>

<ItemControl
  {title}
  iconCssClass="fas fa-book"
  active={prepared}
  onclick={toggleSpellPreparation}
/>
