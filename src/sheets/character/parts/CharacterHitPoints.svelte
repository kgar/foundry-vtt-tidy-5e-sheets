<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';
  import HpBar from 'src/components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  export let value: number;
  export let max: number;
  export let actor: Actor5e;
  export let incapacitated: boolean;

  let context = getContext<Readable<CharacterSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<div
  class="portrait-hp"
  class:incapacitated
  class:widen-for-rounded-portrait={$context.useRoundedPortraitStyle}
  title={localize('DND5E.HitPoints')}
>
  <ResourceWithBar
    document={actor}
    {value}
    valueField="system.attributes.hp.value"
    valueTitle={localize('DND5E.HitPointsCurrent')}
    valueDisabled={!$context.editable}
    {max}
    maxField="system.attributes.hp.max"
    maxTitle={localize('DND5E.HitPointsMax')}
    maxDisabled={!$context.allowMaxHpOverride ||
      !$context.editable ||
      $context.lockHpMaxChanges ||
      $context.lockSensitiveFields}
    percentage={$context.healthPercentage}
    Bar={SettingsProvider.settings.useHpBar.get() ? HpBar : null}
  />
</div>

<style lang="scss">
  .portrait-hp {
    position: absolute;
    width: 5.25rem;
    left: 50%;
    height: 1.25rem;
    font-size: 1.125rem;
    transform: translateX(-50%);
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--t5e-title-font-family);

    :global(.resource-value),
    :global(.resource-max) {
      font-weight: 700;
    }

    &.widen-for-rounded-portrait {
      width: 5.5rem;
    }
  }
</style>
