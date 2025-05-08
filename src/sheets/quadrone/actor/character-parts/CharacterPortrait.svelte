<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import DeathSavesOverlay from './DeathSavesOverlay.svelte'; // Assuming relative path
  import { settings } from 'src/settings/settings.svelte';
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  type Props = {
    imageUrl: string;
    imageAlt: string;
    portraitShape?: string; // e.g., 'transparent', 'round', 'square'
  };

  let { imageUrl, imageAlt, portraitShape = 'transparent' }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let characterIsDead = $derived(
    context.system.attributes?.hp?.value === 0 &&
      context.system.attributes?.hp?.max > 0 &&
      context.system.attributes.death.failure >= 3 &&
      context.system.attributes.death.success < 3,
  );

  // Make portraitShape mutable for the debug button
  let currentPortraitShape = $state(portraitShape);

  const availableShapes = ['transparent', 'round', 'square'];

  function cycleShape() {
    const currentIndex = availableShapes.indexOf(currentPortraitShape);
    const nextIndex = (currentIndex + 1) % availableShapes.length;
    currentPortraitShape = availableShapes[nextIndex];
  }

  function handlePortraitClick(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (context.unlocked) {
      openPortraitPicker(event);
      return;
    }

    FoundryAdapter.renderImagePopout({
      src: context.actor.img,
      window: {
        title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
          subject: context.actor.name,
        }),
      },
      uuid: context.actor.uuid,
    });
  }

  function openPortraitPicker(
    event: MouseEvent & { currentTarget: EventTarget & HTMLElement },
  ) {
    if (!TidyHooks.tidy5eSheetsPreOpenActorPortraitFilePicker(context, event)) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const current = context.actor.img;
    const fp = new foundry.applications.apps.FilePicker({
      type: 'image',
      current,
      callback: (path: string) => {
        context.actor.update({ img: path });
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }
</script>

<!-- TODO: Determine if we keep context menu here; some modules rely on it, like Tokenizer. -->
<!-- TODO: Add switch for size if needed -->
<div
  class={['character-image', currentPortraitShape]}
  class:dead={characterIsDead}
  style="position: relative;"
>
  {#if settings.value.truesight}
    <button
      type="button"
      style="position: absolute; top: 2px; right: 2px; z-index: 10; background-color: red; color: white; border: none; padding: 2px 5px; cursor: pointer; border-radius: 3px; font-size: 10px;"
      onclick={cycleShape}
      title="Cycle Portrait Shape (Debug)"
    >
      Shape
    </button>
  {/if}
  <img
    src={imageUrl}
    alt={imageAlt}
    class={['pointer', { dead: characterIsDead }]}
    onclick={(ev) => handlePortraitClick(ev)}
  />
  {#if characterIsDead}
    <div class="dead-overlay"></div>
  {/if}
</div>
{#if context.showDeathSaves}
  <DeathSavesOverlay />
{/if}
