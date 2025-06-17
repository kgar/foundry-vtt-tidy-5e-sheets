<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    disabled?: boolean;
    doc: any;
    deleteFn?: Function;
  }

  let {
    doc,
    disabled,
    deleteFn = () => FoundryAdapter.onActorItemDelete(doc.actor, doc),
  }: Props = $props();
</script>

<a
  class="tidy-table-button"
  data-tooltip={'DND5E.ItemDelete'}
  onclick={() => !disabled && deleteFn()}
>
  <i class="fa-solid fa-trash fa-fw"></i>
</a>
