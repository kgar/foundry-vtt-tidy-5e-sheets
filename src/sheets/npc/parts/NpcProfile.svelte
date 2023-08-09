<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import CharacterPortrait from 'src/sheets/character/parts/ActorPortrait.svelte';
  import DeathSaves from 'src/sheets/DeathSaves.svelte';
  import Exhaustion from 'src/sheets/Exhaustion.svelte';
  import HpOverlay from 'src/sheets/HpOverlay.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormula from './NpcHealthFormula.svelte';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'npc'].includes(portraitStyle);

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }

  function showDeathSaves(): boolean {
    const isEnabledForAll =
      !SettingsProvider.settings.hiddenDeathSavesEnabled.get();
    return incapacitated && (isEnabledForAll || FoundryAdapter.userIsGm());
  }
</script>

<div class="profile-wrap">
  <div class="profile" class:round-portrait={useRoundedPortraitStyle}>
    <CharacterPortrait actor={$store.actor} />
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
        level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
        radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
        on:levelSelected={onLevelSelected}
        onlyShowOnHover={SettingsProvider.settings.exhaustionOnHover.get() ||
          (SettingsProvider.settings.hideIfZero.get() &&
            $store.system.attributes.exhaustion === 0)}
      />
    {/if}

    <NpcRest {useRoundedPortraitStyle} />
    <NpcHitPoints {useRoundedPortraitStyle} />

    <NpcHealthFormula />
  </div>
</div>
<TempHp />
