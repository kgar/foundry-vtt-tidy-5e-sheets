<script lang="ts">
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import ActorHpBar from 'src/sheets/actor/ActorHpBar.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let context = getContext<Readable<NpcSheetContext>>('context');

  const localize = FoundryAdapter.localize;
</script>

<div class="portrait-hp" title={localize('DND5E.HitPoints')}>
  {#if !$settingStore.hpBarDisabledNpc}
    <ActorHpBar />
  {/if}
  <TextInput
    cssClass="hp-min"
    document={$context.actor}
    field="system.attributes.hp.value"
    value={$context.system.attributes.hp.value}
    placeholder="0"
    title={localize('DND5E.HitPointsCurrent')}
    allowDeltaChanges={true}
    maxlength={5}
    ariaDescribedBy="tooltip"
    selectOnFocus={true}
    disabled={!$context.owner}
    />
  <span class="value-seperator sep"> / </span>
  <TextInput
    cssClass="hp-max"
    document={$context.actor}
    field="system.attributes.hp.max"
    value={$context.system.attributes.hp.max}
    placeholder="0"
    title={localize('DND5E.HitPointsMax')}
    allowDeltaChanges={true}
    maxlength={5}
    ariaDescribedBy="tooltip"
    selectOnFocus={true}
    disabled={!$context.owner || $context.lockHpMaxChanges || $context.lockSensitiveFields}
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
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--t5ek-icon-background);
    box-shadow: 0 0 0.3125rem var(--t5ek-icon-shadow-color) inset;
    border: 0.0625rem solid var(--t5ek-icon-outline-color);

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
      font-family: var(--t5ek-title-font-family);
      font-weight: 700;
    }
  }
</style>
