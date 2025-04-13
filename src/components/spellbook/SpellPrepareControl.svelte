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
    const value = FoundryAdapter.getProperty(
      item,
      'system.preparation.prepared',
    );

    item.update({
      'system.preparation.prepared': !value,
    });
  }
</script>

<ItemControl
  {title}
  iconCssClass="fas fa-book"
  active={prepared}
  onclick={toggleSpellPreparation}
/>
