<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  type OnDelete = () => boolean;

  export let item: any;
  export let onDelete: OnDelete = () => true;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-trash fa-fw"
  on:click={() =>
    onDelete() && FoundryAdapter.onActorItemDelete(item.actor, item)}
  title={localize('DND5E.ItemDelete')}
/>
