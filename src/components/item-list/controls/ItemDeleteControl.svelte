<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  type OnDelete = () => boolean;

  export let item: any;
  export let onDelete: OnDelete = () => true;
  export let deleteFn: Function = () =>
    FoundryAdapter.onActorItemDelete(item.actor, item);

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-trash fa-fw"
  class={$$restProps.class ?? ''}
  onclick={() => onDelete() && deleteFn()}
  title={localize('DND5E.ItemDelete')}
/>
