<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import ActorPortrait from 'src/sheets/actor/ActorPortrait.svelte';
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
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import { CONSTANTS } from 'src/constants';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const portraitStyle = SettingsProvider.settings.portraitStyle.get();
  const useRoundedPortraitStyle = ['all', 'npc'].includes(portraitStyle);

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }
</script>

<ActorProfile {useRoundedPortraitStyle}>
  {#if !SettingsProvider.settings.hpOverlayDisabledNpc.get()}
    <HpOverlay {useRoundedPortraitStyle} actor={$store.actor} />
  {/if}
  {#if incapacitated && (!SettingsProvider.settings.hiddenDeathSavesEnabled.get() || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={FoundryAdapter.tryGetFlag($store.actor, 'death')?.success ?? 0}
      failures={FoundryAdapter.tryGetFlag($store.actor, 'death')?.failure ?? 0}
      successesField="flags.{CONSTANTS.MODULE_ID}.death.success"
      failuresField="flags.{CONSTANTS.MODULE_ID}.death.failure"
      {useRoundedPortraitStyle}
      on:rollDeathSave={(event) =>
        $store.rollDeathSave({ event: event.detail.mouseEvent })}
      hpOverlayDisabled={SettingsProvider.settings.hpOverlayDisabledNpc.get()}
    />
  {/if}
  {#if !SettingsProvider.settings.exhaustionDisabled.get() && !incapacitated}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
    />
  {/if}

  <NpcHitPoints />
  {#if SettingsProvider.settings.restingForNpcsEnabled.get()}
    <NpcRest {useRoundedPortraitStyle} />
  {/if}
  <NpcHealthFormula />
</ActorProfile>
<TempHp />
