<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  export let ctx: any;
  export let item: any;

  function toggleEquipped() {
    const value = FoundryAdapter.getProperty(item, 'system.equipped');

    item.update({
      'system.equipped': !value,
    });
  }
</script>

<ItemControl
  title={ctx?.toggleTitle}
  iconCssClass="fas fa-user-alt"
  active={item.system.equipped}
  onclick={toggleEquipped}
/>
