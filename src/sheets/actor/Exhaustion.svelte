<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorSheetContext,
    PortraitCharmRadiusClass,
  } from 'src/types/types';
  import { createEventDispatcher, getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let cssClass: string = '';
  export let radiusClass: PortraitCharmRadiusClass;
  export let level: number;
  export let onlyShowOnHover: boolean = false;
  export let exhaustionLocalizationPrefix: string = 'T5EK.Exhaustion';

  const localize = FoundryAdapter.localize;

  let context = getContext<Readable<ActorSheetContext>>('context');

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

  const exhaustionSeverity = [
    'severity-0',
    'severity-1',
    'severity-1',
    'severity-2',
    'severity-2',
    'severity-3',
    'severity-3',
  ];
</script>

<div
  class="exhaustion-container {exhaustionSeverity[level]} {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
>
  
  <div class="exhaustion-wrap {radiusClass}">
    <div
      class="exhaustion-icon colorized"
      title={`${localize('DND5E.Exhaustion')} ${localize(
        'DND5E.AbbreviationLevel'
      )} ${level}, ${localize(exhaustionLocalizationPrefix + level)}`}
    >
      <i class={exhaustionClasses[level] ?? ''} />
    </div>
    <ul class="exhaustion-levels">
      {#each [0, 1, 2, 3, 4, 5, 6] as levelOption}
        <li>
          <button
            type="button"
            class="exhaustion-level-option transparent-button"
            class:colorized={levelOption <= level}
            title={localize(exhaustionLocalizationPrefix + levelOption)}
            on:click={() => dispatch('levelSelected', { level: levelOption })}
            disabled={!$context.owner}
          >
            {levelOption}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  <div class="level-display" class:colorized={level > 0}>
    {level}
  </div>
</div>

<style lang="scss">
  .exhaustion-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 2.125rem;
    width: 2.125rem;
    z-index: 1;
    color: var(--t5ek-icon-font-color);

    .level-display {
      display: block;
      width: 1rem;
      height: 1rem;
      line-height: 0.875rem;
      text-align: center;
      font-size: 0.875rem;
      position: absolute;
      background: var(--t5ek-icon-background);
      box-shadow: 0 0 0.5rem var(--t5ek-icon-shadow-color) inset;
      border: 1px solid var(--t5ek-icon-outline-color);
      top: -0.125rem;
      left: -0.125rem;
      border-radius: 50%;
      font-weight: 700;
    }

    &:hover .exhaustion-wrap,
    .exhaustion-wrap:has(button:focus-visible) {
      width: 10.875rem;
    }

    .exhaustion-wrap {
      height: 2.125rem;
      width: 2.125rem;
      overflow: hidden;
      transition: width 0.3s ease;
      background: var(--t5ek-icon-background);
      display: flex;
      box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5ek-icon-outline-color);

      &.rounded {
        border-radius: 1.25rem;
      }

      .exhaustion-icon {
        display: block;
        flex: 0 0 2rem;
        width: 2rem;
        height: 2rem;
        line-height: 2.125rem;
        text-align: center;
        font-size: 1.5rem;
        position: relative;
      }

      .exhaustion-levels {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex: 1;

        li {
          flex: 0 0 1.25rem;
          text-align: center;
          line-height: 2.125rem;
          display: flex;

          .exhaustion-level-option {
            border-radius: 0;

            &:is(:hover, :focus-visible) {
              background: var(--t5ek-tertiary-color);
              color: var(--t5ek-primary-font-color);
            }
          }
        }
      }
    }

    .exhaustion-levels .exhaustion-level-option:not(.colorized) {
      background: var(--t5ek-light-color);
    }

    &.severity-0 .colorized {
      background: transparent;
    }

    &.severity-1 .colorized {
      background: var(--t5ek-exhaustion-severity1-background);
      color: var(--t5ek-exhaustion-severity1-color);
    }

    &.severity-2 .colorized {
      background: var(--t5ek-exhaustion-severity2-background);
      color: var(--t5ek-exhaustion-severity2-color);
    }

    &.severity-3 .colorized {
      background: var(--t5ek-exhaustion-severity3-background);
      color: var(--t5ek-exhaustion-severity3-color);
    }
  }
</style>
