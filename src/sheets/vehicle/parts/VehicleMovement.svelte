<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    PortraitCharmRadiusClass,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  export let motion: boolean;
  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;
  export let disableAnimation: boolean = true;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="motion motion-{motion ? 1 : 0} {cssClass}"
  title={localize(motion ? 'T5EK.VehicleInMotion' : 'T5EK.VehicleMotionless')}
>
  <Checkbox
    checkboxCssClass="motion-toggle"
    labelCssClass="{motion ? 'motion' : ''} {radiusClass}"
    document={$store.actor}
    field="flags.{CONSTANTS.MODULE_ID}.motion"
    dtype="Boolean"
    checked={motion}
  >
    <i
      class="motion-icon fas fa-sailboat"
      class:disable-animation={disableAnimation}
    />
  </Checkbox>
</div>

<style lang="scss">
  .motion {
    position: absolute;
    right: 0;
    top: 0px;
    width: 2.125rem;
    height: 2.125rem;
    z-index: 5;

    &.only-show-on-hover {
      :global(label) {
        visibility: hidden;
      }

      &:hover :global(label) {
        visibility: visible;
      }
    }

    :global(input.motion-toggle) {
      display: none;
    }

    :global(label) {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1.25rem;
      color: var(--t5e-icon-font);
      cursor: pointer;
      box-shadow: 0 0 0.625rem var(--t5e-icon-shadow) inset;
      border: 1px solid var(--t5e-icon-outline);
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
      color: var(--t5e-motion-color-hover);
      text-shadow: 0 0 0.3125rem var(--t5e-motion-text-shadow-hover);
    }
  }

  .motion-1 {
    :global(label) {
      color: var(--t5e-white);
      text-shadow: 0 0 0.625rem var(--t5e-motion-in-motion-text-shadow);
      background: var(--t5e-motion-in-motion-background);
    }

    :global(label i) {
      color: var(--t5e-white);
      animation: boat 5s linear infinite;
    }

    :global(label i.disable-animation) {
      animation: none;
    }
  }

  @keyframes boat {
    0% {
      transform: rotate(0);
    }
    25% {
      transform: rotate(-3deg) translate(1px, 0);
    }
    50% {
      transform: rotate(3deg) translate(1px, 0);
    }
    100% {
      transform: rotate(0);
    }
  }
</style>
