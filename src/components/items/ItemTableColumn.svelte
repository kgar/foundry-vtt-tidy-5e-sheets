<script lang="ts">
  export let primary: boolean = false;
  export let baseWidth: string | undefined = undefined;
</script>

<div class="item-table-column" class:primary style:flex-basis={baseWidth}>
  <slot />
</div>

<style lang="scss">
  .item-table-column {
    color: var(--t5e-tertiary-color);
    font-family: var(--t5e-signika);
    font-size: 0.75rem;
    text-align: center;

    &.primary {
      color: var(--t5e-primary-font);
      font-weight: 700;
      flex: 1;
      text-align: left;
    }
  }
</style>
