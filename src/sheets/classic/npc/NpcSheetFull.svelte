<script lang="ts">
  import SheetEditModeToggle from 'src/sheets/classic/actor/SheetEditModeToggle.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { NpcSheetContext, DropdownListOption } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcProfile from './parts/NpcProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import InlineTextDropdownList from '../../../components/inputs/InlineTextDropdownList.svelte';
  import { formatAsModifier } from 'src/utils/formatting';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import ActorMovement from '../actor/ActorMovement.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import ItemInfoCard from 'src/components/item-info-card/ItemInfoCard.svelte';
  import SheetMenu from '../actor/SheetMenu.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import InlineSource from '../shared/InlineSource.svelte';
  import InlineCreatureType from '../shared/InlineCreatureType.svelte';
  import ActorOriginSummaryConfigFormApplication from 'src/applications/actor-origin-summary/ActorOriginSummaryConfigFormApplication';
  import ActorName from '../actor/ActorName.svelte';
  import SpecialSaves from '../actor/SpecialSaves.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { isNil } from 'src/utils/data';
  import ActorLinkIndicator from 'src/components/actor-link-indicator/ActorLinkIndicator.svelte';

  let selectedTabId: string;

  let context = getContext<Readable<NpcSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  $: sizes = <DropdownListOption[]>Object.entries(
    $context.config.actorSizes,
  ).map(([abbreviation, size]: [string, any]) => ({
    value: abbreviation,
    text: size.label,
  }));

  $: currentSize = <DropdownListOption>{
    value: $context.system.traits.size,
    text: $context.config.actorSizes[$context.system.traits.size]?.label,
  };

  $: abilities = Object.entries<any>($context.abilities);

  const localize = FoundryAdapter.localize;
</script>

{#if $settingStore.itemCardsForNpcs}
  <ItemInfoCard />
{/if}

{#if $context.viewableWarnings.length}
  <ActorWarnings warnings={$context.viewableWarnings} />
{/if}
<header>
  <div class="flex-0">
    <NpcProfile />
  </div>
  <div class="flex-grow-1">
    <div
      class="actor-name-row flex-row justify-content-space-between align-items-center small-gap"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_HEADER_ROW}
    >
      <ActorLinkIndicator />

      <div
        class="actor-name"
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
      >
        <ActorName />
      </div>
      <div class="level-information">
        <div class="xp">
          <span
            >{localize('DND5E.ExperiencePointsFormat', {
              value: $context.system.details.xp.value ?? 0,
            })}</span
          >
        </div>
        <div
          class="challenge-rating"
          aria-label={localize('DND5E.CRLabel', {
            cr: $context.system.details.cr,
          })}
          title={!$context.unlocked ? localize('DND5E.ChallengeRating') : ''}
        >
          {localize('DND5E.AbbreviationCR')}
          {#if $context.unlocked}
            <NumberInput
              document={$context.actor}
              value={$context.source.details.cr}
              field="system.details.cr"
              step="any"
              cssClass="challenge-rating-input"
              selectOnFocus={true}
              title={localize('DND5E.ChallengeRating')}
            />
          {:else}
            <!-- svelte-ignore missing-declaration -->
            {dnd5e.utils.formatCR($context.system.details.cr)}
          {/if}
        </div>
        <SheetMenu defaultSettingsTab={CONSTANTS.TAB_USER_SETTINGS_NPCS} />
      </div>
    </div>
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <div class="origin-summary">
      <div class="flex-row extra-small-gap">
        {#if $context.editable}
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
        <span>&#8226;</span>
        {#key $context.lockSensitiveFields}
          <DelimitedTruncatedContent cssClass="flex-grow-1">
            <span class="flex-row extra-small-gap align-items-center">
              <InlineCreatureType />
              {#if !isNil($context.system.details.environment, '')}
                <span
                  class="environment"
                  title={localize('TIDY5E.EnvironmentTooltip', {
                    environment: $context.system.details.environment,
                  })}
                >
                  <i class="fas fa-tree" />
                </span>
              {/if}
            </span>

            <span
              class="origin-summary-text"
              title={$context.system.details.alignment}
              >{$context.system.details.alignment}</span
            >

            <InlineSource
              document={$context.actor}
              keyPath="system.source"
              editable={$context.unlocked}
            />
          </DelimitedTruncatedContent>
        {/key}
      </div>
      <div class="flex-row align-items-center extra-small-gap">
        <b class="proficiency">
          {localize('DND5E.Proficiency')}: {formatAsModifier(
            $context.system.attributes.prof,
          )}
        </b>
        {#if $context.unlocked}
          <button
            type="button"
            class="origin-summary-tidy inline-icon-button"
            on:click={() =>
              new ActorOriginSummaryConfigFormApplication(
                $context.actor,
              ).render(true)}
            title={localize('TIDY5E.OriginSummaryConfig')}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-cog" />
          </button>
        {/if}
      </div>
    </div>
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <div
      class="flex-row extra-small-gap justify-content-space-between header-line-margin"
    >
      <ActorMovement class="flex-1" />
      {#if $context.hasSpecialSaves}
        <SpecialSaves />
      {/if}
    </div>
    <HorizontalLineSeparator
      borderColor="light"
      class="header-line-margin-left"
    />
    <ActorHeaderStats
      {abilities}
      ac={$context.system.attributes.ac}
      init={$context.system.attributes.init}
    />
  </div>
</header>
<Tabs tabs={$context.tabs} bind:selectedTabId>
  <svelte:fragment slot="tab-end">
    {#if $context.editable}
      <SheetEditModeToggle
        hint={$settingStore.permanentlyUnlockNpcSheetForGm &&
        FoundryAdapter.userIsGm()
          ? localize('TIDY5E.Settings.PermanentlyUnlockNPCSheetForGM.title')
          : null}
      />
    {/if}
  </svelte:fragment>
</Tabs>
<section class="tidy-sheet-body">
  <TabContents tabs={$context.tabs} {selectedTabId} />
</section>

<style lang="scss">
  header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  .level-information {
    display: flex;
    flex-direction: row;
    gap: 0.25rem;
    align-items: stretch;
    font-family: var(--t5e-title-font-family);
    font-weight: 700;

    .xp {
      font-size: 1rem;
      margin-right: 0.25rem;
      color: var(--t5e-secondary-color);
      white-space: nowrap;
      align-self: center;
    }
    .challenge-rating {
      padding: 0.25rem 0.375rem;
      border-radius: 0.1875rem;
      background: var(--t5e-faint-color);
      color: var(--t5e-secondary-color);
      font-size: 1.25rem;
      line-height: 1;
      height: 1.5rem;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 0.25rem;

      :global(.challenge-rating-input) {
        max-width: 1.75rem;
      }
    }
    :global(.level [contenteditable]) {
      color: var(--t5e-secondary-color);
    }
  }

  .origin-summary {
    margin-left: 0.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.25rem;
    line-height: 1;
    padding: 0.1875rem 0 0.125rem 0;
    line-height: 1rem;

    &,
    :global(button) {
      font-size: 0.75rem;
    }
  }

  .actor-name-row {
    margin-bottom: 0.125rem;
  }

  .proficiency {
    white-space: nowrap;
  }
</style>
