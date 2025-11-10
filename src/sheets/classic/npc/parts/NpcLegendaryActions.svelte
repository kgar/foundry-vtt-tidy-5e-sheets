<script lang="ts">
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import TidySwitch from 'src/components/toggles/TidySwitch.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getNpcSheetContext());

  const localize = FoundryAdapter.localize;
</script>

<div class="counters">
  <div class="counter legendary">
    <h4>{localize('DND5E.LegendaryAction.Label')}</h4>
    <div class="counter-value">
      <NumberInput
        document={context.actor}
        field="system.resources.legact.value"
        value={context.system.resources.legact.value}
        step="any"
        placeholder="0"
        title={localize('DND5E.LegendaryAction.Remaining')}
        selectOnFocus={true}
        disabled={!context.editable}
      />
      <span class="sep">/</span>
      <NumberInput
        document={context.actor}
        field="system.resources.legact.max"
        value={context.system.resources.legact.max}
        min={0}
        step="1"
        placeholder="0"
        selectOnFocus={true}
        disabled={!context.unlocked}
      />
    </div>
  </div>
  <div class="counter legendary">
    <h4>{localize('DND5E.LegendaryResistance.Label')}</h4>
    <div class="counter-value">
      <NumberInput
        document={context.actor}
        field="system.resources.legres.value"
        value={context.system.resources.legres.value}
        step="any"
        placeholder="0"
        title={localize('DND5E.LegendaryResistance.Remaining')}
        selectOnFocus={true}
        disabled={!context.editable}
      />
      <span class="sep">/</span>
      <NumberInput
        document={context.actor}
        field="system.resources.legres.max"
        value={context.system.resources.legres.max}
        min="0"
        step="1"
        placeholder="0"
        selectOnFocus={true}
        disabled={!context.unlocked}
      />
    </div>
  </div>
  {#if context.modernRules && context.unlocked}
    <div class="counter lair">
      <h4>{localize('DND5E.LAIR.HasLair')}</h4>
      <div class="counter-value">
        <Checkbox
          document={context.actor}
          field="system.resources.lair.value"
          checked={context.system.resources.lair.value}
          disabled={!context.editable}
        />
      </div>
    </div>
  {:else if context.modernRules && !context.unlocked && context.system.resources.lair.value}
    <div class="counter lair">
      <h4>{localize('DND5E.LAIR.Inside')}</h4>
      <div class="counter-value">
        <TidySwitch
          class="flex-row small-gap inside-lair-toggle"
          checked={context.system.resources.lair.inside}
          onChange={(ev) =>
            context.actor.update({
              ['system.resources.lair.inside']: ev.currentTarget.checked,
            })}
          disabled={!context.editable}
        />
      </div>
    </div>
  {:else if !context.modernRules}
    <div class="counter lair">
      <h4>{localize('DND5E.LAIR.Action.Label')}</h4>
      <div class="counter-value">
        <TextInput
          document={context.actor}
          field="system.resources.lair.initiative"
          value={context.system.resources.lair.initiative ?? ''}
          placeholder="Init."
          allowDeltaChanges={true}
          selectOnFocus={true}
          saveEmptyAsNull={true}
          disabled={!context.unlocked}
          title={localize('DND5E.LAIR.Action.Initiative')}
        />
      </div>
    </div>
  {/if}
</div>

<style lang="less">
  .counters {
    display: flex;
    flex: none;
    padding: 0;
    border-bottom: none;
    border: 0.0625rem solid var(--t5e-faint-color);
    border-radius: 0.3125rem;

    .counter {
      height: auto;
      line-height: 1rem;
      flex: 1;
      text-align: center;

      .counter-value {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 0.125rem;
        margin-top: 0.1875rem;
        font-size: 1.5625rem;
      }

      :global(input) {
        min-width: 1.875rem;
        max-width: 3.125rem;
      }

      :global(input[type='text']:first-of-type) {
        text-align: right;
      }

      :global(input[type='text']:last-of-type) {
        text-align: left;
      }

      :global(input[type='text']),
      :global(input[type='number']) {
        height: 1.5625rem;
        max-width: 1.25rem;
      }

      :global(input[type='text'][disabled]) {
        border-width: 0;
      }

      :global(input[type='checkbox']) {
        width: 0.875rem;
        height: 1.5625rem;
        margin: 0;
      }

      h4 {
        font-size: 0.75rem;
        line-height: 0.75rem;
        padding-top: 0.25rem;
      }
    }
  }
</style>
