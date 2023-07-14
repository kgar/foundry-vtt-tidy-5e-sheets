<script lang="ts">
  export let baseWidth: string | undefined = undefined;
  export let primary: boolean = false;
  export let cssClass: string = '';
</script>

<div
  class="item-table-cell {cssClass}"
  class:primary
  style:flex-basis={baseWidth}
>
  <slot />
</div>

<style lang="scss">
  .item-table-cell {
    flex-grow: 0;
    flex-shrink: 0;
    font-size: 0.75rem;
    font-family: var(--t5e-signika);
    height: 1.5rem;
    border-left: 0.0625rem solid var(--t5e-faintest-color);
    color: var(--t5e-secondary-color);
    overflow: hidden;
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: center;
    justify-content: center;

    &.primary {
      flex: 1 1 1px;
      align-items: stretch; // e.g., provide plenty of room to tap / click the primary item cell to show summary.
      justify-content: initial;
    }

    &:hover {
      :global(.item-use-button) {
        background-image: none;
      }
      :global(.item-use-button i) {
        display: initial;
      }
    }
  }
</style>
