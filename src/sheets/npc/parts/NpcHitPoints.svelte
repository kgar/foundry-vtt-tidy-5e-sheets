<script lang="ts">
  import TextInput from 'src/components/form/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import ActorHpBar from 'src/sheets/actor/ActorHpBar.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp" title={localize('DND5E.HitPoints')}>
  {#if !SettingsProvider.settings.hpBarDisabledNpc.get()}
    <ActorHpBar actor={$store.actor} />
  {/if}
  <TextInput
    cssClass="hp-min"
    document={$store.actor}
    field="system.attributes.hp.value"
    value={$store.system.attributes.hp.value}
    placeholder="0"
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
    placeholder="0"
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
    background: var(--t5ek-icon-background);
    box-shadow: 0 0 0.3125rem var(--t5ek-icon-shadow) inset;
    border: 1px solid var(--t5ek-icon-outline);

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
      font-family: var(--t5ek-modesto);
      font-weight: 700;
    }
  }
</style>
