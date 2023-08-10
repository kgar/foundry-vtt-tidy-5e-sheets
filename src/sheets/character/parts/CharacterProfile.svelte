<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type ActorSheetContext } from 'src/types/types';
  import { SettingsProvider } from 'src/settings/settings';
  import Exhaustion from '../../Exhaustion.svelte';
  import Inspiration from '../../Inspiration.svelte';
  import HpOverlay from '../../HpOverlay.svelte';
  import DeathSaves from '../../DeathSaves.svelte';
  import Rest from '../../Rest.svelte';
  import HitDice from '../../HitDice.svelte';
  import CharacterHitPoints from './CharacterHitPoints.svelte';
  import ActorPortrait from '../../actor/ActorPortrait.svelte';
  import TempHp from '../../TempHp.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  let store = getContext<Readable<ActorSheetContext>>('store');

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'pc'].includes(portraitStyle);
  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    $store.actor.update({
      'system.attributes.exhaustion': event.detail.level,
    });
  }

  function showDeathSaves(): boolean {
    const isEnabledForAll =
      !SettingsProvider.settings.hiddenDeathSavesEnabled.get();
    return incapacitated && (isEnabledForAll || FoundryAdapter.userIsGm());
  }
</script>

<!-- TODO: Resolve linting comments after done re-styling -->
<!-- svelte-ignore a11y-missing-attribute -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <ActorPortrait actor={$store.actor} />

    {#if !SettingsProvider.settings.hpOverlayDisabled.get()}
      <HpOverlay {useRoundedPortraitStyle} actor={$store.actor} />
    {/if}

    {#if showDeathSaves()}
      <DeathSaves
        successes={$store.system.attributes.death.success}
        failures={$store.system.attributes.death.failure}
        {useRoundedPortraitStyle}
        on:rollDeathSave={(event) =>
          $store.actor.rollDeathSave({ event: event.detail.mouseEvent })}
      />
    {/if}

    {#if !SettingsProvider.settings.exhaustionDisabled.get() && !incapacitated}
      <Exhaustion
        level={$store.system.attributes.exhaustion}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
        on:levelSelected={onLevelSelected}
        onlyShowOnHover={SettingsProvider.settings.exhaustionOnHover.get() ||
          (SettingsProvider.settings.hideIfZero.get() &&
            $store.system.attributes.exhaustion === 0)}
      />
    {/if}

    {#if !SettingsProvider.settings.inspirationDisabled.get() && !incapacitated}
      <Inspiration
        inspired={$store.actor.system.attributes.inspiration}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-right'}
        onlyShowOnHover={SettingsProvider.settings.inspirationOnHover.get()}
        disableAnimation={SettingsProvider.settings.inspirationAnimationDisabled.get()}
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
  </div>
</div>
<TempHp />
