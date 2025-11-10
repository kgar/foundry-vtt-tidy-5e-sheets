<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="rest-container"
  class:has-rounded-portrait={context.useRoundedPortraitStyle}
  title={localize('TIDY5E.RestHint')}
>
  <div class="resting">
    <span class="resting-icon">
      <i class="rest-icon fas fa-bed"></i>
    </span>
    <button
      type="button"
      class="rest short-rest inline-icon-button"
      title={localize('TIDY5E.ShortRest')}
      onclick={() =>
        context.actor.shortRest({
          chat: settings.value.showNpcRestInChat,
        })}
      disabled={!context.editable}
      tabindex={!settings.value.useDefaultSheetHpTabbing &&
      settings.value.useAccessibleKeyboardSupport
        ? 0
        : -1}
    >
      <i class="fas fa-hourglass-half"></i>
    </button>
    <button
      type="button"
      class="rest long-rest inline-icon-button"
      title={localize('TIDY5E.LongRest')}
      onclick={() =>
        context.actor.longRest({
          chat: settings.value.showNpcRestInChat,
        })}
      disabled={!context.editable}
      tabindex={!settings.value.useDefaultSheetHpTabbing &&
      settings.value.useAccessibleKeyboardSupport
        ? 0
        : -1}
    >
      <i class="fas fa-hourglass-end"></i>
    </button>
  </div>
</div>

<style lang="less">
  .rest-container {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
  }

  .resting {
    width: 1.5rem;
    height: 1.25rem;
    border-radius: 0 0 0 0.3125rem;
    overflow: hidden;
    transition: width 0.3s ease;
    background: var(--t5e-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);
    color: var(--t5e-icon-font-color);

    &:hover,
    &:focus-within {
      width: 5.875rem;
    }

    .rest {
      flex: 0 0 1.875rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 1.875rem;
      height: 1.125rem;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      color: var(--t5e-tertiary-color);
      padding: 0;
      font-size: 0.75rem;
      line-height: 1.125rem;
      font-family: var(--t5e-body-font-family);
      font-weight: 700;
      transition:
        color 0.3s ease,
        transform 0.3s ease;

      &:hover,
      &:focus-within {
        color: var(--t5e-primary-font-color);
      }
    }

    .resting-icon {
      flex: 0 0 1.5rem;
      display: flex;

      width: 1.5rem;
      height: 1.125rem;
      margin-right: 0.5rem;
      justify-content: center;
      align-items: center;
      border-radius: 0;
      font-size: 0.75rem;
      color: var(--t5e-primary-font-color);
    }
  }

  .rest-container.has-rounded-portrait {
    left: 0.4375rem;
    bottom: 0;

    .resting {
      border-radius: 0.3125rem 0 0 0.3125rem;
      transition: all 0.3s ease;
    }

    .resting:not(:is(:hover, :focus-within)) {
      background: transparent;
      box-shadow: none;
      border-color: transparent;
    }
  }
</style>
