<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from './ItemControl.svelte';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  interface Props {
    item: Item5e;
  }

  let { item }: Props = $props();

  let title: string = $derived.by(() => {
    const flagValue = TidyFlags.actionFilterOverride.get(item);
    const titleKey =
      flagValue === true
        ? 'TIDY5E.Actions.OverriddenSetOverrideFalse'
        : flagValue === false
          ? 'TIDY5E.Actions.OverriddenSetOverrideTrue'
          : isItemInActionList(item)
            ? 'TIDY5E.Actions.SetOverrideFalse'
            : 'TIDY5E.Actions.SetOverrideTrue';

    return localize(titleKey);
  });

  const localize = FoundryAdapter.localize;
  let active = $derived(isItemInActionList(item));
</script>

<ItemControl
  iconCssClass="fas fa-fist-raised"
  {active}
  {title}
  onclick={(ev) =>
    ev.shiftKey
      ? TidyFlags.actionFilterOverride.unset(item)
      : TidyFlags.actionFilterOverride.set(item, !isItemInActionList(item))}
/>
