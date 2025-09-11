<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';
  import { CONSTANTS } from 'src/constants';

  let context = $derived(getGroupSheetQuadroneContext());

  const localize = FoundryAdapter.localize;

  let isEditingXp = $state(false);
  let xpInputRef: TextInputQuadrone | undefined = $state();

  $effect(() => {
    if (isEditingXp && xpInputRef) {
      xpInputRef.selectText();
    }
  });

  let memberCount = $derived(
    context.members.character.members.length +
      context.members.npc.members.length +
      context.members.vehicle.members.length,
  );
  let charactersOnly = $derived(
    context.members.npc.members.length +
      context.members.vehicle.members.length ===
      0,
  );

  let xpPool = $derived(context.system.details.xp.value);

  let totalGold = $derived.by(() => context.sheet.getGpSummary(context.actor));
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

<!-- Group subtitle, member info -->
<div class="actor-subtitle separated-list" data-tidy-sheet-part="subtitle-row">
  {#if !charactersOnly && context.members.character.members.length > 0}
    <span class="members" 
      role="button"
      tabindex="0"
      onclick={() => context.sheet.selectTab(CONSTANTS.TAB_MEMBERS)}
      >
      <span class="color-text-gold font-label-medium"
        >{context.members.character.members.length > 1
          ? localize('TYPES.Actor.characterPl')
          : localize('TYPES.Actor.character')}</span
      >
      <span class="color-text-default font-data-medium"
        >{context.members.character.members.length}</span
      >
    </span>
    <div class="divider-dot"></div>
  {/if}
  <span class="members" 
    role="button"
    tabindex="0"
    onclick={() => context.sheet.selectTab(CONSTANTS.TAB_MEMBERS)}
    >
    <span class="color-text-gold font-label-medium"
      >{memberCount > 1
        ? localize('DND5E.Group.Member.other')
        : localize('DND5E.Group.Member.one')}</span
    >
    <span class="color-text-default font-data-medium">{memberCount}</span>
  </span>
  <div class="divider-dot"></div>
  <span class="average-level" 
    role="button"
    tabindex="0"
    onclick={() => context.sheet.selectTab(CONSTANTS.TAB_ACTOR_CHARACTERS)}
    >
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.LevelAvg')}</span
    >
    <span class="color-text-default font-data-medium"
      >{context.actor.system.level}</span
    >
  </span>
  {#if totalGold !== null}
    <div class="divider-dot"></div>
    <span class="money" 
      role="button"
      tabindex="0"
      onclick={() => context.sheet.selectTab(CONSTANTS.TAB_ACTOR_INVENTORY)}
      >
      <i class="currency gp"></i>
      <span class="color-text-default font-data-medium"
        >{FoundryAdapter.formatNumber(Math.round(totalGold))}</span
      >
    </span>
  {/if}
  {#if context.enableXp && (xpPool > 0 || context.unlocked)}
    <div class="divider-dot"></div>
    <span class="xp-pool flexrow">
      <span class="label font-label-medium color-text-gold flexshrink"
        >{localize('DND5E.ExperiencePoints.Pool')}</span
      >
      {#if context.unlocked}
        <TextInputQuadrone
          document={context.document}
          field="system.details.xp.value"
          value={context.system.details.xp.value}
          class="uninput xp-value"
        />
      {:else}
        <span class="label font-label-medium color-text-default flexshrink"
          >{FoundryAdapter.formatNumber(context.system.details.xp.value)}</span
        >
      {/if}
    </span>
  {/if}
</div>

<div
  class="actor-subtitle separated-list group-speeds"
  data-tidy-sheet-part="subtitle-row"
>
  {#if !!context.travel.currentPace}
    <div class="span separated-list travel-pace">
      <button
        class="button button-borderless button-icon-only"
        onclick={() => context.sheet.changePace(-1)}
        disabled={context.travel.speed === 1}
      >
        <i
          class="{context.travel.speed === 1
            ? 'fa-regular '
            : 'fa-solid'} fa-backward"
        ></i>
      </button>
      <i
        class="fa-solid color-text-gold {context.travel.speed === 1
          ? 'fa-gauge-simple-min'
          : context.travel.speed === 2
            ? 'fa-gauge-simple'
            : 'fa-gauge-simple-max'}"
      ></i>
      <button
        class="button button-borderless button-icon-only"
        onclick={() => context.sheet.changePace(1)}
        disabled={context.travel.speed === 3}
      >
        <i
          class="{context.travel.speed === 3
            ? 'fa-regular '
            : 'fa-solid'} fa-forward"
        ></i>
      </button>
      <div>
        <span class="font-label-medium color-text-gold">
          {localize('DND5E.Travel.Label')}
        </span>
        <span class="label font-label-medium color-text-default flexshrink">
          {context.travel.currentPace.config.label}
        </span>
      </div>
  </div>
  {/if}
  {#if context.actor.system.attributes.movement.paces.land > 0}
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementLand')}</span
    >
    <span class="color-text-default font-data-medium"
      >{context.actor.system.attributes.movement.paces.land}</span
    >
    <span class="color-text-lighter font-label-medium"
      >{context.travel.units.label}</span
    >
  </span>
  {/if}
  {#if context.actor.system.attributes.movement.paces.air > 0}
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementAir')}</span
    >
    <span class="color-text-default font-data-medium"
      >{context.actor.system.attributes.movement.paces.air}</span
    >
    <span class="color-text-lighter font-label-medium"
      >{context.travel.units.label}</span
    >
  </span>
  {/if}
  {#if context.actor.system.attributes.movement.paces.water > 0}
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementWater')}</span
    >
    <span class="color-text-default font-data-medium"
      >{context.actor.system.attributes.movement.paces.water}</span
    >
    <span class="color-text-lighter font-label-medium"
      >{context.travel.units.label}</span
    >
  </span>
  {/if}
  {#if context.unlocked}
    <button
      aria-label={localize('DND5E.MovementConfig')}
      type="button"
      class={[
        'button button-borderless button-icon-only button-config flexshrink',
      ]}
      onclick={() =>
        FoundryAdapter.renderMovementSensesConfig(context.actor, 'movement')}
      data-tidy-sheet-part="ability-configuration-control"
    >
      <i class="fas fa-cog"></i>
    </button>
  {/if}
</div>
