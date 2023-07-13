<script lang="ts">
  import { FoundryAdapter, type Actor5e } from 'src/foundry/foundry-adapter';

  export let dataset: any;
  export let actor: Actor5e;

  const localize = FoundryAdapter.localize;

  function createItem() {
    return FoundryAdapter.createItem(dataset, actor);
  }
</script>

<a on:click={createItem} title={localize('DND5E.FeatureAdd')} role="button">
  <i class="fas fa-plus-circle" />
  {localize('DND5E.Add')}
</a>
