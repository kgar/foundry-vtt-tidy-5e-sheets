<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';

  export let dataset: any;
  export let actor: Actor5e;
  export let create: (() => void) | undefined = defaultCreateFunction;

  const localize = FoundryAdapter.localize;

  function defaultCreateFunction() {
    return FoundryAdapter.createItem(dataset, actor);
  }
</script>

<button
  type="button"
  class="item-list-footer-button"
  on:click={create}
  title={localize('DND5E.FeatureAdd')}
>
  <i class="fas fa-plus-circle" />
  {localize('DND5E.Add')}
</button>
