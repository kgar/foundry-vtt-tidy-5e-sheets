<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { CharacterSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  $: hitDice = $context.system.attributes.hd;
  $: actorLevel = $context.system.details.level;

  const localize = FoundryAdapter.localize;
</script>

<div
  class="portrait-hd"
  class:rounded={$context.useRoundedPortraitStyle}
  title="{localize('DND5E.HitDice')}: {hitDice}/{actorLevel}&#10;{localize(
    'DND5E.HitDiceConfig',
  )}"
>
  <button
    type="button"
    class="current-hd config-button transparent-button"
    on:click={$context.editable &&
      FoundryAdapter.renderActorHitDiceConfig($context.actor)}
    disabled={!$context.editable}
    tabindex={!$settingStore.useDefaultSheetHpTabbing &&
    $settingStore.useAccessibleKeyboardSupport
      ? 0
      : -1}
  >
    {hitDice}
  </button>
</div>

<style lang="scss">
  .portrait-hd {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 2.125rem;
    height: 2.125rem;
    background: var(--t5ek-icon-background);
    box-shadow: 0 0 0.625rem var(--t5ek-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5ek-icon-outline-color);
    border-radius: 0.3125rem 0 0.3125rem 0;
    color: var(--t5ek-icon-font-color);

    &.rounded {
      bottom: -0.4375rem;
      border-radius: 50%;
    }

    .current-hd {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      font-family: var(--t5ek-title-font-family);
      font-size: 1.25rem;
      font-weight: 700;
      border-radius: 50%;
      color: var(--t5ek-icon-font-color);
    }
  }
</style>
