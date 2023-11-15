<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: any;
  export let imgUrlOverride: string | undefined = undefined;

  const showRoll = getContext<Readable<boolean>>(
    CONSTANTS.CONTEXT_GRID_CELL_HOVER
  );

  let buttonIsFocused = false;
</script>

<div
  class="item-image"
  class:item-use-button-has-focus={buttonIsFocused}
  style="background-image: url('{imgUrlOverride ?? item.img}')"
  class:show-roll={item.isOwner && $showRoll}
>
  {#if item.isOwner}
    <button
      type="button"
      class="item-use-button icon-button"
      on:click={(event) => item.use({}, { event })}
      on:focusin={() => (buttonIsFocused = true)}
      on:focusout={() => (buttonIsFocused = false)}
    >
      <i class="fa fa-dice-d20" />
    </button>
  {/if}
</div>

<style lang="scss">
  .item-image {
    flex: 0 0 1.5rem;
    height: 1.5rem;
    background-size: cover;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 0.3125rem 0 0 0.3125rem;
    gap: 0.25rem;

    .item-use-button {
      opacity: 0;

      i {
        color: var(--t5ek-tertiary-color);
        font-size: 1.125rem;
      }

      &:is(:hover, :focus-visible) i {
        color: var(--t5ek-primary-font-color);
      }
    }

    &.show-roll,
    &.item-use-button-has-focus {
      background-image: none !important; // TODO: Figure out a way to avoid !important

      .item-use-button {
        opacity: 1;
      }
    }
  }
</style>
