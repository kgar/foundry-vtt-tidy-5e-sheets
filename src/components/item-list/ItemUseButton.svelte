<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let item: any;
  export let imgUrlOverride: string | undefined = undefined;
  export let disabled: boolean = false;

  const showRoll = getContext<Readable<boolean>>(
    CONSTANTS.CONTEXT_GRID_CELL_HOVER,
  );

  let buttonIsFocused = false;
</script>

<div
  class="item-image"
  class:item-use-button-has-focus={buttonIsFocused}
  style="background-image: url('{imgUrlOverride ?? item.img}')"
  class:show-roll={!disabled && $showRoll}
  class:conceal={item.system.identified === false}
>
  <div
    role="presentation"
    aria-hidden="true"
    class="unidentified-glyph no-transition"
    class:conceal={item.system.identified === false}
    class:hidden={$showRoll}
  >
    <i class="fas fa-question" />
  </div>
  {#if !disabled}
    <button
      type="button"
      class="item-use-button icon-button"
      on:click={(event) => FoundryAdapter.actorTryUseItem(item, {}, { event })}
      on:contextmenu={(event) =>
        FoundryAdapter.onActorItemButtonContextMenu(item, { event })}
      on:focusin={() => (buttonIsFocused = true)}
      on:focusout={() => (buttonIsFocused = false)}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
      tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fa fa-dice-d20" />
    </button>
  {/if}
</div>

<style lang="scss">
  .item-image {
    align-self: center;
    flex: 0 0 var(--t5e-image-size-override, 1.5rem);
    height: var(--t5e-image-size-override, 1.5rem);
    background-size: cover;
    background-position: 50% 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border-radius: 0.3125rem 0 0 0.3125rem;
    gap: 0.25rem;

    .item-use-button {
      opacity: 0;

      i {
        color: var(--t5e-tertiary-color);
        font-size: 1.125rem;
      }

      &:is(:hover, :focus-visible) i {
        color: var(--t5e-primary-font-color);
      }
    }

    &.show-roll,
    &.item-use-button-has-focus {
      background-image: none !important; // TODO: Figure out a way to avoid !important

      .item-use-button {
        opacity: 1;
      }
    }

    &.conceal {
      filter: grayscale(100%);
    }

    .unidentified-glyph {
      font-size: calc(var(--t5e-image-size-override, 1.5rem) - 0.75rem);
    }
  }
</style>
