<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

  let context = getNpcSheetContext();

  let incapacitated = $derived(
    (context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
      context.actor?.system?.attributes?.hp?.max !== 0,
  );

  async function onLevelSelected(level: number) {
    await context.actor.update({
      'system.attributes.exhaustion': level,
    });
  }
</script>

<ActorProfile useHpOverlay={settings.useHpOverlayNpc}>
  {#if incapacitated && (!settings.hideDeathSavesFromPlayers || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={context.system.attributes.death.success}
      failures={context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      onRollDeathSave={(event) =>
        context.actor.rollDeathSave({
          event: event,
          legacy: false,
        })}
      hasHpOverlay={settings.useHpOverlayNpc}
    />
  {/if}
  {#if settings.useExhaustion && settings.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={context.system.attributes.exhaustion}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      exhaustionConfig={settings.exhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if settings.useExhaustion && settings.exhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={context.system.attributes.exhaustion}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  <NpcHitPoints />
  <NpcRest />
  {#if !context.system.details.level}
    <NpcHealthFormulaRoller />
  {/if}
</ActorProfile>
<TempHp />
