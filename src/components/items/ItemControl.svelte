<script lang="ts">
  export let iconCssClass: string;
  export let title: string | undefined = undefined;
  export let active = true;
</script>

<button
  type="button"
  class="item-list-button"
  class:inactive={!active}
  on:click
  {title}
>
  <i class={iconCssClass} />
</button>

<style lang="scss">
  .item-list-button {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
  }
</style>
