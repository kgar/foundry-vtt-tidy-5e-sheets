<script lang="ts">
  import Checkbox from 'src/components/form/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    PortraitCharmRadiusClass,
    VehicleSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<VehicleSheetContext>>('context');

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
    document={$context.actor}
    field="flags.{CONSTANTS.MODULE_ID}.motion"
    checked={motion}
    disabled={!$context.owner}
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
      color: var(--t5ek-vehicle-motion-hover-color);
      text-shadow: 0 0 0.3125rem
        var(--t5ek-vehicle-motion-text-shadow-hover-color);
    }
  }

  .motion-1 {
    :global(label) {
      color: var(--t5ek-activated-profile-toggle-color);
      text-shadow: 0 0 0.625rem var(--t5ek-vehicle-in-motion-text-shadow-color);
      background: var(--t5ek-vehicle-in-motion-background);
    }

    :global(label i) {
      color: var(--t5ek-activated-profile-toggle-color);
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
