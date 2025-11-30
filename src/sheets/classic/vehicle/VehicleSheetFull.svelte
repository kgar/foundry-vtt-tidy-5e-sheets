<script lang="ts">
  import type { DropdownListOption } from 'src/types/types';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import VehicleProfile from './parts/VehicleProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import InlineTextDropdownList from '../../../components/inputs/InlineTextDropdownList.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import AcShieldVehicle from '../actor/AcShieldVehicle.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import AttributeBlock from '../actor/AttributeBlock.svelte';
  import { settings } from 'src/settings/settings.svelte';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import InlineSource from '../shared/InlineSource.svelte';
  import ActorOriginSummaryConfigFormApplication from 'src/applications/actor-origin-summary/ActorOriginSummaryConfigFormApplication.svelte';
  import ActorName from '../actor/ActorName.svelte';
  import { getVehicleSheetContext } from 'src/sheets/sheet-context.svelte';

  let selectedTabId: string = $state('');

  let context = $derived(getVehicleSheetContext());

  let sizes = $derived(
    Object.entries(context.config.actorSizes).map(
      ([key, size]: [string, any]) => ({
        value: key,
        text: size.label,
      }),
    ) satisfies DropdownListOption[],
  );

  let currentSize: DropdownListOption = $derived({
    value: context.system.traits.size,
    text: context.config.actorSizes[context.system.traits.size]?.label,
  });

  let vehicleTypes = $derived(
    Object.entries(context.config.vehicleTypes).map(
      ([key, label]: [string, any]) => ({
        value: key,
        text: label,
      }),
    ) satisfies DropdownListOption[],
  );

  let currentVehicleType: DropdownListOption = $derived({
    value: context.system.details.type,
    text: context.config.vehicleTypes[context.system.details.type],
  });

  let abilities = $derived(Object.entries<any>(context.abilities));

  const localize = FoundryAdapter.localize;
</script>

{#if context.viewableWarnings.length}
  <ActorWarnings warnings={context.viewableWarnings} />
{/if}
<header>
  <div class="flex-0">
    <VehicleProfile />
  </div>
  <div class="flex-grow-1">
    <div
      class="actor-name-row flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <ActorName />
      </div>
    </div>
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <div class="origin-summary">
      <div class="flex-row extra-small-gap">
        {#if context.editable}
          <InlineTextDropdownList
            options={sizes}
            selected={currentSize}
            onOptionClicked={(option) =>
              context.actor.update({
                'system.traits.size': option.value,
              })}
            title={localize('DND5E.Size')}
          />
        {:else}
          <span title={localize('DND5E.Size')}>{currentSize.text}</span>
        {/if}
      </div>
      <span>&#8226;</span>
      <div class="flex-row extra-small-gap">
        {#if context.editable}
          <InlineTextDropdownList
            options={vehicleTypes}
            selected={currentVehicleType}
            onOptionClicked={(option) =>
              context.actor.update({
                'system.details.type': option.value,
              })}
            title={localize('DND5E.VehicleType')}
          />
        {:else}
          <span title={localize('DND5E.VehicleType')}
            >{currentVehicleType.text}</span
          >
        {/if}
      </div>
      <span>&#8226;</span>
      {#key context.lockSensitiveFields}
        <InlineSource
          document={context.actor}
          keyPath="system.source"
          editable={context.unlocked}
        />
      {/key}
    </div>
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <ActorMovement class="header-line-margin" />
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <section class="actor-stats">
      <AcShieldVehicle />
      {#each abilities as [id, ability]}
        <VerticalLineSeparator />
        <div>
          <AttributeBlock
            {id}
            {ability}
            useConfigurationOption={false}
            useSavingThrowProficiency={false}
          />
        </div>
      {/each}
    </section>
  </div>
</header>
<Tabs tabs={context.tabs} bind:selectedTabId sheet={context.actor.sheet} />
<section class="tidy-sheet-body">
  <TabContents tabs={context.tabs} {selectedTabId} />
</section>

<style lang="less">
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);

    .actor-name-row {
      margin-bottom: 0.125rem;
    }

    .origin-summary {
      margin-left: 0.25rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      line-height: 1rem;
      padding: 0.1875rem 0 0.125rem 0;
      font-size: 0.75rem;

      :global(button) {
        font-size: 0.75rem;
        flex-grow: 0;
      }
    }
  }

  .tidy-sheet-body {
    :global(.item-table-cell:not(.primary) input) {
      text-align: center;
    }

    :global(.item-table-cell input) {
      height: 1.5rem;
    }
  }
</style>
