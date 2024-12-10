<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ContextPrimitive } from 'src/features/reactivity/reactivity.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getContext, type Snippet } from 'svelte';

  interface Props {
    item: any;
    imgUrlOverride?: string | undefined;
    disabled?: boolean;
    showDiceIconOnHover?: boolean;
    afterRollButton?: Snippet;
  }

  let {
    item,
    imgUrlOverride = undefined,
    disabled = false,
    showDiceIconOnHover = true,
    afterRollButton,
  }: Props = $props();

  const showRoll = getContext<ContextPrimitive<boolean> | undefined>(
    CONSTANTS.CONTEXT_GRID_CELL_HOVER,
  );

  let buttonIsFocused = $state(false);
</script>

<div
  class="item-image"
  class:item-use-button-has-focus={buttonIsFocused}
  style="background-image: url('{imgUrlOverride ?? item.img}')"
  class:show-roll={!disabled && showRoll?.value}
  class:conceal={item.system.identified === false}
>
  <div
    role="presentation"
    aria-hidden="true"
    class="unidentified-glyph no-transition"
    class:conceal={item.system.identified === false}
    class:hidden={showRoll?.value}
  >
    <i class="fas fa-question"></i>
  </div>
  {#if !disabled}
    <button
      type="button"
      class="item-use-button icon-button"
      onclick={(event) => FoundryAdapter.actorTryUseItem(item, event)}
      oncontextmenu={(event) =>
        FoundryAdapter.onActorItemButtonContextMenu(item, { event })}
      onfocusin={() => (buttonIsFocused = true)}
      onfocusout={() => (buttonIsFocused = false)}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_USE_COMMAND}
      tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
    >
      <i class="fa fa-dice-d20" class:invisible={!showDiceIconOnHover}></i>
    </button>
  {/if}
  {@render afterRollButton?.()}
</div>

<style lang="scss">
  .item-image {
    position: relative;
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

        &.invisible {
          visibility: hidden;
        }
      }

      &:is(:global(:hover, :focus-visible)) i {
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
