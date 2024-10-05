<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    VehicleCargoSection,
    VehicleSheetContext,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import Notice from 'src/components/notice/Notice.svelte';
  import Currency from '../../actor/Currency.svelte';
  import EncumbranceBar from '../../actor/EncumbranceBar.svelte';
  import TabFooter from '../../actor/TabFooter.svelte';
  import CargoList from '../parts/CargoList.svelte';
  import PassengerOrCrewList from '../parts/PassengerOrCrewList.svelte';
  import { CONSTANTS } from 'src/constants';
  import { SettingsProvider } from 'src/settings/settings';

  let context = getContext<Readable<VehicleSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: noCargoOrCrew =
    $context.cargo.some(
      (section: VehicleCargoSection) => section.items.length > 0,
    ) === false;

  const localize = FoundryAdapter.localize;
</script>

{#if noCargoOrCrew && !$context.unlocked}
  <Notice>
    {localize('TIDY5E.EmptySection')}
  </Notice>
{/if}

<div class="scroll-container flex-column small-gap">
  {#each $context.cargo as section (section.key)}
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

  {#if SettingsProvider.settings.useVehicleEncumbranceBar.get()}
    <EncumbranceBar />
  {/if}
</TabFooter>
