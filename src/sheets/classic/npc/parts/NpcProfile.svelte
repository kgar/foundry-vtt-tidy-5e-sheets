<script lang="ts">
  import DeathSaves from 'src/sheets/classic/actor/DeathSaves.svelte';
  import ExhaustionTracker from 'src/sheets/classic/actor/ExhaustionTracker.svelte';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/classic/actor/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormulaRoller from './NpcHealthFormulaRoller.svelte';
  import ActorProfile from 'src/sheets/classic/actor/ActorProfile.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import ExhaustionInput from 'src/sheets/classic/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getNpcSheetContext } from 'src/sheets/sheet-context.svelte';
  import NpcLoyaltyTracker from './NpcLoyaltyTracker.svelte';
  import type { PortraitCharmRadiusClass } from 'src/types/types';

  let context = $derived(getNpcSheetContext());

  let incapacitated = $derived(
    (context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
      context.actor?.system?.attributes?.hp?.max !== 0,
  );

  let exhaustionRadiusClass: PortraitCharmRadiusClass = $derived(
    context.useRoundedPortraitStyle ? 'rounded' : 'top-left',
  );

  let loyaltyRadiusClass: PortraitCharmRadiusClass = $derived(
    context.useRoundedPortraitStyle ? 'rounded' : 'top-right',
  );

  async function onLevelSelected(level: number) {
    await context.actor.update({
      'system.attributes.exhaustion': level,
    });
  }
</script>

<ActorProfile useHpOverlay={settings.value.useHpOverlayNpc}>
  {#if incapacitated && context.owner && context.system.traits.important}
    <DeathSaves hasHpOverlay={settings.value.useHpOverlayNpc} />
  {/if}
  {#if settings.value.useExhaustion && settings.value.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={context.system.attributes.exhaustion}
      radiusClass={exhaustionRadiusClass}
      {onLevelSelected}
      exhaustionConfig={settings.value.exhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if settings.value.useExhaustion && settings.value.exhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={context.system.attributes.exhaustion}
      radiusClass={exhaustionRadiusClass}
      {onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  {#if context.showLoyalty}
    <NpcLoyaltyTracker radiusClass={loyaltyRadiusClass} />
  {/if}

  <NpcHitPoints />
  <NpcRest />
  {#if !context.system.details.level}
    <NpcHealthFormulaRoller />
  {/if}
</ActorProfile>
<TempHp />
