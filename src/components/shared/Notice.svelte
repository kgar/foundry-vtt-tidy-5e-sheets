<script lang="ts">
  export let cssClass: string | null = null;
</script>

<div class="notice {cssClass}">
  <slot />
</div>

<style lang="scss">
  .notice {
    display: block;
    background: var(--t5e-warning-accent);
    padding: 0.625rem;
    font-size: 0.75rem;
    color: var(--t5e-background);
    border-radius: 0.3125rem;
  }
</style>
