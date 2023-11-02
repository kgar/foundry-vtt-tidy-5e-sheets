<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './controls/ItemControl.svelte';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-edit fa-fw"
  title={localize('DND5E.ItemEdit')}
  on:click={() => item.sheet.render(true)}
/>
