<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    PortraitCharmRadiusClass,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  export let inspired: boolean;
  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;
  export let onlyShowOnHover: boolean = false;
  export let disableAnimation: boolean = true;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="inspiration inspiration-{inspired ? 1 : 0} {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
  title={localize('DND5E.Inspiration')}
>
  <Checkbox
    checkboxCssClass="inspiration-toggle"
    labelCssClass="{inspired ? 'inspired' : ''} {radiusClass}"
    document={$store.actor}
    field="system.attributes.inspiration"
    dtype="Boolean"
    checked={inspired}
  >
    <i
      class="inspiration-icon fas fa-dice-d20"
      class:disable-animation={disableAnimation}
    />
  </Checkbox>
</div>

<style lang="scss">
  .inspiration {
    position: absolute;
    right: 0;
    top: 0px;
    width: 2.125rem;
    height: 2.125rem;
    z-index: 5;

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
      color: var(--t5ek-icon-font-color);
      cursor: pointer;
      box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5ek-icon-outline-color);
      background: var(--t5ek-icon-background);
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
      color: var(--t5ek-inspiration-hover-color);
      text-shadow: 0 0 0.3125rem var(--t5ek-inspiration-text-shadow-hover-color);
    }
  }

  .inspiration-1 {
    :global(label) {
      color: var(--t5ek-activated-profile-toggle-color);
      text-shadow: 0 0 0.625rem var(--t5ek-inspiration-inspired-text-shadow-color);
      background: var(--t5ek-inspiration-inspired-background);
    }

    :global(label i) {
      color: var(--t5ek-activated-profile-toggle-color);
      animation: glow 5s ease-in-out infinite alternate;
    }

    :global(label i.disable-animation) {
      animation: none;
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
