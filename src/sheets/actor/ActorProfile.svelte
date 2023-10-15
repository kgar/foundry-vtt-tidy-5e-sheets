<script lang="ts">
  import { getContext } from 'svelte';
  import ActorPortrait from './ActorPortrait.svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContext } from 'src/types/types';

  export let useHpOverlay: boolean;

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<div class="profile-wrap">
  <div class="profile" class:round-portrait={$context.useRoundedPortraitStyle}>
    <ActorPortrait actor={$context.actor} {useHpOverlay} />
    <slot />
  </div>
</div>

<style lang="scss">
  .profile-wrap {
    width: 9.375rem;
    position: relative;

    :global(.only-show-on-hover) {
      visibility: hidden;
    }

    &:hover :global(.only-show-on-hover) {
      visibility: visible;
    }
  }

  .profile {
    width: 9.375rem;
    height: 9.375rem;

    &.round-portrait {
      border-radius: 50%;
    }
  }
</style>
