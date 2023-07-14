<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatcher = createEventDispatcher<{ click: MouseEvent }>();
</script>

<div
  role="button"
  tabindex="0"
  on:click={(event) => dispatcher('click', event)}
  class="item-name"
>
  <span class="truncate"><slot /></span>
</div>

<style lang="scss">
  .item-name {
    flex: 1 1 1px;
    display: flex;
    align-items: center;
    min-width: 0;
  }
</style>
