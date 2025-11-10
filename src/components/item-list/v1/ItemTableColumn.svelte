<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    primary?: boolean;
    baseWidth?: string | null;
    title?: string | null;
    cssClass?: string | null;
    children?: Snippet;
  }

  let {
    primary = false,
    baseWidth = null,
    title = null,
    cssClass = '',
    children,
  }: Props = $props();
</script>

<div
  class="item-table-column {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  {@render children?.()}
</div>

<style lang="less">
  .item-table-column {
    color: var(--t5e-tertiary-color);
    font-family: var(--t5e-body-font-family);
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
    justify-content: center;

    :global(i) {
      font-size: 0.625rem;
      color: var(--t5e-light-color);
    }

    &.primary {
      color: var(--t5e-primary-font-color);
      font-weight: 700;
      font-size: 0.75rem;
      flex: 1;
      justify-content: flex-start;
    }
  }
</style>
