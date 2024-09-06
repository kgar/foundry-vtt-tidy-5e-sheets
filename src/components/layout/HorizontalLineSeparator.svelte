<script lang="ts">
  export let borderColor: 'faint' | 'light' | 'separator' = 'faint';
</script>

<div
  aria-hidden="true"
  role="presentation"
  class="horizontal-line-separator {borderColor} {$$restProps.class ?? ''}"
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
    background: var(--t5e-separator-color);
  }

  .separator {
    background: var(--t5e-separator-color);
  }
</style>
