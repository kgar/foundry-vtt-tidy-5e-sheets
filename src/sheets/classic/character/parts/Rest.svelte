<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="rest-container" class:rounded={context.useRoundedPortraitStyle}>
  <div class="resting">
    <span class="resting-icon" title={localize('TIDY5E.RestHint')}
      ><i class="rest-icon fas fa-bed"></i></span
    >
    <button
      type="button"
      class="rest icon-button"
      title={localize('TIDY5E.ShortRest')}
      onclick={() => context.actor.shortRest()}
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
      class="rest icon-button"
      title={localize('TIDY5E.LongRest')}
      onclick={() => context.actor.longRest()}
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
    position: absolute;
    left: 0;
    bottom: 0;

    &.rounded {
      bottom: -0.4375rem;

      .resting {
        border-radius: 1.25rem;
      }
    }

    .resting {
      &:is(:global(:hover)),
      &:has(:global(button:focus-visible)) {
        width: 6.875rem;
      }
    }
  }

  .resting {
    width: 2.125rem;
    height: 2.125rem;
    overflow: hidden;
    border-radius: 0 0.3125rem 0 0.3125rem;
    transition: width 0.3s ease;
    background: var(--t5e-icon-background);
    display: flex;
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);
    color: var(--t5e-icon-font-color);

    .resting-icon {
      flex: 0 0 2rem;
      display: flex;
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      font-size: 1rem;
    }

    .rest {
      flex: 0 0 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      font-size: 1.125rem;
      line-height: 2rem;
      font-weight: 700;
    }
  }
</style>
