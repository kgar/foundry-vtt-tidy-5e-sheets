<script lang="ts">
  import type { Snippet } from 'svelte';
  import UnidentifiedNotice from './UnidentifiedNotice.svelte';

  interface Props {
    conceal: boolean;
    children?: Snippet;
  }

  let { conceal, children }: Props = $props();
</script>

<div role="presentation" class="concealing-parent inert-animation-container">
  <div role="presentation" inert={conceal}>
    {@render children?.()}
  </div>
  {#if conceal}
    <UnidentifiedNotice />
  {/if}
</div>

<style lang="scss">
  .concealing-parent {
    flex: 1;
    position: relative;
  }
</style>
