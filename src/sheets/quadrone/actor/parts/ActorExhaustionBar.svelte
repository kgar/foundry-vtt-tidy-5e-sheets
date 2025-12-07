<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    level: number;
    total: number;
    onExhaustionLevelSet?: (level: number) => void;
    onClose?: () => void;
  }

  let { level, total, onExhaustionLevelSet, onClose }: Props = $props();

  let effectiveTotal = $derived(total + 1);
</script>

<div class="exhaustion-bar flexrow">
  {#each Array(effectiveTotal) as _, i}
    <button
      aria-label={FoundryAdapter.localize('DND5E.ExhaustionLevel', { n: i })}
      type="button"
      class={[
        'button button-borderless button-icon-only button-config',
        { active: i === level },
      ]}
      onclick={() => {
        onExhaustionLevelSet?.(i);
        onClose?.();
      }}
      data-tooltip
    >
      {i}
    </button>
  {/each}
  <button
    aria-label="Close exhaustion bar"
    type="button"
    class="button button-borderless button-icon-only button-config"
    onclick={() => onClose?.()}
  >
    <i class="fas fa-times"></i>
  </button>
</div>
