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

  let appId = $derived(context.document.id);

  let {
    showFiligree = true,
  }: {
    showFiligree?: boolean;
  } = $props();
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
    {showFiligree}
  />
{/if}

{#if context.showLegendaryResistances}
  <NpcScoreTrackerCard
    actor={context.actor}
    label={localize('DND5E.LegendaryResistance.Label')}
    value={context.system.resources.legres.value}
    valuePath="system.resources.legres.value"
    valueTooltip="DND5E.LegendaryResistance.Remaining"
    max={context.system.resources.legres.max}
    maxPath="system.resources.legres.max"
    maxTooltip="DND5E.LegendaryResistance.Max"
    unlocked={context.unlocked}
    {showFiligree}
    icon="helmet-battle"
  />
{/if}

{#snippet lairActions()}
  {#if context.modernRules && context.unlocked}
    <!-- Checkbox - has lair -->
    {#if showFiligree}
      <div class="card-header flexrow">
        <h3>
          {localize('DND5E.LAIR.HasLair')}
        </h3>
      </div>
    {:else}
      <label for="{appId}-lair-has-lair">
        <h3 class="font-label-medium bordered">
          <i class="fa-solid fa-eye-evil color-icon-disabled"></i>
          {localize('DND5E.LAIR.HasLair')}
        </h3>
      </label>
    {/if}
    <span class="card-content value">
      <FieldToggle
        id="{appId}-lair-has-lair"
        checked={context.system.resources.lair.value}
        onchange={(ev) =>
          context.actor.update({
            ['system.resources.lair.value']: ev.currentTarget.checked,
          })}
      />
    </span>
  {:else if context.modernRules && !context.unlocked && context.system.resources.lair.value}
    <!-- Switch - inside lair -->
    {#if showFiligree}
      <div class="card-header flexrow">
        <h4>
          {localize('DND5E.LAIR.Inside')}
        </h4>
      </div>
    {:else}
      <label for="{appId}-lair-inside">
        <h3 class="font-label-medium bordered">
          <i class="fa-solid fa-eye-evil color-icon-disabled"></i>
          {localize('DND5E.LAIR.Inside')}
        </h3>
      </label>
    {/if}
    <span class="card-content value">
      <label class="label hidden" for="lair-inside"
        >{localize('DND5E.LAIR.Inside')}</label
      >
      <FieldToggle
        id="{appId}-lair-inside"
        checked={context.system.resources.lair.inside}
        onchange={(ev) =>
          context.actor.update({
            ['system.resources.lair.inside']: ev.currentTarget.checked,
          })}
      />
    </span>
  {:else if !context.modernRules}
    <!-- Lair initiative -->
    {#if showFiligree}
      <div class="card-header flexrow">
        <h3>
          {localize('DND5E.LAIR.Action.Label')}
        </h3>
      </div>
    {:else}
      <h4 class="font-label-medium bordered">
        <i class="fa-solid fa-eye-evil"></i>
        {localize('DND5E.LAIR.Action.Label')}
      </h4>
    {/if}
    <div class="card-content flexrow lair-initiative">
      <span class="font-label-medium color-text-lighter flexshrink">
        {localize('DND5E.Initiative')}
      </span>
      {#if context.unlocked}
      <TextInputQuadrone
        id="{appId}-lair-action"
        document={context.actor}
        field="system.resources.lair.initiative"
        value={context.system.resources.lair.initiative ?? ''}
        placeholder={localize('DND5E.InitiativeAbbr')}
        enableDeltaChanges={true}
        selectOnFocus={true}
        saveEmptyAsNull={true}
        disabled={!context.unlocked}
        data-tooltip={'DND5E.LAIR.Action.Initiative'}
        class="lair-ini-input {context.unlocked ? '' : 'uninput'}"
      />
      {:else}
        <span class="font-label-large color-text-default flexshrink">
          {context.system.resources.lair.initiative ?? ''}
        </span>
      {/if}
    </div>
  {/if}
{/snippet}

{#if context.showLairTracker}
  {#if showFiligree}
    <div class="npc-score-tracker card lair-tracker">
      {@render lairActions()}
    </div>
  {:else}
    <div class="npc-score-tracker card lair-tracker">
      {@render lairActions()}
    </div>
  {/if}
{/if}
