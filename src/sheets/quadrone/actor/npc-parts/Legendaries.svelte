<script lang="ts">
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import NpcScoreTrackerCard from './NpcScoreTrackerCard.svelte';
  import FiligreeCard from 'src/components/filigree-card/FiligreeCard.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FieldToggle from 'src/components/toggles/FieldToggle.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;
</script>

{#if context.showLegendaryActions}
  <NpcScoreTrackerCard
    actor={context.actor}
    label={localize('DND5E.LegendaryAction.Label')}
    value={context.system.resources.legact.value}
    valuePath="system.resources.legact.value"
    valueTooltip="DND5E.LegendaryAction.Remaining"
    max={context.system.resources.legact.max}
    maxPath="system.resources.legact.max"
    maxTooltip="DND5E.LegendaryAction.Max"
    unlocked={context.unlocked}
  />
{/if}

{#if context.showLegendaryResistances}
  <NpcScoreTrackerCard
    actor={context.actor}
    label={localize('DND5E.LegendaryResistance.Label')}
    value={context.system.resources.legact.value}
    valuePath="system.resources.legres.value"
    valueTooltip="DND5E.LegendaryResistance.Remaining"
    max={context.system.resources.legres.max}
    maxPath="system.resources.legres.max"
    maxTooltip="DND5E.LegendaryResistance.Max"
    unlocked={context.unlocked}
  />
{/if}

{#if context.showLairTracker}
  <FiligreeCard class="npc-score-tracker lair-tracker">
    {#if context.modernRules && context.unlocked}
      <!-- Checkbox - has lair -->
      <h3>
        {localize('DND5E.LAIR.HasLair')}
      </h3>
      <span class="value">
        <CheckboxQuadrone
          document={context.actor}
          field="system.resources.lair.value"
          checked={context.system.resources.lair.value}
        />
      </span>
    {:else if context.modernRules && !context.unlocked && context.system.resources.lair.value}
      <!-- Switch - inside lair -->
      <h3>
        {localize('DND5E.LAIR.Inside')}
      </h3>
      <FieldToggle
        class="inside-lair-toggle"
        checked={context.system.resources.linear.inside}
        onchange={(ev) =>
          context.actor.update({
            ['system.resources.lair.inside']: ev.currentTarget.checked,
          })}
      />
    {:else if !context.modernRules}
      <!-- Lair initiative -->
      <h3>
        {localize('DND5E.LAIR.Action.Label')}
      </h3>
      <TextInputQuadrone
        document={context.actor}
        field="system.resources.lair.initiative"
        value={context.system.resources.lair.initiative ?? ''}
        placeholder={localize('DND5E.InitiativeAbbr')}
        enableDeltaChanges={true}
        selectOnFocus={true}
        saveEmptyAsNull={true}
        disabled={!context.unlocked}
        data-tooltip={'DND5E.LAIR.Action.Initiative'}
        class="lair-ini-input"
      />
    {/if}
  </FiligreeCard>
{/if}
