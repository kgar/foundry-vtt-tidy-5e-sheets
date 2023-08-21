<script lang="ts">
  export let cssClass: string | null = null;
  export let mode: 'vertical' | 'horizontal';
</script>

<footer class="tab-footer {cssClass} {mode}">
  <slot />
</footer>

<style lang="scss">
  .tab-footer {
    background-color: var(--t5e-header-background);
    box-shadow: 0 0 0.1875rem 0 var(--t5e-tertiary-color);
    padding: 0.25rem 1.5rem 0.5rem 0.75rem;
    margin: 0 -0.25rem -1rem -1rem;
    border-top: 0.0625rem solid var(--t5e-light-color);
    display: flex;
    gap: 0.25rem;

    &.vertical {
      flex-direction: column;
    }

    &.horizontal {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
