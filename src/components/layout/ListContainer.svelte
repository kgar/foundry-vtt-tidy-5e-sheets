<script lang="ts">
  export let cssClass: string = '';
</script>

<div class="list-container {cssClass}">
  <slot />
</div>

<style lang="scss">
  .list-container {
    flex: 1;
    padding: 0 0.5625rem 0.5rem 0;
    overflow-y: scroll;
  }
</style>
