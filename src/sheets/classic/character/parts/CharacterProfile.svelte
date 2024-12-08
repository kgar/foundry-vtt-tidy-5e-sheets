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
  import { settings } from 'src/settings/settings.svelte';
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

<ActorProfile useHpOverlay={settings.useHpOverlay}>
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
      hasHpOverlay={settings.useHpOverlay}
    />
  {/if}

  {#if settings.useExhaustion && settings.exhaustionConfig.type === 'specific'}
    <ExhaustionTracker
      level={context.system.attributes.exhaustion}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      {onLevelSelected}
      onlyShowOnHover={settings.showExhaustionOnHover ||
        (settings.hideIfZero &&
          context.system.attributes.exhaustion === 0)}
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
      onlyShowOnHover={settings.showExhaustionOnHover ||
        (settings.hideIfZero &&
          context.system.attributes.exhaustion === 0)}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  {#if settings.useCharacterInspiration}
    <Inspiration
      inspired={context.actor.system.attributes.inspiration}
      radiusClass={context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={settings.showInspirationOnHover ||
        (settings.hideIfZero &&
          !context.actor.system.attributes.inspiration)}
      animate={settings.animateInspiration}
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
