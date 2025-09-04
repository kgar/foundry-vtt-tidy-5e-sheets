<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    disabled?: boolean;
    doc: any;
    deleteFn?: Function;
    tooltip?: string;
  }

  let {
    doc,
    disabled,
    deleteFn = () => FoundryAdapter.onActorItemDelete(doc.actor, doc),
    tooltip = FoundryAdapter.localize('DND5E.ItemDelete'),
  }: Props = $props();
</script>

<a
  class="tidy-table-button"
  aria-label={tooltip}
  data-tooltip
  onclick={() => !disabled && deleteFn()}
>
  <i class="fa-solid fa-trash fa-fw"></i>
</a>
