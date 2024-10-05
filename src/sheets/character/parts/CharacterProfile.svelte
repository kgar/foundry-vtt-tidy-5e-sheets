<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import ExhaustionTracker from '../../actor/ExhaustionTracker.svelte';
  import Inspiration from './Inspiration.svelte';
  import DeathSaves from '../../actor/DeathSaves.svelte';
  import Rest from './Rest.svelte';
  import HitDice from './HitDice.svelte';
  import CharacterHitPoints from './CharacterHitPoints.svelte';
  import TempHp from '../../actor/TempHp.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import ExhaustionInput from 'src/sheets/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>(
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

<ActorProfile useHpOverlay={SettingsProvider.settings.useHpOverlay.get()}>
  {#if incapacitated && (!SettingsProvider.settings.hideDeathSavesFromPlayers.get() || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={$context.system.attributes.death.success}
      failures={$context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      on:rollDeathSave={(event) =>
        $context.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      hasHpOverlay={SettingsProvider.settings.useHpOverlay.get()}
    />
  {/if}

  {#if SettingsProvider.settings.useExhaustion.get() && specificExhaustionConfig}
    <ExhaustionTracker
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      onlyShowOnHover={SettingsProvider.settings.showExhaustionOnHover.get() ||
        (SettingsProvider.settings.hideIfZero.get() &&
          $context.system.attributes.exhaustion === 0)}
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
      onlyShowOnHover={SettingsProvider.settings.showExhaustionOnHover.get() ||
        (SettingsProvider.settings.hideIfZero.get() &&
          $context.system.attributes.exhaustion === 0)}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  {#if SettingsProvider.settings.useCharacterInspiration.get()}
    <Inspiration
      inspired={$context.actor.system.attributes.inspiration}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={SettingsProvider.settings.showInspirationOnHover.get() ||
        (SettingsProvider.settings.hideIfZero.get() &&
          !$context.actor.system.attributes.inspiration)}
      animate={SettingsProvider.settings.animateInspiration.get()}
    />
  {/if}

  <CharacterHitPoints
    value={$context.system.attributes.hp.value}
    max={$context.system.attributes.hp.max}
    actor={$context.actor}
    {incapacitated}
  />

  <Rest />

  <HitDice />
</ActorProfile>
<TempHp />
