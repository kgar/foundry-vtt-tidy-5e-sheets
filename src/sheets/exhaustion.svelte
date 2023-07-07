<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { PortraitCharmRadiusClass } from 'src/types/types';
  import { createEventDispatcher } from 'svelte';

  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;
  export let level: number;
  export let onlyShowOnHover: boolean = false;

  const localize = FoundryAdapter.localize;

  const dispatch = createEventDispatcher<{
    levelSelected: { level: number };
  }>();

  const exhaustionClasses = [
    ''
  ]
</script>

<div
  class="exhaustion-container level-{level} has-note {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
>
  <div class="level-display">
    {level}
  </div>
  <div class="exhaustion-wrap {radiusClass}">
    <div
      class="exhaustion-icon"
      data-tooltip={localize(`T5EK.Exhaustion${level}`)}
    >
      <!-- <i
          class="far"
          class:fa-grin={context.system.attributes.exhaustion === 0}
          class:fa-smile={context.system.attributes.exhaustion === 1}
          class:fa-meh={context.system.attributes.exhaustion === 2}
          class:fa-frown={context.system.attributes.exhaustion === 3}
          class:fa-frown-open={context.system.attributes.exhaustion === 4}
          class:fa-tired={context.system.attributes.exhaustion === 5}
          class:fa-dizzy={context.system.attributes.exhaustion === 6}
        /> -->
      <!-- TODO: Simplify with a more direct approach -->
      <i class="far fa-grin" />
      <i class="far fa-smile" />
      <i class="far fa-meh" />
      <i class="far fa-frown" />
      <i class="far fa-frown-open" />
      <i class="far fa-tired" />
      <i class="far fa-dizzy" />
    </div>
    <ul class="exhaust-level">
      {#each [0, 1, 2, 3, 4, 5, 6] as levelOption}
        <li
          data-tooltip={localize(`T5EK.Exhaustion${levelOption}`)}
          on:click={() => dispatch('levelSelected', { level: levelOption })}
        >
          {levelOption}
        </li>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  .exhaustion-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 34px;
    width: 34px;
    z-index: 50;
    color: var(--t5e-icon-font);

    &.only-show-on-hover > * {
      visibility: hidden;
    }

    &.only-show-on-hover:hover > * {
      visibility: visible;
    }
  }

  .exhaustion-container .level-display {
    display: block;
    width: 16px;
    height: 16px;
    line-height: 14px;
    text-align: center;
    font-size: 14px;
    position: absolute;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 8px var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);
    top: -2px;
    left: -2px;
    border-radius: 50%;
    z-index: 1;
    font-weight: 700;
  }

  .exhaustion-wrap {
    height: 34px;
    width: 34px;
    overflow: hidden;
    transition: width 0.3s ease;
    background: var(--t5e-icon-background);
    display: flex;
    box-shadow: 0 0 10px var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);
  }

  .exhaustion-wrap.rounded {
    border-radius: 1.25rem;
  }

  .exhaustion-container:hover .exhaustion-wrap {
    width: 10.875rem;
  }

  .exhaustion-wrap .exhaustion-icon {
    display: block;
    flex: 0 0 32px;
    width: 32px;
    height: 32px;
    line-height: 34px;
    text-align: center;
    font-size: 24px;
    position: relative;
  }

  .exhaustion-wrap .exhaust-level {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex: 1;
  }

  .exhaustion-wrap .exhaust-level li {
    flex: 0 0 1.25rem;
    text-align: center;
    line-height: 34px;
    cursor: pointer;
    background: var(--t5e-light-color);
  }

  .exhaustion-wrap .exhaust-level li:hover {
    background: var(--t5e-tertiary-color) !important;
    color: var(--t5e-primary-font);
  }

  // # exhaustion effect note #

  .exhaustion-container .exhaustion-icon i {
    display: none;
  }

  // # exhaustion color coding #

  .exhaustion-container.level-0 .exhaust-level li:nth-of-type(1) {
    background: transparent;
  }

  .exhaustion-container.level-0 .exhaustion-icon i:nth-child(1) {
    display: inline-block;
  }

  .exhaustion-container:not(.level-):not(.level-0) .exhaustion-icon {
    color: var(--t5e-exhaustion-font);
  }

  .exhaustion-container:not(.level-):not(.level-0) .exhaustion-icon,
  .exhaustion-container.level-1 .exhaust-level li:nth-of-type(-n + 2),
  .exhaustion-container.level-2 .exhaust-level li:nth-of-type(-n + 3) {
    color: var(--t5e-exhaustion-font);
    background: var(--t5e-exhaustion-lvl1);
  }

  .exhaustion-container.level-1 .exhaustion-icon i:nth-child(2) {
    display: inline-block;
  }

  .exhaustion-container.level-2 .exhaustion-icon i:nth-child(3) {
    display: inline-block;
  }

  .exhaustion-container:not(.level-):not(.level-0):not(.level-1):not(.level-2)
    .exhaustion-icon,
  .exhaustion-container.level-3 .exhaust-level li:nth-of-type(-n + 4),
  .exhaustion-container.level-4 .exhaust-level li:nth-of-type(-n + 5) {
    background: var(--t5e-exhaustion-lvl2);
  }

  .exhaustion-container.level-3 .exhaustion-icon i:nth-child(4) {
    display: inline-block;
  }

  .exhaustion-container.level-4 .exhaustion-icon i:nth-child(5) {
    display: inline-block;
  }

  .exhaustion-container:not(.level-):not(.level-0):not(.level-1):not(
      .level-2
    ):not(.level-3):not(.level-4)
    .exhaustion-icon,
  .exhaustion-container.level-5 .exhaust-level li:nth-of-type(-n + 6),
  .exhaustion-container.level-6 .exhaust-level li:nth-of-type(-n + 7) {
    background: var(--t5e-exhaustion-lvl3);
  }

  .exhaustion-container.level-5 .exhaustion-icon i:nth-child(6) {
    display: inline-block;
  }

  .exhaustion-container.level-6 .exhaustion-icon i:nth-child(7) {
    display: inline-block;
  }

  .exhaustion-container:not(.level-):not(.level-0) .level-display {
    color: var(--t5e-exhaustion-font);
    background: var(--t5e-exhaustion-lvl1);
  }

  .exhaustion-container:not(.level-):not(.level-0):not(.level-1):not(.level-2)
    .level-display {
    background: var(--t5e-exhaustion-lvl2);
  }

  .exhaustion-container:not(.level-):not(.level-0):not(.level-1):not(
      .level-2
    ):not(.level-3):not(.level-4)
    .level-display {
    background: var(--t5e-exhaustion-lvl3);
  }
</style>
