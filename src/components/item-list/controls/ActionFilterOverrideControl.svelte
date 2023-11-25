<script lang="ts">
  import type { Item5e } from 'src/types/item';
  import ItemControl from './ItemControl.svelte';
  import { isItemInActionList } from 'src/actions/actions';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: Item5e;

  $: active = isItemInActionList(item);

  let title: string;
  $: {
    const flagValue = FoundryAdapter.tryGetFlag(item, 'action-filter-override');
    const titleKey =
      flagValue === true
        ? 'T5EK.Actions.OverriddenSetOverrideFalse'
        : flagValue === false
          ? 'T5EK.Actions.OverriddenSetOverrideTrue'
          : isItemInActionList(item)
            ? 'T5EK.Actions.SetOverrideFalse'
            : 'T5EK.Actions.SetOverrideTrue';

    title = localize(titleKey);
  }

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-fist-raised"
  {active}
  {title}
  on:click={(ev) =>
    ev.shiftKey
      ? FoundryAdapter.unsetFlag(item, 'action-filter-override')
      : FoundryAdapter.toggleActionFilterOverride(item)}
/>
