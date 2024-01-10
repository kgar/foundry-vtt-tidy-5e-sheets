<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';

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
  on:keydown={(ev) => FoundryAdapter.forceKeyboardManagerEvent(false, ev)}
  on:keyup={(ev) => FoundryAdapter.forceKeyboardManagerEvent(true, ev)}
>
  <i class="fas fa-plus-circle" />
  {localize('DND5E.Add')}
</button>
