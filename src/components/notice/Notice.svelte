<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    cssClass?: string | null;
    children?: Snippet;
  }

  let { cssClass = null, children }: Props = $props();
</script>

<div class="notice {cssClass}">
  {@render children?.()}
</div>

<style lang="less">
  .notice {
    display: block;
    background: var(--t5e-warning-accent-color);
    padding: 0.625rem;
    font-size: 0.75rem;
    color: var(--t5e-warning-accent-contrast-color);
    border-radius: 0.3125rem;
  }
</style>
