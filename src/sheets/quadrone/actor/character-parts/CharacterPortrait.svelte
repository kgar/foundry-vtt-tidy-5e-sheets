<script lang="ts">
  import DeathSavesOverlay from './DeathSavesOverlay.svelte'; // Assuming relative path
  import { settings } from 'src/settings/settings.svelte';

  type Props = {
    imageUrl: string;
    imageAlt: string;
    portraitShape?: string; // e.g., 'transparent', 'round', 'square'
    showDeathSaves?: boolean;
  };

  let {
    imageUrl,
    imageAlt,
    portraitShape = 'transparent',
    showDeathSaves = false,
  }: Props = $props();

  // 👋 hightouch - this information will eventually be derived from the `context` object and will automatically update whenever the conditions are right.
  let characterIsDead = $state(false);

  // Make portraitShape mutable for the debug button
  let currentPortraitShape = $state(portraitShape);

  const availableShapes = ['transparent', 'round', 'square'];

  function cycleShape() {
    const currentIndex = availableShapes.indexOf(currentPortraitShape);
    const nextIndex = (currentIndex + 1) % availableShapes.length;
    currentPortraitShape = availableShapes[nextIndex];
  }
</script>

<!-- TODO: Add switch for size if needed -->
<div
  class="character-image {currentPortraitShape}"
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
  <img src={imageUrl} alt={imageAlt} class:dead={characterIsDead} />
  {#if characterIsDead}
    <div class="dead-overlay"></div>
  {/if}
</div>
{#if showDeathSaves}
  <DeathSavesOverlay />
{/if}
