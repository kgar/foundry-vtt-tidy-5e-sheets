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
    'far fa-grin',
    'far fa-smile',
    'far fa-meh',
    'far fa-frown',
    'far fa-frown-open',
    'far fa-tired',
    'far fa-dizzy',
  ];

  const exhaustionIntensity = [
    'intensity-0',
    'intensity-1',
    'intensity-1',
    'intensity-2',
    'intensity-2',
    'intensity-3',
    'intensity-3',
  ];
</script>

<div
  class="exhaustion-container {exhaustionIntensity[level]} {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
>
  <div class="level-display" class:colorized={level > 0}>
    {level}
  </div>
  <div class="exhaustion-wrap {radiusClass}">
    <div
      class="exhaustion-icon colorized"
      data-tooltip={`${localize('DND5E.Exhaustion')} ${localize(
        'DND5E.AbbreviationLevel'
      )} ${level}, ${localize('T5EK.Exhaustion' + level)}`}
    >
      <i class={exhaustionClasses[level] ?? ''} />
    </div>
    <ul class="exhaust-level">
      {#each [0, 1, 2, 3, 4, 5, 6] as levelOption}
        <li
          class:colorized={levelOption <= level}
          data-tooltip={`${localize('DND5E.Exhaustion')} ${localize(
            'DND5E.AbbreviationLevel'
          )} ${levelOption}, ${localize('T5EK.Exhaustion' + levelOption)}`}
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

    .level-display {
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

    &:hover .exhaustion-wrap {
      width: 10.875rem;
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

      &.rounded {
        border-radius: 1.25rem;
      }

      .exhaustion-icon {
        display: block;
        flex: 0 0 32px;
        width: 32px;
        height: 32px;
        line-height: 34px;
        text-align: center;
        font-size: 24px;
        position: relative;
      }

      .exhaust-level {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex: 1;

        li {
          flex: 0 0 1.25rem;
          text-align: center;
          line-height: 34px;
          cursor: pointer;

          &:hover {
            background: var(--t5e-tertiary-color) !important;
            color: var(--t5e-primary-font);
          }
        }
      }
    }

    .exhaust-level li:not(.colorized) {
      background: var(--t5e-light-color);
    }

    &.intensity-0 .colorized {
      background: transparent;
    }

    &.intensity-1 .colorized {
      background: var(--t5e-exhaustion-lvl1);
    }

    &.intensity-2 .colorized {
      background: var(--t5e-exhaustion-lvl2);
      // TODO: Promote to --t5e-exhaustion-lvl2-foreground / or find a good contrasting color in the existing variables
      color: rgba(255, 255, 255, 0.7);
    }

    &.intensity-3 .colorized {
      background: var(--t5e-exhaustion-lvl3);
      // TODO: Promote to --t5e-exhaustion-lvl3-foreground / or find a good contrasting color in the existing variables
      color: rgba(255, 255, 255, 0.7);
    }
  }
</style>
