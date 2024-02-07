<script lang="ts">
  import AllowEditLock from 'src/sheets/actor/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type { NpcSheetContext, DropdownListOption } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcProfile from './parts/NpcProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import InlineTextDropdownList from '../../components/inputs/InlineTextDropdownList.svelte';
  import { formatAsModifier } from 'src/utils/formatting';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import ItemInfoCard from 'src/components/item-info-card/ItemInfoCard.svelte';
  import SheetMenu from '../actor/SheetMenu.svelte';
  import { settingStore } from 'src/settings/settings';
  import ActorWarnings from '../actor/ActorWarnings.svelte';
  import InlineSource from '../shared/InlineSource.svelte';
  import InlineCreatureType from '../shared/InlineCreatureType.svelte';
  import ActorOriginSummaryConfigFormApplication from 'src/applications/actor-origin-summary/ActorOriginSummaryConfigFormApplication';

  let selectedTabId: string;

  let context = getContext<Readable<NpcSheetContext>>('context');

  $: sizes = <DropdownListOption[]>Object.entries(
    $context.config.actorSizes,
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

<div class="token-link-wrapper {$context.tokenState}">
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
        {#if $context.tokenState === 'linked'}
          <i
            class="link-state fas fa-link"
            title={localize('TIDY5E.TokenLinked')}
          />
        {:else if $context.tokenState === 'unlinked'}
          <i
            class="link-state fas fa-unlink"
            title={localize('TIDY5E.TokenUnlinked')}
          />
        {/if}

        <div
          class="actor-name"
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.NAME_CONTAINER}
        >
          <ContentEditableFormField
            element="h1"
            document={$context.actor}
            field="name"
            value={$context.actor.name}
            editable={$context.editable && !$context.lockSensitiveFields}
            spellcheck={false}
            placeholder={localize('DND5E.Name')}
            dataMaxLength={40}
          />
        </div>
        <div class="level-information">
          <div class="xp">
            <span>{$context.system.details.xp.value} XP</span>
          </div>
          <div class="level">
            {localize('DND5E.AbbreviationCR')}
            <ContentEditableFormField
              element="span"
              editable={!$context.lockSensitiveFields}
              document={$context.actor}
              field="system.details.cr"
              placeholder="0"
              dataMaxLength={4}
              value={$context.labels.cr}
              saveAs="number"
              selectOnFocus={true}
            />
          </div>
          <SheetMenu defaultSettingsTab={CONSTANTS.TAB_SETTINGS_NPCS} />
        </div>
      </div>
      <HorizontalLineSeparator borderColor="light" />
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
                <span
                  class="environment"
                  title={localize('TIDY5E.EnvironmentTooltip', {
                    environment: $context.system.details.environment,
                  })}
                >
                  <i class="fas fa-tree" />
                </span>
              </span>

              <span
                class="origin-summary-text"
                title={$context.system.details.alignment}
                >{$context.system.details.alignment}</span
              >

              <InlineSource
                document={$context.actor}
                keyPath="system.details.source"
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
          {#if $context.editable && !$context.lockSensitiveFields}
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
      <HorizontalLineSeparator borderColor="light" />
      <ActorMovementRow />
      <HorizontalLineSeparator borderColor="light" />
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
        <AllowEditLock
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
</div>

<style lang="scss">
  .token-link-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;

    .link-state {
      padding: 0.25rem 0.1875rem 0.1875rem 0.25rem;
      margin-top: -0.0625rem;
      border-radius: 0.3125rem;
    }

    &.linked {
      box-shadow: 0 0 0.25rem 0.125rem var(--t5e-linked-accent-color) inset;

      .link-state.fa-link {
        background: var(--t5e-linked-light-color);
      }
    }

    &.unlinked {
      box-shadow: 0 0 0.25rem 0.125rem var(--t5e-unlinked-accent-color) inset;

      .link-state.fa-unlink {
        background: var(--t5e-unlinked-light-color);
      }
    }
  }

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
    .level {
      padding: 0.25rem 0.375rem;
      border-radius: 0.1875rem;
      background: var(--t5e-faint-color);
      color: var(--t5e-secondary-color);
      font-size: 1.25rem;
      line-height: 1;
      height: 1.5rem;
      white-space: nowrap;

      :global(span) {
        display: inline-block;
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
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.1875rem 0 0.125rem 0;
    line-height: 1rem;
  }

  .actor-name-row {
    margin-bottom: 0.125rem;
  }

  .proficiency {
    white-space: nowrap;
  }
</style>
