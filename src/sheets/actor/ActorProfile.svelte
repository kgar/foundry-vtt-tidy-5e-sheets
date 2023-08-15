<script lang="ts">
  import { getContext } from 'svelte';
  import ActorPortrait from './ActorPortrait.svelte';
  import type { Readable } from 'svelte/store';
  import type { Actor5e } from 'src/types/actor';

  export let useRoundedPortraitStyle: boolean;

  let store = getContext<Readable<{ actor: Actor5e }>>('store');
</script>

<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <ActorPortrait actor={$store.actor} {useRoundedPortraitStyle} />
    <slot />
  </div>
</div>

<style lang="scss">
  .profile-wrap {
    width: 9.375rem;
    position: relative;
  }

  .profile {
    width: 9.375rem;
    height: 9.375rem;

    &.round-portrait {
      border-radius: 50%;
    }
  }
</style>
