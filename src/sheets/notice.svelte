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
    background: var(--t5e-warning-accent);
    padding: 10px;
    font-size: 12px;
    color: var(--t5e-background);
    border-radius: 5px;
    margin-bottom: 8px;
  }
</style>
