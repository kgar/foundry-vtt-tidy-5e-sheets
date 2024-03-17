<script lang="ts" generics="TParam">
  import type { RenderableClassicControl } from 'src/types/types';

  export let controls: RenderableClassicControl<TParam>[];
  export let params: TParam;
</script>

<div class="tidy5e-classic-controls">
  {#each controls as control}
    {#if control.visible === undefined || control.visible(params)}
      <svelte:component this={control.component} {...control.props?.(params)} />
    {:else}
      <span>&nbsp;</span>
    {/if}
  {/each}
</div>

<style lang="scss">
  .tidy5e-classic-controls {
    flex: 1;
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    font-size: 0.75rem;
    gap: 0.125rem;

    :global(> *) {
      flex: 1;
    }
  }
</style>
