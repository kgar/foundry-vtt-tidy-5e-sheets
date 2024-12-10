<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  type OnDelete = () => boolean;

  interface Props {
    item: any;
    onDelete?: OnDelete;
    deleteFn?: Function;
    [key: string]: any;
  }

  let {
    item,
    onDelete = () => true,
    deleteFn = () => FoundryAdapter.onActorItemDelete(item.actor, item),
    ...rest
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-trash fa-fw"
  class={rest.class ?? ''}
  onclick={() => onDelete() && deleteFn()}
  title={localize('DND5E.ItemDelete')}
/>
