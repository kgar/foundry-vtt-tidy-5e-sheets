<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let cssClass: string = '';
  export let hasChildren = true;

  const dispatcher = createEventDispatcher<{ click: MouseEvent }>();
</script>

<span
  role="button"
  tabindex="0"
  on:click={(event) => dispatcher('click', event)}
  class="item-name truncate {cssClass}"
  class:has-children={hasChildren}
>
  <slot />
</span>

<style lang="scss">
  .item-name {
    flex: 1 1 1px;
    min-width: 0;

    &:not(.has-children) {
      align-self: center;
    }
    
    &.has-children {
      display: flex;
      align-items: center;
    }
  }

</style>
