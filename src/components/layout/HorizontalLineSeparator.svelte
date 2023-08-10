<script lang="ts">
  export let borderStyle: 'faint' | 'light' = 'faint';
</script>

<div
  aria-hidden="true"
  role="presentation"
  class="horizontal-line-separator {borderStyle}"
/>

<style lang="scss">
  .horizontal-line-separator {
    height: 0.0625rem;
    flex: 0 0 auto;
  }

  .faint {
    background: var(--t5e-faint-color);
  }

  .light {
    background: var(--t5e-light-color);
  }
</style>
