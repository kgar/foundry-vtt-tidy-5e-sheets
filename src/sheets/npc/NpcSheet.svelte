<script lang="ts">
  import AllowEditLock from 'src/components/shared/AllowEditLock.svelte';
  import TabContents from 'src/components/tabs/TabContents.svelte';
  import Tabs from 'src/components/tabs/Tabs.svelte';
  import { CONSTANTS } from 'src/constants';
  import type {
    NpcSheetContext,
    Tab,
    TidyDropdownOption,
  } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import NpcAbilitiesTab from './NpcAbilitiesTab.svelte';
  import NpcSpellbookTab from './NpcSpellbookTab.svelte';
  import NpcBiographyTab from './NpcBiographyTab.svelte';
  import NpcProfile from './parts/NpcProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyDropdownList from '../TidyDropdownList.svelte';
  import { isNil } from 'src/utils/data';
  import { formatAsModifier } from 'src/utils/formatting';
  import Tidy5eActorOriginSummaryConfig from '../tidy5e-actor-origin-summary-config';
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import ActorMovementRow from '../actor/ActorMovementRow.svelte';
  import ActorEffectsTab from '../actor/ActorEffectsTab.svelte';
  import ActorHeaderStats from '../actor/ActorHeaderStats.svelte';
  import { SettingsProvider } from 'src/settings/settings';
  import ActorJournalTab from 'src/components/player-character/ActorJournalTab.svelte';

  export let selectedTabId: string;

  let store = getContext<Readable<NpcSheetContext>>('store');

  $: console.log($store);

  let tabs: Tab[] = [
    {
      id: CONSTANTS.TAB_NPC_ABILITIES,
      displayName: 'T5EK.Abilities',
      content: {
        component: NpcAbilitiesTab,
      },
    },
  ];

  if (!SettingsProvider.settings.hideSpellbookTabNpc.get()) {
    tabs.push({
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
      },
    });
  }

  tabs.push(
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
      id: CONSTANTS.TAB_NPC_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
    }
  );

  if (!SettingsProvider.settings.journalTabNPCDisabled.get()) {
    tabs.push({
      id: CONSTANTS.TAB_NPC_JOURNAL,
      displayName: 'TIDY5E.Journal',
      content: {
        component: ActorJournalTab,
      },
    });
  }

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

