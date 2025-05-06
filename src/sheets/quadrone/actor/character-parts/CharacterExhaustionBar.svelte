<script lang="ts">
  interface Props {
    exhaustionLevel: number;
    onExhaustionLevelSet?: (level: number) => void;
    onClose?: () => void;
  }

  let { exhaustionLevel, onExhaustionLevelSet, onClose }: Props = $props();

  // TODO: Do we want to support Tidy's variable exhaustion levels feature? I know some users use it.
  let levels = 6 + 1;
</script>

<div class="exhaustion-bar flexrow">
  {#each Array(levels) as _, i}
    <button
      aria-label="Exhaustion level {i}"
      type="button"
      class={[
        'button button-borderless button-icon-only button-config',
        { active: i === exhaustionLevel },
      ]}
      onclick={() => {
        onExhaustionLevelSet?.(i);
        onClose?.();
      }}
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
