<script lang="ts">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import DeathSavesOverlay from './DeathSavesOverlay.svelte'; // Assuming relative path
  import { TidyHooks } from 'src/foundry/TidyHooks';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  let context = $derived(getCharacterSheetQuadroneContext());

  let imageUrl = $derived(context.portrait.src);
  let imageAlt = $derived(context.actor.name);

  let characterIsDead = $derived(
    context.system.attributes?.hp?.value === 0 &&
      context.system.attributes?.hp?.max > 0 &&
      context.system.attributes.death.failure >= 3 &&
      context.system.attributes.death.success < 3,
  );

  let currentPortraitShape = $derived(context.portrait.shape);

  const availableShapes = ThemeQuadrone.getActorPortraitShapes();

  function cycleShape() {
    const currentIndex = availableShapes.indexOf(currentPortraitShape);
    const nextIndex = (currentIndex + 1) % availableShapes.length;
    let newShape = availableShapes[nextIndex];

    ThemeQuadrone.updatePortraitShape(context.actor, newShape);
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

  const localize = FoundryAdapter.localize;

  let cyclerTooltip = $derived(
    localize('TIDY5E.ThemeSettings.PortraitShape.title', {
      type: localize(
        `TIDY5E.ThemeSettings.PortraitShape.option.${currentPortraitShape}`,
      ),
    }),
  );
</script>

{#if context.unlocked}
  <button
    type="button"
    class="button button-borderless button-icon-only button-config"
    style="position: absolute; top: 0; right: 0; z-index: 10; border: none; font-size: 14px;"
    onclick={cycleShape}
    data-tooltip={cyclerTooltip}
  >
    {#if currentPortraitShape === 'round'}
      <i class="fas fa-circle-user"></i>
    {:else if currentPortraitShape === 'square'}
      <i class="fas fa-square-user"></i>
    {:else if currentPortraitShape === 'token'}
      <i class="fas fa-circle"></i>
    {:else}
      <i class="fas fa-user"></i>
    {/if}
  </button>
{/if}
<div
  class={['character-image', currentPortraitShape]}
  class:dead={characterIsDead}
  style="position: relative;"
>
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
