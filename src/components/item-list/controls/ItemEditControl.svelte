<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-edit fa-fw {$$restProps.class ?? ''}"
  class={$$restProps.class ?? ''}
  title={localize('DND5E.ItemEdit')}
  onclick={() => item.sheet.render(true)}
/>
