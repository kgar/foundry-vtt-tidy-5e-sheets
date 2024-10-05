<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DeathSaves from 'src/sheets/actor/DeathSaves.svelte';
  import ExhaustionTracker from 'src/sheets/actor/ExhaustionTracker.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/actor/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormulaRoller from './NpcHealthFormulaRoller.svelte';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import ExhaustionInput from 'src/sheets/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: incapacitated =
    ($context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $context.actor?.system?.attributes?.hp?.max !== 0;

  async function onLevelSelected(event: CustomEvent<{ level: number }>) {
    await $context.actor.update({
      'system.attributes.exhaustion': event.detail.level,
    });
  }

  $: exhaustionConfig = SettingsProvider.settings.exhaustionConfig.get();

  $: specificExhaustionConfig =
    exhaustionConfig?.type === 'specific' ? exhaustionConfig : null;
</script>

<ActorProfile useHpOverlay={SettingsProvider.settings.useHpOverlayNpc.get()}>
  {#if incapacitated && (!SettingsProvider.settings.hideDeathSavesFromPlayers.get() || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={$context.system.attributes.death.success}
      failures={$context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      on:rollDeathSave={(event) =>
        $context.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      hasHpOverlay={SettingsProvider.settings.useHpOverlayNpc.get()}
    />
  {/if}
  {#if SettingsProvider.settings.useExhaustion.get() && specificExhaustionConfig}
    <ExhaustionTracker
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      exhaustionConfig={specificExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if SettingsProvider.settings.useExhaustion.get() && SettingsProvider.settings.exhaustionConfig.get()?.type === 'open'}
    <ExhaustionInput
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
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
