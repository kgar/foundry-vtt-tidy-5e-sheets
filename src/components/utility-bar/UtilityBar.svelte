<script lang="ts">
</script>

<section class="utility-bar">
  <slot />
</section>

<style lang="scss">
  .utility-bar {
    display: flex;
    gap: 0.5rem;
    padding-right: 0.25rem;
    align-items: center;
    border-bottom: 0.0625rem solid var(--t5ek-separator-color);
    margin-left: -1rem;
    margin-right: -0.25rem;
    padding-left: 1rem;
    padding-right: 1.75rem;
    padding-bottom: 0.25rem;
    margin-bottom: 0.25rem;
  }
</style>
