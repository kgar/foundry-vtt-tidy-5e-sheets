<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';

  export let section: any;
  export let context: CharacterSheetContext;

  const localize = FoundryAdapter.localize;

  let overrideMode = false;
  const overrideValue =
    context.actor.system.spells[`spell${section.dataset.level}`].override ||
    section.slots;
</script>

<div class="spell-slots-detail">
  <input
    class="spell-slot-uses"
    type="text"
    name="system.spells.{section.prop}.value"
    value={section.uses}
    placeholder="0"
    data-dtype="Number"
  />
  <span class="sep"> / </span>
  {#if overrideMode}
    <input
      class="spell-slot-override"
      type="text"
      name="system.spells.{section.level}.override"
      value={overrideValue}
      placeholder={section.slots}
      data-dtype="Number"
    />
  {:else}
    <span
      class="spell-max"
      data-level={section.prop}
      data-slots={section.slots}
    >
      {section.slots}
    </span>
    {#if context.editable}
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

    input {
      text-align: right;
      height: 0.8125rem;
      margin-top: -0.0625rem;
      min-width: 1rem;
    }

    .spell-slot-override {
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
