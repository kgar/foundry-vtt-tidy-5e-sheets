<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    PortraitCharmRadiusClass,
  } from 'src/types/types';
  
  let context = $derived(getCharacterSheetContext());

  interface Props {
    inspired: boolean;
    cssClass?: string;
    radiusClass: PortraitCharmRadiusClass;
    onlyShowOnHover?: boolean;
    animate?: boolean;
  }

  let {
    inspired,
    cssClass = '',
    radiusClass,
    onlyShowOnHover = false,
    animate = true,
  }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div
  class="inspiration inspiration-{inspired ? 1 : 0} {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
  title={localize('DND5E.Inspiration')}
>
  <Checkbox
    checkboxCssClass="inspiration-toggle"
    labelCssClass="{inspired ? 'inspired' : ''} {radiusClass} {context.editable
      ? 'pointer'
      : ''}"
    document={context.actor}
    field="system.attributes.inspiration"
    checked={inspired}
    disabled={!context.editable}
  >
    <i class="inspiration-icon fas fa-dice-d20" class:animate></i>
  </Checkbox>
</div>

<style lang="less">
  .inspiration {
    position: absolute;
    right: 0;
    top: 0;
    width: 2.125rem;
    height: 2.125rem;

    :global(input.inspiration-toggle) {
      display: none;
    }

    :global(label) {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.5rem;
      color: var(--t5e-icon-font-color);
      box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5e-icon-outline-color);
      background: var(--t5e-icon-background);
    }

    :global(label i) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      text-align: center;
      line-height: 2.125rem;
    }

    :global(label:hover) {
      color: var(--t5e-inspiration-hover-color);
      text-shadow: 0 0 0.3125rem var(--t5e-inspiration-text-shadow-hover-color);
    }
  }

  .inspiration-1 {
    :global(label) {
      color: var(--t5e-activated-profile-toggle-color);
      text-shadow: 0 0 0.625rem
        var(--t5e-inspiration-inspired-text-shadow-color);
      background: var(--t5e-inspiration-inspired-background);
    }

    :global(label i.animate) {
      color: var(--t5e-activated-profile-toggle-color);
      animation: glow 5s ease-in-out infinite alternate;
    }
  }

  @keyframes glow {
    0% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.2);
    }
    60% {
      transform: scale(1);
    }
    100% {
      transform: scale(1.1);
    }
  }
</style>