<div class="token-link-wrapper {$store.tokenState}">
  <header class="tidy5e-kgar-sheet-header flex-row">
    <div class="flex-0">
      <NpcProfile />
    </div>
    <div class="flex-grow-1">
      <div
        class="actor-name-row flex-row justifty-content-space-between align-items-center extra-small-gap"
      >
        {#if $store.tokenState === 'linked'}
          <i
            class="link-state fas fa-link"
            title={localize('TIDY5E.TokenLinked')}
          />
        {:else if $store.tokenState === 'unlinked'}
          <i
            class="link-state fas fa-unlink"
            title={localize('TIDY5E.TokenUnlinked')}
          />
        {/if}

        <div class="actor-name">
          <ContentEditableFormField
            element="h1"
            document={$store.actor}
            field="name"
            value={$store.actor.name}
            editable={$store.owner}
            spellcheck={false}
            placeholder={localize('DND5E.Name')}
            dataMaxLength={40}
          />
        </div>
        <div class="level-information">
          <div class="xp">
            <span>{$store.system.details.xp.value} XP</span>
          </div>
          <div class="level">
            {localize('DND5E.AbbreviationCR')}
            <ContentEditableFormField
              element="span"
              editable={true}
              document={$store.actor}
              field="system.details.cr"
              placeholder="0"
              dataMaxLength={4}
              value={$store.labels.cr}
              saveAs="number"
            />
          </div>
        </div>
      </div>
      <HorizontalLineSeparator borderStyle="light" />
      <div class="origin-summary">
        <div class="flex-row extra-small-gap">
          <TidyDropdownList
            options={sizes}
            selected={currentSize}
            on:optionClicked={(event) =>
              $store.actor.update({
                'system.traits.size': event.detail.value,
              })}
          />
          <span>&#8226;</span>
          <DelimitedTruncatedContent cssClass="flex-grow-1">
            <span class="flex-row extra-small-gap align-items-center">
              <a
                class="truncate highlight-on-hover"
                role="button"
                on:click={() =>
                  new dnd5e.applications.actor.ActorTypeConfig(
                    $store.actor
                  ).render(true)}
                title="{$store.labels.type} ({localize(
                  'DND5E.CreatureTypeConfig'
                )})"
                >{#if isNil($store.labels.type, '')}
                  {localize('DND5E.CreatureType')}
                {:else}
                  {$store.labels.type}
                {/if}</a
              >
              <span
                class="environment"
                title="{localize('TIDY5E.Environment')}: {$store.system.details
                  .environment}"
              >
                <i class="fas fa-tree" />
              </span>
            </span>

            <span
              class="origin-summary-text"
              title={$store.system.details.alignment}
              >{$store.system.details.alignment}</span
            >
            <span
              class="origin-summary-text source source-info"
              title={$store.system.details.source}
              >{$store.system.details.source}</span
            >
          </DelimitedTruncatedContent>
        </div>
        <div class="flex-row align-items-center extra-small-gap">
          <b class="proficiency">
            {localize('DND5E.Proficiency')}: {formatAsModifier(
              $store.system.attributes.prof
            )}
          </b>
          {#if $store.owner}
            <a
              on:click={() =>
                new Tidy5eActorOriginSummaryConfig($store.actor).render(true)}
              class="origin-summary-tidy"
              title={localize('TIDY5E.OriginSummaryConfig')}
            >
              <i class="fas fa-cog" />
            </a>
          {/if}
        </div>
      </div>
      <HorizontalLineSeparator borderStyle="light" />
      <ActorMovementRow actor={$store.actor} movement={$store.movement} />
      <HorizontalLineSeparator borderStyle="light" />
      <ActorHeaderStats
        {abilities}
        ac={$store.system.attributes.ac}
        init={$store.system.attributes.init}
        actor={$store.actor}
      />
    </div>
  </header>
  <Tabs {tabs} bind:selectedTabId>
    <svelte:fragment slot="tab-end">
      {#if $store.owner}
        <AllowEditLock />
      {/if}
    </svelte:fragment>
  </Tabs>
  <section class="sheet-body">
    <TabContents {tabs} {selectedTabId} />
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
      box-shadow: 0 0 0.25rem 0.125rem var(--t5e-linked-accent) inset;

      .link-state.fa-link {
        background: var(--t5e-linked-light);
      }
    }

    &.unlinked {
      box-shadow: 0 0 0.25rem 0.125rem var(--t5e-unlinked-accent) inset;

      .link-state.fa-unlink {
        background: var(--t5e-unlinked-light);
      }
    }
  }

  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  .sheet-body {
    :global(.tab.attributes.active) {
      display: flex;
      flex-direction: column;
    }
    :global(.tab.attributes > section) {
      flex: 1;
    }
    :global(.tab.attributes > footer) {
      flex: 0;
    }

    :global(.tab.biography.active),
    :global(.tab.journal.active) {
      align-items: flex-start;
      flex-direction: row;
      padding-right: 0.75rem;
      overflow-x: inherit;
    }

    :global(.tab.biography),
    :global(.tab.journal) {
      font-size: 0.8125rem;
    }

    :global(.tab.biography) {
      flex-wrap: wrap;
    }
  }

  .level-information {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-family: var(--t5e-modesto);
    font-weight: 700;

    .xp {
      font-size: 1rem;
      margin-right: 0.25rem;
      color: var(--t5e-secondary-color);
    }
    .level {
      padding: 0.25rem 0.375rem;
      border-radius: 0.1875rem;
      background: var(--t5e-faint-color);
      color: var(--t5e-secondary-color);
      font-size: 1.25rem;
      line-height: 1;
      height: 1.5rem;

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
  }

  .actor-name-row {
    margin-bottom: 0.125rem;
  }

  .proficiency {
    white-space: nowrap;
  }
</style>
