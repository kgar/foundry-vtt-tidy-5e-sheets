<script lang="ts">
  import type {
    Tab,
    TidyDropdownOption,
    VehicleSheetContext,
  } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import VehicleAttributesTab from './VehicleAttributesTab.svelte';
  import { CONSTANTS } from 'src/constants';
  import VehicleCargoAndCrewTab from './VehicleCargoAndCrewTab.svelte';
  import VehicleDescriptionTab from './VehicleDescriptionTab.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import VehicleProfile from './parts/VehicleProfile.svelte';
  import ActorEffectsTab from '../actor/ActorEffectsTab.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import TidyDropdownList from '../TidyDropdownList.svelte';
  import Tidy5eActorOriginSummaryConfig from '../tidy5e-actor-origin-summary-config';
  import { isNil } from 'src/utils/data';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import AcShieldVehicle from '../actor/AcShieldVehicle.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import AttributeBlock from '../AttributeBlock.svelte';
  import ItemInfoCard from 'src/components/item-info-card/ItemInfoCard.svelte';
  import SheetMenu from '../actor/SheetMenu.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActorWarnings from '../ActorWarnings.svelte';

  export let selectedTabId: string;

  let store = getContext<Readable<VehicleSheetContext>>('store');

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_VEHICLE_ATTRIBUTES,
      displayName: 'DND5E.Attributes',
      content: {
        component: VehicleAttributesTab,
      },
    },
    {
      id: CONSTANTS.TAB_VEHICLE_CARGO_AND_CREW,
      displayName: 'DND5E.VehicleCargoCrew',
      content: {
        component: VehicleCargoAndCrewTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        props: {
          classicControlsEnabled: true,
        },
      },
    },
    {
      id: CONSTANTS.TAB_VEHICLE_DESCRIPTION,
      displayName: 'DND5E.Description',
      content: {
        component: VehicleDescriptionTab,
      },
    },
  ];

  if (!tabs.some((tab) => tab.id === selectedTabId)) {
    selectedTabId = tabs[0]?.id;
  }

  $: sizes = <TidyDropdownOption[]>Object.entries($store.config.actorSizes).map(
    ([abbreviation, size]) => ({
      value: abbreviation,
      text: size as string,
    })
  );

  $: currentSize = <TidyDropdownOption>{
    value: $store.system.traits.size,
    text: $store.config.actorSizes[$store.system.traits.size],
  };

  $: abilities = Object.entries<any>($store.abilities);

  const localize = FoundryAdapter.localize;
</script>

{#if $settingStore.itemCardsForNpcs}
  <ItemInfoCard />
{/if}

{#if $store.warnings.length}
  <ActorWarnings warnings={$store.warnings} />
{/if}
<header>
  <div class="flex-0">
    <VehicleProfile />
  </div>
  <div class="flex-grow-1">
    <div
      class="actor-name-row flex-row justify-content-space-between align-items-center extra-small-gap"
    >
      <div class="actor-name">
        <ContentEditableFormField
          element="h1"
          document={$store.actor}
          field="name"
          value={$store.actor.name}
          editable={$store.owner && !$store.lockSensitiveFields}
          spellcheck={false}
          placeholder={localize('DND5E.Name')}
          dataMaxLength={40}
        />
      </div>
      <SheetMenu defaultSettingsTab={CONSTANTS.TAB_SETTINGS_VEHICLES} />
    </div>
    <HorizontalLineSeparator borderColor="light" />
    <div class="origin-summary">
      <div class="flex-row extra-small-gap">
        {#if $store.owner}
          <TidyDropdownList
            options={sizes}
            selected={currentSize}
            on:optionClicked={(event) =>
              $store.actor.update({
                'system.traits.size': event.detail.value,
              })}
            title={localize('DND5E.Size')}
          />
        {:else}
          <span title={localize('DND5E.Size')}>{currentSize.text}</span>
        {/if}
      </div>
      <span>&#8226;</span>
      {#key $store.lockSensitiveFields}
        <DelimitedTruncatedContent cssClass="flex-1">
          <span class="flex-row extra-small-gap align-items-center">
            <span>{localize('DND5E.Vehicle')}</span>
          </span>

          <ContentEditableFormField
            element="span"
            document={$store.actor}
            field="system.traits.dimensions"
            value={$store.system.traits.dimensions}
            title={$store.system.traits.dimensions}
            editable={$store.owner && !$store.lockSensitiveFields}
            placeholder={localize('DND5E.Dimensions')}
            selectOnFocus={true}
          />
          <ContentEditableFormField
            element="span"
            document={$store.actor}
            field="system.details.source"
            value={$store.system.details.source}
            editable={$store.owner && !$store.lockSensitiveFields}
            placeholder={localize('DND5E.Source')}
            title="{localize('DND5E.Source')} {!isNil(
              $store.system.details.source,
              ''
            )
              ? '| ' + $store.system.details.source
              : ''}"
            selectOnFocus={true}
          />
        </DelimitedTruncatedContent>
      {/key}
      <div class="flex-row align-items-center extra-small-gap">
        {#if $store.owner && !$store.lockSensitiveFields}
          <a
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($store.actor).render(true)}
            class="origin-summary-tidy"
            title={localize('T5EK.OriginSummaryConfig')}
          >
            <i class="fas fa-cog" />
          </a>
        {/if}
      </div>
    </div>
    <HorizontalLineSeparator borderColor="light" />
    <ActorMovementRow actor={$store.actor} movement={$store.movement} />
    <HorizontalLineSeparator borderColor="light" />
    <section class="actor-stats">
      <AcShieldVehicle />
      {#each abilities as [id, ability]}
        <VerticalLineSeparator />
        <div>
          <AttributeBlock
            abbreviation={id}
            {ability}
            useConfigurationOption={false}
            useSavingThrowProficiency={false}
          />
        </div>
      {/each}
    </section>
  </div>
</header>
<Tabs {tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $store.owner}
      <AllowEditLock
        hint={$settingStore.enablePermanentUnlockOnVehicleIfYouAreGM &&
        FoundryAdapter.userIsGm()
          ? localize(
              'T5EK.Settings.EnablePermanentUnlockOnVehicleIfYouAreGM.title'
            )
          : null}
      />
    {/if}
  </svelte:fragment>
</Tabs>
<section class="sheet-body">
  <TabContents {tabs} {selectedTabId} />
</section>

<style lang="scss">
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5ek-header-background);

    .actor-name-row {
      margin-bottom: 0.125rem;
    }

    .origin-summary {
      margin-left: 0.25rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.75rem;
      line-height: 1;
      padding: 0.1875rem 0 0.125rem 0;
    }
  }

  .sheet-body {
    :global(.item-table-cell:not(.primary) input) {
      text-align: center;
    }

    :global(.item-table-cell input) {
      height: 1.5rem;
    }
  }
</style>
