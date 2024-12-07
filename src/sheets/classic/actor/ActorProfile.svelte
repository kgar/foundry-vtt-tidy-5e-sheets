<script lang="ts">
  import { type Snippet } from 'svelte';
  import ActorPortrait from './ActorPortrait.svelte';
  import type { ActorSheetContextV1 } from 'src/types/types';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    useHpOverlay: boolean;
    size?: 'medium' | 'small';
    children?: Snippet;
  }

  let { useHpOverlay, size = 'medium', children }: Props = $props();

  let context = getSheetContext<ActorSheetContextV1>();
</script>

<div class="actor-profile-wrap" class:small-profile={size === 'small'}>
  <div class="profile" class:round-portrait={context.useRoundedPortraitStyle}>
    <ActorPortrait actor={context.actor} {useHpOverlay} />
    {@render children?.()}
  </div>
</div>
