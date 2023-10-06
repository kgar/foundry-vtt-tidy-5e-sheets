<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
  import TextInput from 'src/components/form/TextInput.svelte';
  import ActorHpBar from 'src/sheets/actor/ActorHpBar.svelte';
  import { settingStore } from 'src/settings/settings';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { CharacterSheetContext } from 'src/types/types';

  export let value: number;
  export let max: number;
  export let actor: Actor5e;
  export let useRoundedPortraitStyle: boolean;
  export let incapacitated: boolean;

  let store = getContext<Readable<CharacterSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  const allowMaxHpOverride =
    $settingStore.allowHpMaxOverride &&
    (!$settingStore.lockHpMaxChanges || FoundryAdapter.userIsGm());
</script>

<div
  class="portrait-hp"
  class:incapacitated
  class:widen-for-rounded-portrait={useRoundedPortraitStyle}
  title={localize('DND5E.HitPoints')}
>
  {#if !$settingStore.hpBarDisabled}
    <ActorHpBar {actor} />
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
      disabled={$store.lockHpMaxChanges || $store.lockSensitiveFields}
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
    width: 5.25rem;
    left: 50%;
    height: 1.25rem;
    font-size: 1.125rem;
    transform: translateX(-50%);
    bottom: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--t5ek-icon-background);
    box-shadow: 0 0 0.3125rem var(--t5ek-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5ek-icon-outline-color);

    &.widen-for-rounded-portrait {
      width: 88px;
    }

    &.incapacitated {
      border-radius: 0.3125rem;
      width: 7.5rem;
    }

    :global(input),
    span {
      font-family: var(--t5ek-title-font-family);
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
