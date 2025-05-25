<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ActiveEffect5e } from 'src/types/types';

  interface Props {
    effect: ActiveEffect5e;
  }

  let { effect }: Props = $props();

  let title = $derived(
    FoundryAdapter.localize(
      effect.disabled ? 'DND5E.EffectEnable' : 'DND5E.EffectDisable',
    ),
  );
</script>

<a
  class="tidy-table-button"
  {title}
  onclick={() => effect.update({ disabled: !effect.disabled })}
>
  <i
    class={[
      'fas',
      {
        ['fa-toggle-off']: effect.disabled,
        ['fa-toggle-large-on']: !effect.disabled,
      },
    ]}
  ></i>
</a>
