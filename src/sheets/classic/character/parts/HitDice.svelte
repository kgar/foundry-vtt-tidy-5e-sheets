<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getCharacterSheetContext());

  let hitDice = $derived(context.system.attributes.hd);
  let actorLevel = $derived(context.system.details.level);

  const localize = FoundryAdapter.localize;
</script>

<div
  class="portrait-hd"
  class:rounded={context.useRoundedPortraitStyle}
  title="{localize('DND5E.HitDice')}: {hitDice}/{actorLevel}&#10;{localize(
    'DND5E.HitDiceConfig',
  )}"
>
  <button
    type="button"
    class="current-hd config-button transparent-button"
    onclick={context.editable &&
      FoundryAdapter.renderHitDiceConfig(context.actor)}
    disabled={!context.editable}
    tabindex={!settings.value.useDefaultSheetHpTabbing &&
    settings.value.useAccessibleKeyboardSupport
      ? 0
      : -1}
  >
    {hitDice}
  </button>
</div>

<style lang="less">
  .portrait-hd {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 2.125rem;
    height: 2.125rem;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 0.625rem var(--t5e-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5e-icon-outline-color);
    border-radius: 0.3125rem 0 0.3125rem 0;
    color: var(--t5e-icon-font-color);

    &.rounded {
      bottom: -0.4375rem;
      border-radius: 50%;
    }

    .current-hd {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      width: 100%;
      font-family: var(--t5e-title-font-family);
      font-size: 1.25rem;
      font-weight: 700;
      border-radius: 50%;
      color: var(--t5e-icon-font-color);
    }
  }
</style>
