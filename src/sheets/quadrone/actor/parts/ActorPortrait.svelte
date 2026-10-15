<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import DeathSavesOverlay from 'src/sheets/quadrone/actor/character-parts/DeathSavesOverlay.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type { PortraitShape } from 'src/theme/theme-quadrone.types';
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

  const shapeIcons: Record<PortraitShape, string> = {
    transparent: 'fa-user',
    round: 'fa-circle-user',
    square: 'fa-square-user',
    token: 'fa-circle',
  };

  const localize = FoundryAdapter.localize;

  let editAction = $derived(
    context.portrait.token && context.portrait.isRandom
      ? 'configurePrototypeToken'
      : 'editImage',
  );

  let action = $derived(context.unlocked ? editAction : 'showArtwork');

  let shapeConfigTooltip = $derived(
    localize('TIDY5E.SETTINGS.Theme.PortraitShape.Title', {
      type: localize(
        `TIDY5E.SETTINGS.Theme.PortraitShape.option.${currentPortraitShape}`,
      ),
    }),
  );

  let paused = $state(false);

  $effect(() => {
    paused = actorIsDead;
  });
</script>

<div
  class={[
    'actor-image',
    {'death-saves-open': context.showDeathSaves},
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
      data-action={action}
      data-edit={context.unlocked ? context.portrait.path : null}
      title={imageAlt}>{imageUrl}</video
    >
  {:else}
    <img
      src={imageUrl}
      alt={imageAlt}
      class={['pointer', { dead: actorIsDead }]}
      data-action={action}
      data-edit={context.unlocked ? context.portrait.path : null}
    />
  {/if}
  {#if actorIsDead}
    <div class="dead-overlay"></div>
  {/if}
</div>
{#if context.showDeathSaves}
  <DeathSavesOverlay />
{/if}
{#if context.unlocked}
  <div class="portrait-shape-config">
    <button
      type="button"
      class="button button-borderless button-icon-only button-config"
      data-tooltip={shapeConfigTooltip}
      aria-label={shapeConfigTooltip}
    >
      <i class="fas fa-gear"></i>
    </button>
    <div class="portrait-shape-options" role="group">
      {#each availableShapes as shape (shape)}
        {@const label = localize('TIDY5E.SETTINGS.Theme.PortraitShape.Title', { type: localize('TIDY5E.SETTINGS.Theme.PortraitShape.option.' + shape) })}
        <button
          type="button"
          class={[
            'button button-borderless button-icon-only button-config',
            { active: shape === currentPortraitShape },
          ]}
          aria-pressed={shape === currentPortraitShape}
          aria-label={label}
          data-tooltip={label}
          onclick={() => ThemeQuadrone.updatePortraitShape(context.actor, shape)}
        >
          <i class={['fas', shapeIcons[shape]]}></i>
        </button>
      {/each}
    </div>
  </div>
{/if}
