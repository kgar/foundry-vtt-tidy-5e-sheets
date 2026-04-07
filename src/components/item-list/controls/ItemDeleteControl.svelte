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

  let { item, onDelete = () => true, ...rest }: Props = $props();

  const localize = FoundryAdapter.localize;

  const canDelete = $derived(onDelete());

  const attributes = $derived(
    canDelete
      ? {
          'data-action': 'deleteDocument',
          'data-uuid': item.uuid,
        }
      : {},
  );
</script>

<ItemControl
  iconCssClass="fas fa-trash fa-fw"
  class={rest.class ?? ''}
  title={localize('DND5E.ItemDelete')}
  attributes={attributes}
/>
