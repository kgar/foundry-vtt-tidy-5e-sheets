<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher<{ click: MouseEvent }>();
</script>

<div
  role="button"
  on:click={(event) => dispatcher('click', event)}
  tabindex="0"
  class="item-name"
>
  <slot />
</div>

<style lang="scss">
  .item-name {
    flex: 1 1 1px;
    display: flex;
    align-items: center;
  }
</style>
