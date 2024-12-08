<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  interface Props {
    item: any;
    [key: string]: any;
  }

  let { item, ...rest }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-edit fa-fw {rest.class ?? ''}"
  class={rest.class ?? ''}
  title={localize('DND5E.ItemEdit')}
  onclick={() => item.sheet.render(true)}
/>
