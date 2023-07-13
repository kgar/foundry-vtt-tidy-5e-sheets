<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<a
  class="item-control"
  on:click={() => item.sheet.render(true)}
  title={localize('DND5E.ItemEdit')}
  role="button"
>
  <i class="fas fa-edit fa-fw" />
</a>
