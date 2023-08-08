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
  import NpcEffectsTab from './NpcEffectsTab.svelte';
  import NpcBiographyTab from './NpcBiographyTab.svelte';
  import NpcJournalTab from './NpcJournalTab.svelte';
  import NpcProfile from './parts/NpcProfile.svelte';
  import ContentEditableFormField from 'src/components/inputs/ContentEditableFormField.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyDropdownList from '../TidyDropdownList.svelte';
  import { isNil } from 'src/utils/data';
  import { formatAsModifier } from 'src/utils/formatting';
  import Tidy5eActorOriginSummaryConfig from '../tidy5e-actor-origin-summary-config';
  import AcShield from '../actor/AcShield.svelte';
  import InitiativeBlock from '../InitiativeBlock.svelte';
  import AttributeBlock from '../AttributeBlock.svelte';

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
    {
      id: CONSTANTS.TAB_NPC_SPELLBOOK,
      displayName: 'DND5E.Spellbook',
      content: {
        component: NpcSpellbookTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_EFFECTS,
      displayName: 'DND5E.Effects',
      content: {
        component: NpcEffectsTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_BIOGRAPHY,
      displayName: 'DND5E.Biography',
      content: {
        component: NpcBiographyTab,
      },
    },
    {
      id: CONSTANTS.TAB_NPC_JOURNAL,
      displayName: 'TIDY5E.Journal',
      content: {
        component: NpcJournalTab,
      },
    },
  ];

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

<header class="tidy5e-kgar-sheet-header flex-row">
  <div class="flex-grow-0">
    <NpcProfile />
  </div>
  <div class="flex-grow-1">
    <div class="flex-row justifty-content-space-between align-items-center">
      <div class="actor-name">
        <ContentEditableFormField
          element="h1"
          fieldName="name"
          value={$store.actor.name}
          editable={$store.owner}
          spellcheck={false}
          placeholder={localize('DND5E.Name')}
          dataMaxLength={40}
        />
      </div>
      <div class="flex-row align-items-center">
        <div class="xp">
          <span>{$store.system.details.xp.value} XP</span>
        </div>
        <div class="level">
          {localize('DND5E.AbbreviationCR')}
          <ContentEditableFormField
            element="span"
            editable={true}
            fieldName="system.details.cr"
            placeholder="0"
            dataMaxLength={4}
            value={$store.labels.cr}
          />
        </div>
      </div>
    </div>
    <section>
      <!-- Make NPC version of origin-points, 
        which does that magical balanced 
        truncation effect -->
      <span class="origin-points">
        <TidyDropdownList
          options={sizes}
          selected={currentSize}
          on:optionClicked={(event) =>
            $store.actor.update({
              'system.traits.size': event.detail.value,
            })}
        /> <span>&#8226;</span>
        <span class="creature-type" title={$store.labels.type}>
          <!-- TODO: Accent color on hover -->
          <a
            on:click={() =>
              new dnd5e.applications.actor.ActorTypeConfig($store.actor).render(
                true
              )}
            title={localize('DND5E.CreatureTypeConfig')}
            >{#if isNil($store.labels.type, '')}
              {localize('DND5E.CreatureType')}
            {:else}
              {$store.labels.type}
            {/if}</a
          >
        </span>
        <span class="environment">
          <i class="fas fa-tree" />
          <span class="environment-label">
            <!-- TODO: 
                .origin-summary .environment style makes this 
                into a homegrown tooltip... neat! 
                Let's make it an actual component instead ;) -->
            <span data-placeholder={localize('TIDY5E.Environment')}
              >{$store.system.details.environment}</span
            >
          </span>
        </span>
        <span>&#8226;</span>
        <span
          class="origin-summary-text"
          data-tooltip={$store.system.details.alignment}
          >{$store.system.details.alignment}</span
        >
        <span>&#8226;</span>
        <span
          class="origin-summary-text source source-info"
          data-tooltip={$store.system.details.source}
          >{$store.system.details.source}</span
        >
      </span>

      <span class="proficiency">
        {localize('DND5E.Proficiency')}: {formatAsModifier(
          $store.system.attributes.prof
        )}
      </span>
      {#if $store.owner}
        <span class="origin-summary-config">
          <a
            on:click={() =>
              new Tidy5eActorOriginSummaryConfig($store.actor).render(true)}
            class="origin-summary-tidy"
            data-tooltip={localize('TIDY5E.OriginSummaryConfig')}
          >
            <i class="fas fa-cog" />
          </a>
        </span>
      {/if}
    </section>
    <section class="movement flex-row small-gap">
      <h4>{localize('DND5E.Speed')}</h4>
      {#if $store.movement.primary}
        <span data-tooltip={$store.movement.primary}
          >{$store.movement.primary}</span
        >
      {/if}
      {#if $store.movement.special}
        |
        <span data-tooltip={$store.movement.special}
          >{$store.movement.special}</span
        >
      {/if}
      <a
        class="configure"
        data-tooltip={localize('DND5E.MovementConfig')}
        on:click={() =>
          new dnd5e.applications.actor.ActorMovementConfig($store.actor).render(
            true
          )}><i class="fas fa-cog" /></a
      >
    </section>
    <section class="actor-stats">
      <!-- TODO: switch these back to unordered <li> -->
      <AcShield
        ac={$store.system.attributes.ac.value}
        on:click={() =>
          new dnd5e.applications.actor.ActorArmorConfig($store.actor).render(
            true
          )}
        cssClass="align-self-flex-start"
      />
      <div
        class="vertical-line-separator"
        aria-hidden="true"
        role="presentation"
      />
      <div>
        <InitiativeBlock
          actor={$store.actor}
          initiative={$store.system.attributes.init}
        />
      </div>
      {#each abilities as [id, ability]}
        <div
          class="vertical-line-separator"
          aria-hidden="true"
          role="presentation"
        />
        <div>
          <AttributeBlock abbreviation={id} {ability} actor={$store.actor} />
        </div>
      {/each}
    </section>
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

<style lang="scss">
  .tidy5e-kgar-sheet-header {
    display: flex;
    justify-content: center;
    padding: 0.625rem 1rem 1rem 1rem;
    background: var(--t5e-header-background);
  }

  :global(.tab.abilities) {
    overflow-y: scroll;
    padding-right: 0.75rem;
  }

  :global(.tab.biography),
  :global(.tab.journal) {
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
</style>
