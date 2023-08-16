<script lang="ts">
  import TextInput from 'src/components/form/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type { ActorSheetContext } from 'src/types/types';
  import { isRealNumber } from 'src/utils/numbers';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  // TODO: Break this down so it's simple for the reader
  $: hpBarCalculationCurrent =
    (100 /
      ((isRealNumber($store.actor.system?.attributes?.hp?.max)
        ? $store.actor.system.attributes.hp.max
        : 1) +
        (isRealNumber($store.actor.system?.attributes?.hp?.tempmax)
          ? $store.actor.system.attributes.hp.tempmax
          : 0))) *
      (isRealNumber($store.actor.system?.attributes?.hp?.value)
        ? $store.actor.system.attributes.hp.value
        : 0) +
    (isRealNumber($store.actor.system?.attributes?.hp?.temp)
      ? $store.actor.system.attributes.hp.temp
      : 0);

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp" title={localize('DND5E.HitPoints')}>
  {#if !SettingsProvider.settings.hpBarDisabledNpc.get()}
    <div
      class="hp-bar"
      style="background: linear-gradient(
      -90deg,
      transparent 0%,
      transparent calc(100% -  {hpBarCalculationCurrent}%),
            rgba(0, 200, 0, 0.5) calc(100% - {hpBarCalculationCurrent}%),
            rgba(0, 200, 0, 0.5) 100%);"
    />
  {/if}
  <TextInput
    cssClass="hp-min"
    document={$store.actor}
    field="system.attributes.hp.value"
    value={$store.system.attributes.hp.value}
    placeholder="10"
    title={localize('DND5E.HitPointsCurrent')}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    ariaDescribedBy="tooltip"
    selectOnFocus={true}
  />
  <span class="value-seperator sep"> / </span>
  <TextInput
    cssClass="hp-max"
    document={$store.actor}
    field="system.attributes.hp.max"
    value={$store.system.attributes.hp.max}
    placeholder="10"
    title={localize('DND5E.HitPointsMax')}
    dtype="Number"
    allowDeltaChanges={true}
    maxlength={5}
    ariaDescribedBy="tooltip"
    selectOnFocus={true}
  />
</div>

<style lang="scss">
  .portrait-hp {
    border-radius: 0.3125rem;

    position: absolute;
    width: 8.5rem;
    left: 50%;
    height: 1.25rem;
    font-size: 1.125rem;
    transform: translateX(-50%);
    bottom: 0;
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--t5e-icon-background);
    box-shadow: 0 0 0.3125rem var(--t5e-icon-shadow) inset;
    border: 1px solid var(--t5e-icon-outline);

    .hp-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: rgba(0, 200, 0, 0.6);
    }

    :global(input.hp-min) {
      text-align: right;
    }

    :global(input.hp-max),
    :global(span.hp-max) {
      text-align: left;
    }

    :global(input.hp-max),
    :global(span.hp-max) {
      width: 100%;
    }
    :global(input),
    :global(span) {
      font-family: var(--t5e-modesto);
      font-weight: 700;
    }
  }
</style>
