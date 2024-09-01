<script lang="ts">
  import { getContext } from 'svelte';
  import ActorPortrait from './ActorPortrait.svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';

  export let useHpOverlay: boolean;
  export let size: 'medium' | 'small' = 'medium';

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="actor-profile-wrap" class:small-profile={size === 'small'}>
  <div class="profile" class:round-portrait={$context.useRoundedPortraitStyle}>
    <ActorPortrait actor={$context.actor} {useHpOverlay} />
    <slot />
  </div>
</div>
