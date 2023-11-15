<script lang="ts">
  import type {
    Tab,
    DropdownListOption,
    VehicleSheetContext,
  } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import AllowEditLock from 'src/sheets/actor/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import VehicleProfile from './parts/VehicleProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import InlineTextDropdownList from '../../components/inputs/InlineTextDropdownList.svelte';
  import Tidy5eActorOriginSummaryConfig from '../../dialogs/Tidy5eActorOriginSummaryConfig';
  import { isNil } from 'src/utils/data';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import AcShieldVehicle from '../actor/AcShieldVehicle.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import AttributeBlock from '../actor/AttributeBlock.svelte';
  import ItemInfoCard from 'src/components/item-info-card/ItemInfoCard.svelte';
  import SheetMenu from '../actor/SheetMenu.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import { currentVehicleSheetTabs } from 'src/state/vehicle-sheet-state';

  let selectedTabId: string;

  let context = getContext<Readable<VehicleSheetContext>>('context');

  let tabs: Tab[];
  $: {
    tabs = $currentVehicleSheetTabs.getTabs($context);
  }

  $: sizes = <DropdownListOption[]>Object.entries(
    $context.config.actorSizes
  ).map(([abbreviation, size]) => ({
    value: abbreviation,
    text: size as string,
  }));

  $: currentSize = <DropdownListOption>{
    value: $context.system.traits.size,
    text: $context.config.actorSizes[$context.system.traits.size],
  };

  $: abilities = Object.entries<any>($context.abilities);

  const localize = FoundryAdapter.localize;
</script>

{#if $settingStore.itemCardsForNpcs}
  <ItemInfoCard />
{/if}

{#if $context.warnings.length}
  <ActorWarnings warnings={$context.warnings} />
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
          document={$context.actor}
          field="name"
          value={$context.actor.name}
          editable={$context.owner && !$context.lockSensitiveFields}
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
        {#if $context.owner}
          <InlineTextDropdownList
            options={sizes}
            selected={currentSize}
            on:optionClicked={(event) =>
              $context.actor.update({
                'system.traits.size': event.detail.value,
              })}
            title={localize('DND5E.Size')}
          />
        {:else}
          <span title={localize('DND5E.Size')}>{currentSize.text}</span>
        {/if}
      </div>
      <span>&#8226;</span>
      {#key $context.lockSensitiveFields}
        <DelimitedTruncatedContent cssClass="flex-1">
          <span class="flex-row extra-small-gap align-items-center">
            <span>{localize('DND5E.Vehicle')}</span>
          </span>

          <ContentEditableFormField
            element="span"
            document={$context.actor}
            field="system.traits.dimensions"
            value={$context.system.traits.dimensions}
            title={$context.system.traits.dimensions}
            editable={$context.owner && !$context.lockSensitiveFields}
            placeholder={localize('DND5E.Dimensions')}
            selectOnFocus={true}
          />
          <ContentEditableFormField
            element="span"
            document={$context.actor}
            field="system.details.source"
            value={$context.system.details.source}
            editable={$context.owner && !$context.lockSensitiveFields}
            placeholder={localize('DND5E.Source')}
            title="{localize('DND5E.Source')} {!isNil(
              $context.system.details.source,
              ''
            )
              ? '| ' + $context.system.details.source
              : ''}"
            selectOnFocus={true}
          />
        </DelimitedTruncatedContent>
      {/key}
      <div class="flex-row align-items-center extra-small-gap">
        {#if $context.owner && !$context.lockSensitiveFields}
          <button
            type="button"
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($context.actor).render(true)}
            class="origin-summary-tidy inline-icon-button"
            title={localize('T5EK.OriginSummaryConfig')}
          >
            <i class="fas fa-cog" />
          </button>
        {/if}
      </div>
    </div>
    <HorizontalLineSeparator borderColor="light" />
    <ActorMovementRow />
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
    {#if $context.owner}
      <AllowEditLock
        hint={$settingStore.permanentlyUnlockVehicleSheetForGm &&
        FoundryAdapter.userIsGm()
          ? localize(
              'T5EK.Settings.PermanentlyUnlockVehicleSheetForGM.title'
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
      line-height: 1rem;
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
