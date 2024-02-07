<script lang="ts">
  export let expanded: boolean = true;
</script>

<div class="expandable" class:expanded role="presentation">
  <slot />
</div>

<style lang="scss">
  .expandable {
    display: grid;
    grid-template-rows: 0fr;

    &.expanded {
      grid-template-rows: 1fr;
    }

    transition: grid-template-rows 0.2s ease;

    // Problem: it's not animating when opening.
    &:not(.expanded) {
      :global(> *) {
        overflow-y: hidden;
      }
    }
  }
</style>
