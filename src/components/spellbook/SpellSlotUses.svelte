<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import TextInput from '../form/TextInput.svelte';

  export let section: any;
  let store = getContext<Readable<ActorSheetContext>>('store');

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
    />
  {:else}
    <span
      class="spell-max"
      data-level={section.prop}
      data-slots={section.slots}
    >
      {section.slots}
    </span>
    {#if $store.editable}
      <a
        class="spell-slot-max-override"
        title={localize('DND5E.SpellProgOverride')}
        on:click={() => (overrideMode = true)}
      >
        <i class="fas fa-pencil-alt" />
      </a>
    {/if}
  {/if}
</div>

<style lang="scss">
  .spell-slots-detail {
    display: flex;
    flex: 0 0 0.0625rem;
    align-items: center;
    color: var(--t5e-secondary-color);
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
      color: var(--t5e-tertiary-color);
      line-height: 0.75rem;
      height: 0.75rem;
    }
  }
</style>
