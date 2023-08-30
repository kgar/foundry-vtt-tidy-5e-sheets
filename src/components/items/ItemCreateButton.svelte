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

<a
  class="item-create-button"
  on:click={create}
  title={localize('DND5E.FeatureAdd')}
  role="button"
>
  <i class="fas fa-plus-circle" />
  {localize('DND5E.Add')}
</a>

<style lang="scss">
  .item-create-button {
    flex: 0 0 7.5rem;
    padding: 0.125rem 1.25rem 0;
    font-size: 0.75rem;
    text-align: center;
    background: var(--t5ek-faintest-color);
    color: var(--t5ek-secondary-color);
    border-radius: 0 0 0.3125rem 0.3125rem;
    font-weight: 400;
    line-height: 1.125rem;

    &:hover {
      background: var(--t5ek-light-color);
    }
  }
</style>
