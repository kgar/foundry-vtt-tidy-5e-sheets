<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let cssClass: string = '';

  const dispatcher = createEventDispatcher<{ click: MouseEvent }>();
</script>

<span
  role="button"
  tabindex="0"
  on:click={(event) => dispatcher('click', event)}
  class="item-name truncate {cssClass}"
>
  <slot />
</span>

<style lang="scss">
  .item-name {
    flex: 1 1 1px;
    display: flex;
    align-items: center;
    min-width: 0;
  }
</style>
