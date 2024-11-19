<script lang="ts">
  import type { Actor5e } from 'src/types/types';

  export let actor: Actor5e | undefined;
  export let index: number;
  export let type: string;
</script>

<!-- TODO: When unlocked, include overlay with left/right click for context menu with options Edit and "Remove from {FacilityName}" -->
<!-- TODO: When Svelte 5, inline into Bastion tab as snippet -->
{#if actor}
  {@const imageTypeClassName = actor.token ? 'token' : 'portrait'}
  {@const imageSrc =
    imageTypeClassName == 'token' ? actor.token.img : actor.img}
  <div
    data-actor-uuid={actor.uuid}
    class="slot occupant-slot {type} {imageTypeClassName}"
    data-index={index}
  >
    <img src={imageSrc} alt={actor.name} />
  </div>
{:else}
  <div class="slot occupant-slot {type} empty" data-index={index}>
    <i class="far fa-shield"></i>
  </div>
{/if}
