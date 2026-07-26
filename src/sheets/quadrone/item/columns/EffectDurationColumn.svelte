<script lang="ts">
  import type { ActiveEffectContext } from 'src/types/types';

  type Props = {
    rowContext: ActiveEffectContext;
  };

  let { rowContext }: Props = $props();
</script>

<span class="truncate">
  {rowContext.effect.duration.label ?? ''}
</span>
