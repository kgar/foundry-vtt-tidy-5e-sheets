<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<a
  class="item-control"
  on:click={() => item.deleteDialog()}
  title={localize('DND5E.ItemDelete')}
  role="button"
>
  <i class="fas fa-trash fa-fw" />
</a>
