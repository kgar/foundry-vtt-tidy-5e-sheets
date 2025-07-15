<script lang="ts">
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { PortraitCharmRadiusClass } from 'src/types/types';

  interface Props {
    cssClass?: string;
    radiusClass: PortraitCharmRadiusClass;
    level: number;
    onlyShowOnHover?: boolean;
    isActiveEffectApplied?: boolean;
    onLevelSelected?: (level: number) => void;
  }

  let {
    cssClass = '',
    radiusClass,
    level = $bindable(),
    onlyShowOnHover = false,
    isActiveEffectApplied = false,
    onLevelSelected,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let fontScales = ['1.25rem', '1.125rem', '1rem'] as const;

  let inputFontSize: string = $derived(
    !level || level < 100
      ? fontScales[0]
      : level < 1000
        ? fontScales[1]
        : fontScales[2],
  );
</script>

<div
  class="exhaustion-container {cssClass}"
  class:only-show-on-hover={onlyShowOnHover}
  title={localize('TIDY5E.WorldSettings.Exhaustion.Header')}
  style="--t5e-exhaustion-input-font-size: {inputFontSize}"
>
  <div class="exhaustion-wrap {radiusClass}">
    <input
      type="number"
      onchange={() => onLevelSelected?.(level)}
      bind:value={level}
      placeholder="0"
      {@attach InputAttachments.selectOnFocus}
      disabled={isActiveEffectApplied}
      data-tooltip={isActiveEffectApplied
        ? localize('DND5E.ActiveEffectOverrideWarning')
        : null}
    />
  </div>
</div>

<style lang="scss">
  .exhaustion-container {
    position: absolute;
    top: 0;
    left: 0;
    height: 2.125rem;
    width: 2.125rem;
    color: var(--t5e-icon-font-color);

    .exhaustion-wrap {
      height: 2.125rem;
      width: 2.125rem;
      overflow: hidden;
      background: var(--t5e-icon-background);
      display: flex;
      align-items: center;
      box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
      border: 0.0625rem solid var(--t5e-icon-outline-color);

      &.rounded {
        border-radius: 1.25rem;
      }

      input {
        height: 100%;
        width: 100%;
        text-align: center;
        font-size: var(--t5e-exhaustion-input-font-size);
        border-radius: 1.25rem;
        color: var(--t5e-tertiary-color);
        transition: color 0.3s ease;
        font-family: var(--t5e-title-font-family);

        &:focus {
          color: var(--t5e-primary-font-color);
        }
      }
    }
  }
</style>
