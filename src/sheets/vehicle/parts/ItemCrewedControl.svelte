<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from 'src/components/item-list/controls/ItemControl.svelte';

  export let item: Item5e;
  export let ctx: any;
</script>

<ItemControl
  iconCssClass="fas fa-user-alt {ctx?.toggleClass}"
  title={ctx?.toggleTitle}
  active={ctx?.toggleClass === 'active'}
  on:click={(ev) =>
    item.update({
      ['system.crewed']: !item.system.crewed,
    })}
/>
