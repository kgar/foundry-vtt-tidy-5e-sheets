<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let iconCssClass: string;
  export let title: string | undefined = undefined;
  export let active = true;

  const dispatcher = createEventDispatcher();
</script>

<a
  class="item-control"
  class:inactive={!active}
  on:click|preventDefault|stopPropagation={() => dispatcher('click')}
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

    &.inactive {
      color: var(--t5e-light-color);

      &:hover {
        color: var(--t5e-primary-color);
      }
    }

    &:hover {
      color: var(--t5e-primary-color);
    }
  }
</style>
