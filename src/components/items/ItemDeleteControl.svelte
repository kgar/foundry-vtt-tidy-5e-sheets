<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-trash fa-fw"
  on:click={() => item.deleteDialog()}
  title={localize('DND5E.ItemDelete')}
/>
