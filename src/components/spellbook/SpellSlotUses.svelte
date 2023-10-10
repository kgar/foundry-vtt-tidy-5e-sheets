<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type CharacterSheetContext,
    type NpcSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from '../form/TextInput.svelte';

  export let section: any;
  let store =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('store');

  const localize = FoundryAdapter.localize;

  let overrideMode = false;
</script>

<div class="spell-slots-detail">
  <TextInput
    document={$store.actor}
    field="system.spells.{section.prop}.value"
    cssClass="spell-slot-uses"
    value={section.uses}
    placeholder="0"
    dtype="Number"
    selectOnFocus={true}
    allowDeltaChanges={true}
    disabled={!$store.owner}
  />
  <span class="sep"> / </span>
  {#if overrideMode}
    <TextInput
      document={$store.actor}
      field="system.spells.{section.prop}.override"
      cssClass="spell-slot-override"
      value={section.override}
      placeholder={section.slots}
      dtype="Number"
      selectOnFocus={true}
      allowDeltaChanges={true}
      disabled={!$store.owner || $store.lockSensitiveFields}
    />
  {:else}
    <span
      class="spell-max"
      data-level={section.prop}
      data-slots={section.slots}
    >
      {section.slots}
    </span>
    {#if $store.owner && !$store.lockSensitiveFields}
      <button
        type="button"
        class="spell-slot-max-override icon-button"
        title={localize('DND5E.SpellProgOverride')}
        on:click={() => (overrideMode = true)}
      >
        <i class="fas fa-pencil-alt" />
      </button>
    {/if}
  {/if}
</div>

<style lang="scss">
  .spell-slots-detail {
    display: flex;
    flex: 0 0 0.0625rem;
    align-items: center;
    color: var(--t5ek-secondary-color);
    border-radius: 0.3125rem;
    padding: 0 0.3125rem;

    :global(input) {
      text-align: right;
      height: 0.8125rem;
      margin-top: -0.0625rem;
      min-width: 1rem;
    }

    :global(.spell-slot-override) {
      text-align: left;
    }

    .spell-max {
      display: flex;
      align-items: center;
      line-height: 0.75rem;
      text-align: left;
    }

    .spell-slot-max-override {
      margin: 0 0 0 0.25rem;
      color: var(--t5ek-tertiary-color);
      line-height: 0.75rem;
      height: 0.75rem;
    }
  }
</style>
