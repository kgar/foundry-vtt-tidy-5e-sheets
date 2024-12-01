<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from 'src/components/item-list/controls/ItemControl.svelte';

  interface Props {
    item: Item5e;
    ctx: any;
  }

  let { item, ctx }: Props = $props();
</script>

<ItemControl
  iconCssClass="fas fa-user-alt {ctx?.toggleClass}"
  title={ctx?.toggleTitle}
  active={ctx?.toggleClass === 'active'}
  onclick={() =>
    item.update({
      ['system.crewed']: !item.system.crewed,
    })}
/>
