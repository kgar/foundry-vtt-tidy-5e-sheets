<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getNpcSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';
  import { CONSTANTS } from 'src/constants';
  import type { InlineToggleService } from 'src/features/expand-collapse/InlineToggleService.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { TidyFlags } from 'src/api';
  import ActionBar from '../../shared/ActionBar.svelte';
  import Legendaries from '../npc-parts/Legendaries.svelte';
  import { ItemVisibility } from 'src/features/sections/ItemVisibility';
  import type {
    RadioSetting,
    SectionOptionGroup,
  } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import StatblockTables from '../../shared/StatblockTables.svelte';
  import type { FeatureSection, SpellbookSection } from 'src/types/types';
  import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
  import ActorTraitClasses from '../parts/ActorTraitClasses.svelte';
  import ActorTraitBackground from '../parts/ActorTraitBackground.svelte';
  import NpcTraitSpecies from '../npc-parts/traits/NpcTraitSpecies.svelte';
  import { SpecialTraitsApplication } from 'src/applications-quadrone/special-traits/SpecialTraitsApplication.svelte';
  import SheetPins from '../../shared/SheetPins.svelte';

  const localize = FoundryAdapter.localize;

  let context = $derived(getNpcSheetQuadroneContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria = $state('');

  let inlineToggleService = getContext<InlineToggleService>(
    CONSTANTS.SVELTE_CONTEXT.INLINE_TOGGLE_SERVICE,
  );

  const searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let tabOptionGroups: SectionOptionGroup[] = $derived.by(() => {
    const preferences = UserPreferencesService.get();

    const preferencesProp = UserPreferencesService.getProp();

    const legendariesProp = `${preferencesProp}.${CONSTANTS.SHOW_LEGENDARIES_ON_NPC_STATBLOCK_PREFERENCE}`;
    const spellbookInStatblockProp = `${preferencesProp}.${CONSTANTS.INCLUDE_SPELLBOOK_IN_NPC_STATBLOCK_PREFERENCE}`;

    const legendariesUserPreference =
      preferences.showLegendariesOnNpcStatblock ?? true;
    const spellbookInStatblockUserPreference =
      preferences.includeSpellbookInNpcStatblockTab ?? true;

    const legendariesDefaultTextKey = legendariesUserPreference
      ? 'TIDY5E.Show'
      : 'TIDY5E.Hide';

    const spellbookInStatblockDefaultTextKey =
      spellbookInStatblockUserPreference ? 'TIDY5E.Show' : 'TIDY5E.Hide';

    return [
      {
        title: 'TIDY5E.LegendaryLairToolbar',
        settings: [
          {
            type: 'radio',
            options: [
              {
                label: 'TIDY5E.Show',
                value: true,
              },
              {
                label: 'TIDY5E.Hide',
                value: false,
              },
              {
                label: FoundryAdapter.localize(
                  'TIDY5E.UseSpecificDefaultValue.Label',
                  { value: FoundryAdapter.localize(legendariesDefaultTextKey) },
                ),
                value: null,
              },
            ],
            selected: TidyFlags.showLegendariesOnNpcStatblock.get(
              context.actor,
            ),
            prop: TidyFlags.showLegendariesOnNpcStatblock.prop,
            doc: context.actor,
            default: null,
          } satisfies RadioSetting<boolean | null>,
        ],
      },
      {
        title: 'TIDY5E.SpellbookSections',
        settings: [
          {
            type: 'radio',
            options: [
              {
                label: 'TIDY5E.Show',
                value: true,
              },
              {
                label: 'TIDY5E.Hide',
                value: false,
              },
              {
                label: FoundryAdapter.localize(
                  'TIDY5E.UseSpecificDefaultValue.Label',
                  {
                    value: FoundryAdapter.localize(
                      spellbookInStatblockDefaultTextKey,
                    ),
                  },
                ),
                value: null,
              },
            ],
            selected: TidyFlags.includeSpellbookInNpcStatblockTab.get(
              context.actor,
            ),
            prop: TidyFlags.includeSpellbookInNpcStatblockTab.prop,
            doc: context.actor,
            default: null,
          } satisfies RadioSetting<boolean | null>,
        ],
      },
      {
        title: 'TIDY5E.DisplayOptionsGlobalDefault.Title',
        settings: [
          {
            type: 'boolean',
            label: 'TIDY5E.Utilities.ShowLegendaryTrackersOnNpcStatblock',
            doc: game.user,
            prop: legendariesProp,
            default: legendariesUserPreference,
          },
          {
            type: 'boolean',
            label: 'TIDY5E.Utilities.IncludeSpellbookInNpcStatblockTab',
            doc: game.user,
            prop: spellbookInStatblockProp,
            default: spellbookInStatblockUserPreference,
          },
        ],
      } satisfies SectionOptionGroup,
    ];
  });

  let sections = $derived.by(() => {
    let sectionsToConfigure: (FeatureSection | SpellbookSection)[] =
      context.includeSpellbookInStatblockTab
        ? [...context.features, ...context.spellbook]
        : context.features;

    return SheetSections.configureStatblock(
      sectionsToConfigure,
      context,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    );
  });

  $effect(() => {
    searchResults.uuids = ItemVisibility.getItemsToShowAtDepth({
      criteria: searchCriteria,
      itemContext: context.itemContext,
      sections: sections,
      tabId: tabId,
    });
  });
</script>

<ActionBar bind:searchCriteria {sections} {tabId} {tabOptionGroups} />

{#if context.showLegendariesOnStatblockTab && (context.showLegendaryActions || context.showLegendaryResistances || context.showLairTracker)}
  <div class="legendaries cards-container flexrow">
    <Legendaries />
  </div>
{/if}

<SheetPins />

<StatblockTables
  {sections}
  {inlineToggleService}
  itemContext={context.itemContext}
  {searchCriteria}
  sheetDocument={context.actor}
/>

{#if context.unlocked || context.background || context.species || context.classes.length > 0}
  <div class="tidy-table character-traits">
    <div class="tidy-table-header-row theme-dark">
      <h3>{localize('TIDY5E.CharacterTraits.Title')}</h3>
    </div>
    <div class="list traits">
      <ActorTraitClasses />
      <ActorTraitBackground />
      <NpcTraitSpecies />
      <div class="list-entry">
        <div class="list-label">
          <h4 class="font-weight-label">
            {localize('DND5E.SpecialTraits')}
          </h4>
        </div>
        <div class="list-content">
          <div class="list-values trait-item">
            <button
              type="button"
              class="button button-secondary"
              aria-label={localize('DND5E.FlagsTitle')}
              data-tooltip={localize('DND5E.FlagsTitle')}
              onclick={() =>
                new SpecialTraitsApplication({
                  document: context.actor,
                }).render({
                  force: true,
                })}
            >
              <i class="fa-solid fa-star"></i>
              {localize('DND5E.FlagsTitle')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
