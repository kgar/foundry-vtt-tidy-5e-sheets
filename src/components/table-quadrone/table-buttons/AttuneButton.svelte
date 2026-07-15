<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ContainerItemContext, Item5e } from 'src/types/item.types';
  import type { CharacterItemContext } from 'src/types/types';

  interface Props {
    doc: Item5e;
    ctx: CharacterItemContext | ContainerItemContext;
  }
  let { doc, ctx }: Props = $props();

  function toggleAttuned() {
    const actor = doc.actor;
    if (!actor) {
      return;
    }

    const currentAttunementCount = actor.system.attributes.attunement.value;

    if (doc.system.attuned) {
      doc.update({ 'system.attuned': false });
    } else {
      if (currentAttunementCount >= actor.system.attributes.attunement.max) {
        ui.notifications.warn(
          `${FoundryAdapter.localize('TIDY5E.AttunementWarning', {
            number: currentAttunementCount,
          })}`,
        );
      } else {
        doc.update({ 'system.attuned': true });
      }
    }
  }
</script>

<!-- svelte-ignore a11y_missing_attribute -->
<a
  aria-label={ctx.attunement?.title}
  role="button"
  tabindex="0"
  data-tooltip={ctx.attunement?.title}
  onclick={toggleAttuned}
  class="tidy-table-button"
  onkeydown={(ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      toggleAttuned();
    }
  }}
>
  <i
    class={[
      'fas fa-sun',
      ctx.attunement?.cls,
      {
        'color-text-default': doc.system.attuned,
        'color-text-lightest': !doc.system.attuned,
      },
    ]}
  ></i>
</a>
