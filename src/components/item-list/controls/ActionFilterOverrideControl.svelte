<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from './ItemControl.svelte';
  import { isItemInActionList, toggleActionFilterOverride } from 'src/features/actions/actions';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: Item5e;

  $: active = isItemInActionList(item);

  let title: string;
  $: {
    const flagValue = FoundryAdapter.tryGetFlag(item, 'action-filter-override');
    const titleKey =
      flagValue === true
        ? 'TIDY5E.Actions.OverriddenSetOverrideFalse'
        : flagValue === false
          ? 'TIDY5E.Actions.OverriddenSetOverrideTrue'
          : isItemInActionList(item)
            ? 'TIDY5E.Actions.SetOverrideFalse'
            : 'TIDY5E.Actions.SetOverrideTrue';

    title = localize(titleKey);
  }

  const localize = FoundryAdapter.localize;
</script>

<ItemControl
  iconCssClass="fas fa-fist-raised"
  {active}
  {title}
  onclick={(ev) =>
    ev.shiftKey
      ? FoundryAdapter.unsetFlag(item, 'action-filter-override')
      : toggleActionFilterOverride(item)}
/>
