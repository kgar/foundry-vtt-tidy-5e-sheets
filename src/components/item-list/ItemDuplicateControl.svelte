<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-copy fa-fw"
  on:click={() =>
    item.clone(
      {
        name: localize('DOCUMENT.CopyOf', {
          name: item.name,
        }),
      },
      { save: true }
    )}
  title={localize('DND5E.ContextMenuActionDuplicate')}
/>
