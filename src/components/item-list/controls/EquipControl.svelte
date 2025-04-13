<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
    title: string;
    equipped: boolean;
  }

  let { item, title, equipped }: Props = $props();

  function toggleEquipped() {
    const value = FoundryAdapter.getProperty(item, 'system.equipped');

    item.update({
      'system.equipped': !value,
    });
  }
</script>

<ItemControl
  {title}
  iconCssClass="fas fa-user-alt"
  active={equipped}
  onclick={toggleEquipped}
/>
