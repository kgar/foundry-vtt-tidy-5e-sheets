<script lang="ts">
  import { getExhaustionIconsWithSeverity } from 'src/features/exhaustion/exhaustion';
  import type {
    SpecificExhaustionConfig,
    IconWithSeverity,
  } from 'src/features/exhaustion/exhaustion.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ActorSheetContextV1,
    PortraitCharmRadiusClass,
  } from 'src/types/types';
  import { coalesce } from 'src/utils/formatting';

  interface Props {
    cssClass?: string;
    radiusClass: PortraitCharmRadiusClass;
    level: number;
    onlyShowOnHover?: boolean;
    exhaustionConfig: SpecificExhaustionConfig;
    isActiveEffectApplied: boolean;
    onLevelSelected?: (level: number) => void;
  }

  let {
    cssClass = '',
    radiusClass,
    level,
    onlyShowOnHover = false,
    exhaustionConfig,
    isActiveEffectApplied,
    onLevelSelected,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let iconsWithSeverities: IconWithSeverity[] = $derived.by(() => {
    return getExhaustionIconsWithSeverity(exhaustionConfig.levels);
  });

  let selectedLevel: IconWithSeverity | null = $derived(
    iconsWithSeverities[level] ?? iconsWithSeverities.at(-1),
  );

  let severityClass: string = $derived(
    `severity-${selectedLevel?.severity ?? 0}`,
  );

  let context = $derived(getSheetContext<ActorSheetContextV1>());

  let exhaustionOptionWidthRems = 1.25;

  let exhaustionExpandedWidth = $derived(
    `${exhaustionOptionWidthRems * (exhaustionConfig.levels + 1) + 2.125}rem`,
  );
</script>

<div
  class="exhaustion-container {severityClass} {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
  style="--t5e-exhaustion-expanded-width: {exhaustionExpandedWidth}"
>
  <div class="exhaustion-wrap {radiusClass}">
    <div
      class="exhaustion-icon colorized"
      title={exhaustionConfig.hints[level] ??
        localize('TIDY5E.ExhaustionLevelTooltip', { level: level })}
    >
      <i class={selectedLevel.iconCssClass ?? ''}></i>
    </div>
    <ul class="exhaustion-levels">
      {#each iconsWithSeverities as _, i}
        <li>
          <button
            type="button"
            class="exhaustion-level-option transparent-button"
            class:colorized={i <= level}
            title={localize(
              coalesce(
                exhaustionConfig.hints[i],
                'TIDY5E.ExhaustionLevelTooltip',
              ),
              { level: i },
            )}
            onclick={() => onLevelSelected?.(i)}
            disabled={!context.editable || isActiveEffectApplied}
            tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            data-tooltip={isActiveEffectApplied
              ? localize('DND5E.ActiveEffectOverrideWarning')
              : null}
          >
            {i}
          </button>
        </li>
      {/each}
    </ul>
  </div>
  <div class="level-display" class:colorized={level > 0}>
    {level}
  </div>
</div>

<style lang="less">
  .exhaustion-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 2.125rem;
    width: 2.125rem;
    z-index: 1;
    color: var(--t5e-icon-font-color);

    .level-display {
      display: block;
      width: 1rem;
      height: 1rem;
      line-height: 0.875rem;
      text-align: center;
      font-size: 0.875rem;
      position: absolute;
      background: var(--t5e-icon-background);
      box-shadow: 0 0 0.5rem var(--t5e-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5e-icon-outline-color);
      top: -0.125rem;
      left: -0.125rem;
      border-radius: 50%;
      font-weight: 700;
    }

    &:hover .exhaustion-wrap,
    .exhaustion-wrap:has(:global(button:focus-visible)) {
      width: var(--t5e-exhaustion-expanded-width);
    }

    .exhaustion-wrap {
      height: 2.125rem;
      width: 2.125rem;
      overflow: hidden;
      transition: width 0.3s ease;
      background: var(--t5e-icon-background);
      display: flex;
      box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5e-icon-outline-color);

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
            width: 100%;
            border-radius: 0;

            &:is(:global(:hover, :focus-visible)) {
              background: var(--t5e-tertiary-color);
              color: var(--t5e-primary-font-color);
            }
          }
        }
      }
    }

    .exhaustion-levels .exhaustion-level-option:not(.colorized) {
      background: var(--t5e-light-color);
    }

    &.severity-0 .colorized {
      background: transparent;
    }

    &.severity-1 .colorized {
      background: var(--t5e-exhaustion-severity1-background);
      color: var(--t5e-exhaustion-severity1-color);
    }

    &.severity-2 .colorized {
      background: var(--t5e-exhaustion-severity2-background);
      color: var(--t5e-exhaustion-severity2-color);
    }

    &.severity-3 .colorized {
      background: var(--t5e-exhaustion-severity3-background);
      color: var(--t5e-exhaustion-severity3-color);
    }
  }
</style>
