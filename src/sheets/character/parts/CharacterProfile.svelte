<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import Exhaustion from '../../Exhaustion.svelte';
  import Inspiration from '../../Inspiration.svelte';
  import DeathSaves from '../../DeathSaves.svelte';
  import Rest from '../../Rest.svelte';
  import HitDice from '../../HitDice.svelte';
  import CharacterHitPoints from './CharacterHitPoints.svelte';
  import TempHp from '../../TempHp.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import { settingStore } from 'src/settings/settings';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const portraitStyle = $settingStore.portraitStyle;
  const useRoundedPortraitStyle = ['all', 'pc'].includes(portraitStyle);
  const useHpOverlay = !$settingStore.hpOverlayDisabled;

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    $store.actor.update({
      'system.attributes.exhaustion': event.detail.level,
    });
  }
</script>

<!-- TODO: Resolve linting comments after done re-styling -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<ActorProfile {useRoundedPortraitStyle} {useHpOverlay}>
  {#if incapacitated && (!$settingStore.hiddenDeathSavesEnabled || FoundryAdapter.userIsGm())}
    <DeathSaves
      {useRoundedPortraitStyle}
      successes={$store.system.attributes.death.success}
      failures={$store.system.attributes.death.failure}
      successesField="system.attributes.death.success"
      failuresField="system.attributes.death.failure"
      on:rollDeathSave={(event) =>
        $store.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      hpOverlayDisabled={$settingStore.hpOverlayDisabled}
    />
  {/if}

  {#if !$settingStore.exhaustionDisabled && !incapacitated}
    <Exhaustion
      level={$store.system.attributes.exhaustion}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
      onlyShowOnHover={$settingStore.exhaustionOnHover ||
        ($settingStore.hideIfZero &&
          $store.system.attributes.exhaustion === 0)}
    />
  {/if}

  {#if !$settingStore.inspirationDisabled && !incapacitated}
    <Inspiration
      inspired={$store.actor.system.attributes.inspiration}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
      onlyShowOnHover={$settingStore.inspirationOnHover}
      disableAnimation={$settingStore.inspirationAnimationDisabled}
    />
  {/if}

  <CharacterHitPoints
    value={$store.system.attributes.hp.value}
    max={$store.system.attributes.hp.max}
    actor={$store.actor}
    {useRoundedPortraitStyle}
    {incapacitated}
  />

  {#if !incapacitated}
    <Rest {useRoundedPortraitStyle} />
  {/if}

  {#if !incapacitated}
    <HitDice
      hitDice={$store.system.attributes.hd}
      actorLevel={$store.system.details.level}
      actor={$store.actor}
      {useRoundedPortraitStyle}
    />
  {/if}
</ActorProfile>
<TempHp />
