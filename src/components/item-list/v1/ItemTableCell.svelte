<script lang="ts">
  import { type Snippet } from 'svelte';

  interface Props {
    baseWidth?: string | undefined;
    primary?: boolean;
    cssClass?: string;
    title?: string | undefined;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    baseWidth = undefined,
    primary = false,
    cssClass = '',
    title = undefined,
    children,
    ...rest
  }: Props = $props();
</script>

<div
  class="item-table-cell {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
  {title}
  {...rest.attributes}
>
  {@render children?.()}
</div>

<style lang="scss">
  .item-table-cell {
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-family: var(--t5e-body-font-family);
    min-height: 1.5rem;
    color: var(--t5e-secondary-color);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;

    &.primary {
      flex: 1 1 0.0625rem;
      align-items: stretch; // e.g., provide plenty of room to tap / click the primary item cell to show summary.
      justify-content: initial;
      color: var(--t5e-primary-color);
    }

    &:not(.primary) {
      border-left: 0.0625rem solid var(--t5e-faintest-color);
    }
  }
</style>
