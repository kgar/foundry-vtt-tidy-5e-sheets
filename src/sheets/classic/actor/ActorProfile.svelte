<script lang="ts">
  import { getContext, type Snippet } from 'svelte';
  import ActorPortrait from './ActorPortrait.svelte';
  import type { Readable } from 'svelte/store';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    useHpOverlay: boolean;
    size?: 'medium' | 'small';
    children?: Snippet;
  }

  let { useHpOverlay, size = 'medium', children }: Props = $props();

  let context = getContext<Readable<ActorSheetContextV1>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="actor-profile-wrap" class:small-profile={size === 'small'}>
  <div class="profile" class:round-portrait={$context.useRoundedPortraitStyle}>
    <ActorPortrait actor={$context.actor} {useHpOverlay} />
    {@render children?.()}
  </div>
</div>
