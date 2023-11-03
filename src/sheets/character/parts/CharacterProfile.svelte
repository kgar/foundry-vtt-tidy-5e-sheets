<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type CharacterSheetContext } from 'src/types/types';
  import Exhaustion from '../../actor/Exhaustion.svelte';
  import Inspiration from './Inspiration.svelte';
  import DeathSaves from '../../actor/DeathSaves.svelte';
  import Rest from './Rest.svelte';
  import HitDice from './HitDice.svelte';
  import CharacterHitPoints from './CharacterHitPoints.svelte';
  import TempHp from '../../actor/TempHp.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import { settingStore } from 'src/settings/settings';

  let context = getContext<Readable<CharacterSheetContext>>('context');

  $: incapacitated =
    ($context.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $context.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    $context.actor.update({
      'system.attributes.exhaustion': event.detail.level,
    });
  }
</script>

<ActorProfile useHpOverlay={!$settingStore.hpOverlayDisabled}>
  {#if incapacitated && (!$settingStore.hiddenDeathSavesEnabled || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={$context.system.attributes.death.success}
      failures={$context.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      on:rollDeathSave={(event) =>
        $context.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      hpOverlayDisabled={$settingStore.hpOverlayDisabled}
    />
  {/if}

  {#if !$settingStore.exhaustionDisabled}
    <Exhaustion
      level={$context.system.attributes.exhaustion}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      onlyShowOnHover={$settingStore.exhaustionOnHover ||
        ($settingStore.hideIfZero &&
          $context.system.attributes.exhaustion === 0)}
    />
  {/if}

  {#if !$settingStore.inspirationDisabled}
    <Inspiration
      inspired={$context.actor.system.attributes.inspiration}
      radiusClass={$context.useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={$settingStore.inspirationOnHover ||
        ($settingStore.hideIfZero &&
          !$context.actor.system.attributes.inspiration)}
      disableAnimation={$settingStore.inspirationAnimationDisabled}
    />
  {/if}

  <CharacterHitPoints
    value={$context.system.attributes.hp.value}
    max={$context.system.attributes.hp.max}
    actor={$context.actor}
    {incapacitated}
  />

  <Rest />

  <HitDice
    hitDice={$context.system.attributes.hd}
    actorLevel={$context.system.details.level}
    actor={$context.actor}
  />
</ActorProfile>
<TempHp />
