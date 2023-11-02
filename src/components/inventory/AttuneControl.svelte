<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemControl from '../item-list/ItemControl.svelte';
  import type { Item5e } from 'src/types/item';

  export let item: Item5e;
  export let ctx: any;

  $: isAttuned = item.system.attunement === 2;

  function toggleAttuned() {
    const actor = item.actor;
    if (!actor) {
      return;
    }

    const currentAttunementCount = actor.system.attributes.attunement.value;

    if (item.system.attunement == 2) {
      item.update({ 'system.attunement': 1 });
    } else {
      if (currentAttunementCount >= actor.system.attributes.attunement.max) {
        ui.notifications.warn(
          `${FoundryAdapter.localize('T5EK.AttunementWarning', {
            number: currentAttunementCount,
          })}`
        );
      } else {
        item.update({ 'system.attunement': 2 });
      }
    }
  }
</script>

<ItemControl
  title={ctx.attunement?.title}
  iconCssClass="fas fa-sun {!isAttuned ? 'not-attuned' : ''}"
  active={isAttuned}
  on:click={toggleAttuned}
/>
