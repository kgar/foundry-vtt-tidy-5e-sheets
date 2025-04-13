<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from './ItemControl.svelte';
  import type { Item5e } from 'src/types/item.types';
  import type { ClassValue } from 'svelte/elements';

  interface Props {
    attuned: boolean;
    item: Item5e;
    title?: string;
    class: ClassValue;
  }

  let { item, class: cssClass, title, attuned }: Props = $props();

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
  {title}
  iconCssClass={['fas fa-sun', cssClass]}
  active={attuned}
  onclick={toggleAttuned}
/>
