<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ExhaustionTracker from '../../actor/ExhaustionTracker.svelte';
  import Inspiration from './Inspiration.svelte';
  import DeathSaves from '../../actor/DeathSaves.svelte';
  import Rest from './Rest.svelte';
  import HitDice from './HitDice.svelte';
  import CharacterHitPoints from './CharacterHitPoints.svelte';
  import TempHp from '../../actor/TempHp.svelte';
  import ActorProfile from 'src/sheets/classic/actor/ActorProfile.svelte';
  import { settingStore } from 'src/settings/settings.svelte';
  import ExhaustionInput from 'src/sheets/classic/actor/ExhaustionInput.svelte';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = getCharacterSheetContext();

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

<ActorProfile useHpOverlay={$settingStore.useHpOverlay}>
  {#if incapacitated && (!$settingStore.hideDeathSavesFromPlayers || FoundryAdapter.userIsGm())}
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
      hasHpOverlay={$settingStore.useHpOverlay}
    />
  {/if}

  {#if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={context.system.attributes.exhaustion}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      onlyShowOnHover={$settingStore.showExhaustionOnHover ||
        ($settingStore.hideIfZero &&
          context.system.attributes.exhaustion === 0)}
      exhaustionConfig={$settingStore.exhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if $settingStore.useExhaustion && $settingStore.exhaustionConfig.type === 'open'}
    <ExhaustionInput
      level={context.system.attributes.exhaustion}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      onlyShowOnHover={$settingStore.showExhaustionOnHover ||
        ($settingStore.hideIfZero &&
          context.system.attributes.exhaustion === 0)}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  {#if $settingStore.useCharacterInspiration}
    <Inspiration
      inspired={context.actor.system.attributes.inspiration}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={$settingStore.showInspirationOnHover ||
        ($settingStore.hideIfZero &&
          !context.actor.system.attributes.inspiration)}
      animate={$settingStore.animateInspiration}
    />
  {/if}

  <CharacterHitPoints
    value={context.system.attributes.hp.value}
    max={context.system.attributes.hp.max}
    actor={context.actor}
    {incapacitated}
  />

  <Rest />

  <HitDice />
</ActorProfile>
<TempHp />
