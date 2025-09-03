<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { ActorSpeedSenseEntryContext } from 'src/types/types';
  import type { ClassValue } from 'svelte/elements';

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
  let speed = $state(1);

  let xpPool = $derived(context.system.details.xp.value);

  // Currency converter - returns total GP value or null if non-standard currencies present
  let totalGold = $derived.by(() => {
    const currency = context.system.currency;
    const allowedKeys = new Set(['cp', 'ep', 'gp', 'pp', 'sp']);
    const currencyKeys = Object.keys(currency);

    // Check if currency only contains standard denominations (ep is optional)
    if (!currencyKeys.every((key) => allowedKeys.has(key))) {
      return null;
    }

    // Convert all to GP
    const rates = { cp: 0.01, ep: 0.02, gp: 1, pp: 10, sp: 0.1 };
    return currencyKeys.reduce((total, key) => {
      return total + currency[key] * rates[key as keyof typeof rates];
    }, 0);
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

<!-- Group subtitle, member info -->
<div class="actor-subtitle flexrow" data-tidy-sheet-part="subtitle-row">
  {#if !charactersOnly}
    <span class="members">
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
  <span class="members">
    <span class="color-text-gold font-label-medium"
      >{memberCount > 1
        ? localize('DND5E.Group.Member.other')
        : localize('DND5E.Group.Member.one')}</span
    >
    <span class="color-text-default font-data-medium">{memberCount}</span>
  </span>
  <div class="divider-dot"></div>
  <span class="average-level">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.LevelAvg')}</span
    >
    <span class="color-text-default font-data-medium">8</span>
  </span>
  {#if totalGold !== null}
    <div class="divider-dot"></div>
    <span class="money">
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
  class="actor-subtitle flexrow group-speeds"
  data-tidy-sheet-part="subtitle-row"
>
  <div class="span flexrow travel-pace">
    <button
      class="button button-borderless button-icon-only"
      onclick={() => speed--}
      disabled={speed === 1}
    >
      <i class="{speed === 1 ? 'fa-regular ' : 'fa-solid'} fa-backward"></i>
    </button>
    <i
      class="fa-solid color-text-gold {speed === 1
        ? 'fa-gauge-simple-min'
        : speed === 2
          ? 'fa-gauge-simple'
          : 'fa-gauge-simple-max'}"
    ></i>
    <button
      class="button button-borderless button-icon-only"
      onclick={() => speed++}
      disabled={speed === 3}
    >
      <i class="{speed === 3 ? 'fa-regular ' : 'fa-solid'} fa-forward"></i>
    </button>
  </div>
  <span class="travel-pace">
    <span class="font-label-medium color-text-gold">
      {localize('DND5E.Travel.Label')}
    </span>
    <span class="label font-label-medium color-text-default flexshrink">
      {speed === 1
        ? localize('DND5E.Travel.Pace.Slow')
        : speed === 2
          ? localize('DND5E.Travel.Pace.Normal')
          : localize('DND5E.Travel.Pace.Fast')}
    </span>
  </span>
  <!-- {#each speeds as speed, i}
  {#if i > 0}
    <div class="divider-dot"></div>
  {/if}
  {@render speedSenseSummary(speed, ['speed', 'main-speed'])}
{/each} -->
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementLand')}</span
    >
    <span class="color-text-default font-data-medium">30</span>
    <span class="color-text-lighter font-label-medium">mi</span>
  </span>
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementAir')}</span
    >
    <span class="color-text-default font-data-medium">5</span>
    <span class="color-text-lighter font-label-medium">mi</span>
  </span>
  <div class="divider-dot"></div>
  <span class="speed">
    <span class="color-text-gold font-label-medium"
      >{localize('DND5E.MovementWater')}</span
    >
    <span class="color-text-default font-data-medium">20</span>
    <span class="color-text-lighter font-label-medium">mi</span>
  </span>
</div>
