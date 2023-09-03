<script lang="ts">
  export let text: string;
  export let elementType: string = 'p';
</script>

<svelte:element this={elementType} class="notice">
  {text}
</svelte:element>

<style lang="scss">
  .notice {
    display: block;
    background: var(--t5ek-warning-accent-color);
    padding: 0.625rem;
    font-size: 0.75rem;
    color: var(--t5ek-background);
    border-radius: 0.3125rem;
    margin-bottom: 0.5rem;
  }
</style>
