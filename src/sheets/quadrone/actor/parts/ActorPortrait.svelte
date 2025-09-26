<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import DeathSavesOverlay from 'src/sheets/quadrone/actor/character-parts/DeathSavesOverlay.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import type { Attachment } from 'svelte/attachments';

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

  let hpRemaining = $derived(
    // we default to have 1 hp out of 1 so that sheets without hp can still animate
    (context.system.attributes?.hp?.value ?? 1) /
      (context.system.attributes?.hp?.max ?? 1),
  );

  let video = $state() as HTMLVideoElement;
  let canvas = $state() as HTMLCanvasElement;
  let ctx = $state() as CanvasRenderingContext2D;

  // We require an off screen canvas to get video frame data
  const bufferCanvas = document.createElement('canvas');
  const bufferContext = bufferCanvas.getContext('2d', {
    alpha: true,
    // optimises frequent reads on our bufferContext
    willReadFrequently: true,
  })!;
  let run = $state(true);

  const attachCanvas: Attachment<HTMLCanvasElement> = (el) => {
    canvas = el;
    ctx = el.getContext('2d', { alpha: true })!;

    // We need to give it moment to enter the frame and have a size
    requestAnimationFrame(() => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      bufferCanvas.width = el.width = width;
      bufferCanvas.height = el.height = height;
    });
  };

  const syncCanvas = () => {
    if (video && canvas && canvas.width) {
      // We need to clear our bufferCanvas for transparent videos
      bufferContext.clearRect(0, 0, canvas.width, canvas.height);

      // Our canvas is a square, we need to render the video within the square
      // For videos that are rectangular, we need to grab a square from
      // within the centre of the video. Therefore the size is the smallest side's length
      const size = Math.min(video.videoWidth, video.videoHeight);
      // The left edge is 50% of the remaining space when we remove hte square
      const x = (video.videoWidth - size) / 2;
      // like wise for the top edge
      const y = (video.videoHeight - size) / 2;
      // we draw the video frame across the entire buffer canvas using our crop
      bufferContext.drawImage(
        video,
        x,
        y,
        size,
        size,
        0,
        0,
        canvas.width,
        canvas.height,
      );

      const img = bufferContext.getImageData(0, 0, canvas.width, canvas.height);
      const data = img.data;

      if (hpRemaining === 0) {
        for (let i = 0; i < data.length; i += 4) {
          // Grayscale (based on human perception of colours)
          // values taken from https://en.wikipedia.org/wiki/Grayscale#Colorimetric_(perceptual_luminance-preserving)_conversion_to_grayscale
          const g =
            data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
          data[i] = g;
          data[i + 1] = g;
          data[i + 2] = g;
        }
      } else if (hpRemaining <= 0.5) {
        // TINT_COLOR defined with hexadecimal for ease
        const TINT_COLOR = 0xbf4d4d;
        // extract the colour components, normalize them between 0-1
        const r = (TINT_COLOR >> 0x10) / 255;
        const g = ((TINT_COLOR >> 0x8) & 0xff) / 255;
        const b = (TINT_COLOR & 0xff) / 255;

        for (let i = 0; i < data.length; i += 4) {
          data[i] *= r;
          data[i + 1] *= g;
          data[i + 2] *= b;
        }
      }

      // replace the imageData of our displayed canvas with our modified imageData
      // This entirely replaces the canvas' content so no clearRect required
      ctx.putImageData(img, 0, 0);
    }

    if (run) requestAnimationFrame(syncCanvas);
  };

  $effect(() => {
    requestAnimationFrame(syncCanvas);
    return () => {
      // Kill the requestAnimationFrame loop
      run = false;
    };
  });

  let playbackRate = $derived.by(() => {
    if (hpRemaining <= 0.5) {
      return hpRemaining / 0.5;
    }
    return 1;
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
      bind:playbackRate
      loop
      style="display:none"
      muted
      playsinline
      disablepictureinpicture
      {@attach (el) => {
        video = el;
      }}
    ></video>
    <canvas
      style="width:100%; height: 100%; aspect-ratio: 1;"
      class={['pointer', { dead: actorIsDead }]}
      data-action={context.unlocked ? 'editImageVideo' : 'showArtwork'}
      data-edit={context.portrait.path}
      title={imageAlt}
      {@attach attachCanvas}>{imageUrl}</canvas
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
