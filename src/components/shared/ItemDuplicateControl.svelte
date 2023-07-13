<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: any;

  const localize = FoundryAdapter.localize;
</script>

<a
  class="item-control"
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
  role="button"
>
  <i class="fas fa-copy fa-fw" />
</a>
