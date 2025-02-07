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

  const localize = FoundryAdapter.localize;
</script>

<a
  class="tidy-table-button"
  title={localize('DND5E.ItemDelete')}
  onclick={() => !disabled && deleteFn()}
>
  <i class="fa-solid fa-trash fa-fw"></i>
</a>
