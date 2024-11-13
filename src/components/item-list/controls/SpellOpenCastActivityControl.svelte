<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';
  import type { Item5e } from 'src/types/item.types';

  export let item: Item5e;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-gear"
  class={$$restProps.class ?? ''}
  onclick={() => item.system.linkedActivity.sheet.render(true)}
  title={localize('DOCUMENT.DND5E.Activity')}
/>
