<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DeathSaves from 'src/sheets/classic/actor/DeathSaves.svelte';
  import ExhaustionTracker from 'src/sheets/classic/actor/ExhaustionTracker.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/classic/actor/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormulaRoller from './NpcHealthFormulaRoller.svelte';
  import ActorProfile from 'src/sheets/classic/actor/ActorProfile.svelte';
  import { settingStore } from 'src/settings/settings';
  import ExhaustionInput from 'src/sheets/classic/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  let incapacitated = $derived(
    ($context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
      $context.actor?.system?.attributes?.hp?.max !== 0,
  );

  async function onLevelSelected(level: number) {
    await $context.actor.update({
      'system.attributes.exhaustion': level,
    });
  }
</script>

<ActorProfile useHpOverlay={$settingStore.useHpOverlayNpc}>
  {#if incapacitated && (!$settingStore.hideDeathSavesFromPlayers || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={$context.system.attributes.death.success}
      failures={$context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      onRollDeathSave={(event) =>
        $context.actor.rollDeathSave({
          event: event,
          legacy: false,
        })}
      hasHpOverlay={$settingStore.useHpOverlayNpc}
    />
  {/if}
  {#if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      exhaustionConfig={$settingStore.exhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  <NpcHitPoints />
  <NpcRest />
  {#if !$context.system.details.level}
    <NpcHealthFormulaRoller />
  {/if}
</ActorProfile>
<TempHp />
