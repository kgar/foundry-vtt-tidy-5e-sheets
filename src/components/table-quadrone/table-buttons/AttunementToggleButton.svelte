<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Item5e } from 'src/types/item.types';

  interface Props {
    item: Item5e;
    ctx: any;
  }

  let { item, ctx }: Props = $props();

  let attuned = $derived(item.system.attuned);

  let tooltip = $derived(ctx?.attunement?.title);

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

<a
  class={['tidy-table-button', ctx?.attunement?.cls]}
  data-tooltip={tooltip}
  onclick={toggleAttuned}
>
  {#if attuned}
    <i class="fa-solid fa-sun color-text-highlight highlighted fa-fw"></i>
  {:else}
    <i class="fa-regular fa-sun fa-fw"></i>
  {/if}
</a>
