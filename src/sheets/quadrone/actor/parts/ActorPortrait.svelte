<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import DeathSavesOverlay from 'src/sheets/quadrone/actor/character-parts/DeathSavesOverlay.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let imageUrl = $derived(context.portrait.src);
  let imageAlt = $derived(context.actor.name);

  const actorIsDead = $derived(
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

  const localize = FoundryAdapter.localize;

  let cyclerTooltip = $derived(
    localize('TIDY5E.ThemeSettings.PortraitShape.title', {
      type: localize(
        `TIDY5E.ThemeSettings.PortraitShape.option.${currentPortraitShape}`,
      ),
    }),
  );

  let paused = $state(false);

  $effect(() => {
    paused = actorIsDead;
  });
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
  class={[
    'actor-image',
    currentPortraitShape,
    { dead: actorIsDead, transparent: context.portrait.isVideo },
  ]}
  style="position: relative;"
>
  {#if context.portrait.isVideo}
    <video
      src={imageUrl}
      autoplay
      bind:paused
      loop
      muted
      playsinline
      disablepictureinpicture
      class={['pointer', { dead: actorIsDead }]}
      data-action={context.unlocked ? 'editImageVideo' : 'showArtwork'}
      data-edit={context.portrait.path}
      title={imageAlt}>{imageUrl}</video
    >
  {:else}
    <img
      src={imageUrl}
      alt={imageAlt}
      class={['pointer', { dead: actorIsDead }]}
      data-action={context.unlocked ? 'editImage' : 'showArtwork'}
      data-edit={context.portrait.path}
    />
  {/if}
  {#if actorIsDead}
    <div class="dead-overlay"></div>
  {/if}
</div>
{#if context.showDeathSaves}
  <DeathSavesOverlay />
{/if}
