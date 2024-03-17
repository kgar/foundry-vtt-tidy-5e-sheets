<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { VehicleSheetContext } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from 'src/components/notice/Notice.svelte';
  import Currency from '../../actor/Currency.svelte';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import { settingStore } from 'src/settings/settings';
  import CargoList from '../parts/CargoList.svelte';
  import PassengerOrCrewList from '../parts/PassengerOrCrewList.svelte';

  let context = getContext<Readable<VehicleSheetContext>>('context');

  $: noCargoOrCrew =
    $context.cargo.some((section: any) => section.items.length > 0) === false;

  const localize = FoundryAdapter.localize;
</script>

{#if noCargoOrCrew && !$context.unlocked}
  <Notice>
    {localize('TIDY5E.EmptySection')}
  </Notice>
{/if}

<div class="scroll-container flex-column small-gap">
  {#each $context.cargo as section}
    {#if $context.unlocked || section.items.length}
      {#if section.editableName}
        <PassengerOrCrewList {section} />
      {:else}
        <CargoList {section} />
      {/if}
    {/if}
  {/each}
</div>

<TabFooter mode="vertical">
  <div class="currency">
    <Currency document={$context.actor} />
  </div>

  {#if $settingStore.useVehicleEncumbranceBar}
    <EncumbranceBar />
  {/if}
</TabFooter>