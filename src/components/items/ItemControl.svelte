<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let iconCssClass: string;
  export let title: string | undefined = undefined;

  const dispatcher = createEventDispatcher();
</script>

<a
  class="item-control"
  on:click={() => dispatcher('click')}
  {title}
  role="button"
>
  <i class={iconCssClass} />
</a>

<style lang="scss">
  .item-control {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    color: var(--t5e-secondary-color);

    &:hover {
      color: var(--t5e-primary-color);
    }
  }
</style>
