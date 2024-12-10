<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
    ctx: any;
  }

  let { item, ctx }: Props = $props();

  let isAttuned = $derived(item.system.attuned);

  function toggleAttuned() {
    const actor = item.actor;
    if (!actor) {
      return;
    }

    const currentAttunementCount = actor.system.attributes.attunement.value;

    if (item.system.attuned) {
      item.update({ 'system.attuned': false });
    } else {
      if (currentAttunementCount >= actor.system.attributes.attunement.max) {
        ui.notifications.warn(
          `${FoundryAdapter.localize('TIDY5E.AttunementWarning', {
            number: currentAttunementCount,
          })}`,
        );
      } else {
        item.update({ 'system.attuned': true });
      }
    }
  }
</script>

<ItemControl
  title={ctx?.attunement?.title}
  iconCssClass="fas fa-sun {ctx?.attunement?.cls}"
  active={isAttuned}
  onclick={toggleAttuned}
/>
