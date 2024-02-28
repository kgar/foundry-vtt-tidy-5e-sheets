<script lang="ts">
  import UnidentifiedNotice from './UnidentifiedNotice.svelte';

  export let conceal: boolean;
</script>

<div role="presentation" class="obscurable-parent inert-animation-container">
  <div role="presentation" inert={conceal}>
    <slot />
  </div>
  {#if conceal}
    <UnidentifiedNotice />
  {/if}
</div>

<style lang="scss">
  .obscurable-parent {
    flex: 1;
    position: relative;
  }
</style>
