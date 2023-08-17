<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import { SettingsProvider } from 'src/settings/settings';
  import { clamp, isRealNumber } from 'src/utils/numbers';
  import TextInput from 'src/components/form/TextInput.svelte';
  import HpBar from 'src/sheets/actor/HpBar.svelte';

  export let value: number;
  export let max: number;
  export let actor: Actor5e;
  export let useRoundedPortraitStyle: boolean;
  export let incapacitated: boolean;

  const localize = FoundryAdapter.localize;

  const allowMaxHpOverride =
    SettingsProvider.settings.allowHpMaxOverride.get() &&
    (!SettingsProvider.settings.lockHpMaxChanges.get() ||
      FoundryAdapter.userIsGm());
</script>

<div
  class="portrait-hp"
  class:incapacitated
  class:widen-for-rounded-portrait={useRoundedPortraitStyle}
  title={localize('DND5E.HitPoints')}
>
  {#if !SettingsProvider.settings.hpBarDisabled.get()}
    <HpBar {actor} />
  {/if}
  <TextInput
    cssClass="hp-min"
    document={actor}
    field="system.attributes.hp.value"
    {value}
    placeholder="0"
    title={localize('DND5E.HitPointsCurrent')}
    dtype="Number"
    selectOnFocus={true}
    allowDeltaChanges={true}
    maxlength={5}
    ariaDescribedBy="tooltip"
  />
  <span class="value-seperator sep"> / </span>
  {#if allowMaxHpOverride}
    <TextInput
      cssClass="hp-max"
      document={actor}
      field="system.attributes.hp.max"
      value={max}
      placeholder="0"
      title={localize(max ? 'DND5E.HitPointsOverride' : 'DND5E.HitPointsMax')}
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
      maxlength={5}
      ariaDescribedBy="tooltip"
    />
  {:else}
    <span
      class="hp-max"
      title={localize(max ? 'DND5E.HitPointsOverride' : 'DND5E.HitPointsMax')}
      >{max}</span
    >
  {/if}
</div>

<style lang="scss">
  .portrait-hp {
    position: absolute;
    width: 84px;
    left: 50%;
    height: 20px;
    font-size: 18px;
    transform: translateX(-50%);
    bottom: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 5px var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);

    &.widen-for-rounded-portrait {
      width: 88px;
    }

    &.incapacitated {
      border-radius: 5px;
      width: 120px;
    }

    :global(input),
    span {
      font-family: var(--t5e-modesto);
      font-weight: 700;
    }

    :global(input.hp-min) {
      text-align: right;
    }

    :global(input.hp-max),
    span.hp-max {
      text-align: left;
    }

    :global(input.hp-max),
    span.hp-max {
      width: 100%;
    }
  }
</style>
