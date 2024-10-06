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

  $: exhaustionConfig = $context.settings.exhaustionConfig;
  $: specificExhaustionConfig =
    exhaustionConfig?.type === 'specific' ? exhaustionConfig : null;
</script>

<ActorProfile useHpOverlay={$context.settings.useHpOverlay}>
  {#if incapacitated && (!$context.settings.hideDeathSavesFromPlayers || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={$context.system.attributes.death.success}
      failures={$context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      on:rollDeathSave={(event) =>
        $context.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      hasHpOverlay={$context.settings.useHpOverlay}
    />
  {/if}

  {#if $context.settings.useExhaustion && specificExhaustionConfig}
    <ExhaustionTracker
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      onlyShowOnHover={$context.settings.showExhaustionOnHover ||
        ($context.settings.hideIfZero &&
          $context.system.attributes.exhaustion === 0)}
      exhaustionConfig={specificExhaustionConfig}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {:else if $context.settings.useExhaustion && $context.settings.exhaustionConfig?.type === 'open'}
    <ExhaustionInput
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      onlyShowOnHover={$context.settings.showExhaustionOnHover ||
        ($context.settings.hideIfZero &&
          $context.system.attributes.exhaustion === 0)}
      isActiveEffectApplied={ActiveEffectsHelper.isActiveEffectAppliedToField(
        $context.actor,
        'system.attributes.exhaustion',
      )}
    />
  {/if}

  {#if $context.settings.useCharacterInspiration}
    <Inspiration
      inspired={$context.actor.system.attributes.inspiration}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={$context.settings.showInspirationOnHover ||
        ($context.settings.hideIfZero &&
          !$context.actor.system.attributes.inspiration)}
      animate={$context.settings.animateInspiration}
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
