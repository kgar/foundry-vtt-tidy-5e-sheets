<script lang="ts">
  import type { Snippet } from 'svelte';
  import UnidentifiedNotice from './UnidentifiedNotice.svelte';

  interface Props {
    conceal: boolean;
    children?: Snippet;
  }

  let { conceal, children }: Props = $props();
</script>

<div
  role="presentation"
  class="concealing-parent concealed-content-animation-container"
>
  <div role="presentation" class:conceal-content={conceal} inert={conceal}>
    {@render children?.()}
  </div>
  {#if conceal}
    <UnidentifiedNotice />
  {/if}
</div>

<style lang="less">
  .concealing-parent {
    flex: 1;
    position: relative;
  }
</style>
