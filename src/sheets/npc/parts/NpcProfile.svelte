<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DeathSaves from 'src/sheets/DeathSaves.svelte';
  import Exhaustion from 'src/sheets/Exhaustion.svelte';
  import type { NpcSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcHitPoints from './NpcHitPoints.svelte';
  import TempHp from 'src/sheets/TempHp.svelte';
  import NpcRest from './NpcRest.svelte';
  import NpcHealthFormula from './NpcHealthFormula.svelte';
  import ActorProfile from 'src/sheets/actor/ActorProfile.svelte';
  import { CONSTANTS } from 'src/constants';
  import { settingStore } from 'src/settings/settings';

  let store = getContext<Readable<NpcSheetContext>>('store');

  const useRoundedPortraitStyle = ['all', 'npc'].includes(
    $settingStore.portraitStyle
  );
  const useHpOverlay = !$settingStore.hpOverlayDisabledNpc;

  $: incapacitated =
    ($store.actor?.system?.attributes?.hp?.value ?? 0) <= 0 &&
    $store.actor?.system?.attributes?.hp?.max !== 0;

  function onLevelSelected(event: CustomEvent<{ level: number }>) {
    FoundryAdapter.setFlag($store.actor, 'exhaustion', event.detail.level);
  }
</script>

<ActorProfile {useRoundedPortraitStyle} {useHpOverlay}>
  {#if incapacitated && (!$settingStore.hiddenDeathSavesEnabled || FoundryAdapter.userIsGm())}
    <DeathSaves
      successes={FoundryAdapter.tryGetFlag($store.actor, 'death')?.success ?? 0}
      failures={FoundryAdapter.tryGetFlag($store.actor, 'death')?.failure ?? 0}
      successesField="flags.{CONSTANTS.MODULE_ID}.death.success"
      failuresField="flags.{CONSTANTS.MODULE_ID}.death.failure"
      {useRoundedPortraitStyle}
      on:rollDeathSave={(event) =>
        $store.rollDeathSave({ event: event.detail.mouseEvent })}
      hpOverlayDisabled={$settingStore.hpOverlayDisabledNpc}
    />
  {/if}
  {#if !$settingStore.exhaustionDisabled && !incapacitated}
    <Exhaustion
      level={FoundryAdapter.tryGetFlag($store.actor, 'exhaustion') ?? 0}
      radiusClass={useRoundedPortraitStyle ? 'rounded' : 'top-left'}
      on:levelSelected={onLevelSelected}
    />
  {/if}

  <NpcHitPoints />
  {#if $settingStore.restingForNpcsEnabled}
    <NpcRest {useRoundedPortraitStyle} />
  {/if}
  <NpcHealthFormula />
</ActorProfile>
<TempHp />
