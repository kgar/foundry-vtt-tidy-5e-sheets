<script lang="ts">
  import type { ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import HpBar from '../../components/bar/HpBar.svelte';

  let context = getContext<Readable<ActorSheetContext>>('context');
</script>

<HpBar percentage={$context.healthPercentage} />
