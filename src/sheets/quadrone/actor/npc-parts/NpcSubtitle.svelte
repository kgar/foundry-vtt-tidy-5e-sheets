<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';

  let context = $derived(getNpcSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let appId = $derived(context.document.id);

  let size = $derived<string | undefined>(
    context.config.actorSizes[context.system.traits.size]?.label,
  );

  let alignment = $derived<string | undefined>(
    context.system.details.alignment,
  );

  let species = $derived.by<string | undefined>(() => {
    if (context.system.details.race?.name) {
      return context.system.details.race.name;
    } else if (context.system.details.race) {
      return context.system.details.race;
    }
  });

  let pb = $derived(getModifierData(context.system.attributes.prof ?? 0));

  let isEditingXp = $state(false);
  let xpInputRef: TextInputQuadrone | undefined = $state();

  $effect(() => {
    if (isEditingXp && xpInputRef) {
      xpInputRef.selectText();
    }
  });
</script>

{#snippet speedSenseSummary(
  speed: ActorSpeedSenseEntryContext,
  clsx?: ClassValue,
  hide?: ClassValue,
)}
  <span class={[clsx, hide]}>
    <span class="color-text-gold font-label-medium">{speed.label}</span>
    <span class="color-text-default font-data-medium">{speed.value}</span>
    <span class="color-text-lighter font-label-medium">{speed.units}</span>
  </span>
{/snippet}

<div
  class="actor-details-subtitle-row"
  data-tidy-sheet-part="actor-details-row"
>
  <div class="actor-subtitle flexrow" data-tidy-sheet-part="subtitle-row">
    {#each context.speeds as speed, i}
      {#if i > 0}
        <div class="divider-dot"></div>
      {/if}
      {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
    {/each}
    {#each context.senses as sense, i}
      {#if i > 0 || context.speeds.length}
        <div class="divider-dot"></div>
      {/if}
      {@render speedSenseSummary(sense, ['sense', 'main-sense'])}
    {/each}
    {#if size}
      <div class="divider-dot"></div>
      <span class="size">
        <span class="font-label-medium color-text-gold">{size}</span>
      </span>
    {/if}
    {#if !isNil(context.creatureType?.title, '')}
      <div class="divider-dot"></div>
      <span class="size">
        <span class="font-label-medium color-text-gold"
          >{context.creatureType.title}</span
        >
      </span>
    {/if}
    {#if species}
      <div class="divider-dot"></div>
      <span class="species">
        <span class="font-label-medium color-text-gold">{species}</span>
      </span>
    {/if}
    {#if alignment}
      <div class="divider-dot"></div>
      <span class="alignment">
        <span class="font-label-medium color-text-gold">{alignment}</span>
      </span>
    {/if}
    {#if context.enableXp}
      <div class="divider-dot"></div>
      {#if context.unlocked && !isEditingXp}
        <div class="xp-container">
          <button
            type="button"
            class="unbutton xp-label flexrow xp-label-clickable"
            onclick={() => (isEditingXp = true)}
          >
            <span class="label font-label-medium color-text-gold flexshrink"
              >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
            >
            <span class="label font-label-medium color-text-default flexshrink">
              {FoundryAdapter.formatNumber(context.system.details.xp.value)}
            </span>
          </button>
        </div>
      {:else}
        <div class="xp-label flexrow">
          <span class="label font-label-medium color-text-gold flexshrink"
            >{localize('DND5E.ExperiencePoints.Abbreviation')}</span
          >
          {#if context.unlocked && isEditingXp}
            <TextInputQuadrone
              bind:this={xpInputRef}
              id="{appId}-xp-value"
              document={context.document}
              field="system.details.xp.value"
              value={context.system.details.xp.value}
              class="xp-value"
              enableDeltaChanges={true}
              selectOnFocus={true}
              onblur={() => {
                isEditingXp = false;
                xpInputRef = undefined;
              }}
              onkeydown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  isEditingXp = false;
                  xpInputRef = undefined;
                }
              }}
            />
          {:else}
            <span class="label font-label-medium color-text-default flexshrink">
              {FoundryAdapter.formatNumber(context.system.details.xp.value)}
            </span>
          {/if}
        </div>
      {/if}
    {/if}
    {#if context.saves.concentration}
      <div class="divider-dot"></div>
      {@const save = context.saves.concentration}
      <div class="concentration flexrow">
        <div class="flexrow concentration-bonus">
          <button
            type="button"
            onclick={(event) =>
              context.actor.rollConcentration({
                event,
                legacy: false,
              })}
            class="unbutton concentration-roll-button header-control"
          >
            {#if context.isConcentrating}
              <i
                class="active-concentration-icon fas fa-arrow-rotate-left fa-spin fa-spin-reverse"
                aria-label={localize('DND5E.Concentration')}
              ></i>
            {:else}
              <!-- <i class="fas fa-head-side-brain color-text-gold"></i> -->
            {/if}
            <span class="label font-label-medium color-text-gold">
              {#if context.isConcentrating}
                {localize('EFFECT.DND5E.StatusConcentrating')}
              {:else}
                {localize(save.label)}
              {/if}
            </span>
            <span class="flexrow">
              <span class="modifier font-label-medium color-text-lightest">
                {save.sign}
              </span>
              <span class="value font-data-medium color-text-default">
                {save.mod}
              </span>
            </span>
          </button>
          {#if context.unlocked}
            {@const tooltip = localize('DND5E.AbilityConfigure', {
              ability: context.saves.concentration.label,
            })}
            <div class="config-container">
              <button
                aria-label={tooltip}
                data-tooltip={tooltip}
                type="button"
                class="button button-borderless button-icon-only button-config"
                onclick={() =>
                  FoundryAdapter.openConcentrationConfig(context.actor)}
              >
                <i class="fas fa-cog"></i>
              </button>
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>
  <div class="proficiency-bonus flexrow" data-tooltip="DND5E.ProficiencyBonus">
    <span class="label font-label-medium color-text-gold">
      {localize('DND5E.Proficiency')}
    </span>
    <span class="modifier font-label-medium color-text-lightest">
      {pb.sign}
    </span>
    <span class="value font-data-medium color-text-default">
      {pb.value}
    </span>
  </div>
</div>
