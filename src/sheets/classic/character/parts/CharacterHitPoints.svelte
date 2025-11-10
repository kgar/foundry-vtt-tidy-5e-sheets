<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/types';
  import { settings } from 'src/settings/settings.svelte';
  import HpBar from 'src/components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  interface Props {
    value: number;
    max: number;
    actor: Actor5e;
    incapacitated: boolean;
  }

  let { value, max, actor, incapacitated }: Props = $props();

  let context = $derived(getCharacterSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div
  class="portrait-hp"
  class:incapacitated
  class:widen-for-rounded-portrait={context.useRoundedPortraitStyle}
  title={localize('DND5E.HitPoints')}
>
  <ResourceWithBar
    document={actor}
    {value}
    valueField="system.attributes.hp.value"
    valueTitle={localize('DND5E.HitPointsCurrent')}
    valueDisabled={!context.editable}
    {max}
    maxField="system.attributes.hp.max"
    maxTitle={localize('DND5E.HitPointsMax')}
    maxDisabled={!context.allowMaxHpOverride ||
      !context.editable ||
      context.lockHpMaxChanges ||
      context.lockSensitiveFields}
    percentage={context.healthPercentage}
    Bar={settings.value.useHpBar ? HpBar : null}
  />
</div>

<style lang="less">
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
