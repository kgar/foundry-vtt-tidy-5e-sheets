<script lang="ts">
  import type { ActiveEffect5e } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
  }

  let { effect }: Props = $props();
</script>

<a
  class="tidy-table-button"
  title={effect.disabled ? 'DND5E.EffectEnable' : 'DND5E.EffectDisable'}
  onclick={() => effect.update({ disabled: !effect.disabled })}
>
  <i
    class="fas"
    class:fa-check={effect.disabled}
    class:fa-times={!effect.disabled}
  ></i>
</a>
