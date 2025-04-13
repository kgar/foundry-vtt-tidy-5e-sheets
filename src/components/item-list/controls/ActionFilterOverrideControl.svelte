<script lang="ts">
  import type { Item5e } from 'src/types/item.types';
  import ItemControl from './ItemControl.svelte';
  import { isItemInActionList } from 'src/features/actions/actions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  interface Props {
    item: Item5e;
    flagValue: boolean | undefined;
    active: boolean;
  }

  let { item, flagValue, active }: Props = $props();

  const localize = FoundryAdapter.localize;

  let title: string = $derived.by(() => {
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
