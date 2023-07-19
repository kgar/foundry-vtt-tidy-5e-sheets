<script lang="ts">
  export let primary: boolean = false;
  export let baseWidth: string | undefined = undefined;
  export let title: string | undefined = undefined;
</script>

<div
  class="item-table-column"
  class:primary
  style:flex-basis={baseWidth}
  {title}
>
  <slot />
</div>

<style lang="scss">
  .item-table-column {
    color: var(--t5e-tertiary-color);
    font-family: var(--t5e-signika);
    font-size: 0.75rem;
    display: flex;
    flex-direction: row;
    justify-content: center;

    :global(i) {
      font-size: 0.625rem;
      color: var(--t5e-light-color);
    }

    &.primary {
      color: var(--t5e-primary-font);
      font-weight: 700;
      font-size: 0.75rem;
      flex: 1;
      justify-content: flex-start;
    }
  }
</style>
