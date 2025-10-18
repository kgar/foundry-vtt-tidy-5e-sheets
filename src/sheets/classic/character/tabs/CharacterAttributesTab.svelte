<script lang="ts">
  import SkillsList from '../../actor/SkillsList.svelte';
  import Traits from '../../actor/traits/Traits.svelte';
  import Favorites from '../parts/Favorites.svelte';
  import { getContext } from 'svelte';
  import { settings } from 'src/settings/settings.svelte';
  import { CONSTANTS } from 'src/constants';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import Search from 'src/components/utility-bar/Search.svelte';
  import PinnedFilterToggles from 'src/components/filter/PinnedFilterToggles.svelte';
  import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
  import FilterMenu from 'src/components/filter/FilterButton.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { getCharacterSheetContext } from 'src/sheets/sheet-context.svelte';
  import { SheetSections } from 'src/features/sections/SheetSections';
  import { UserSheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import AttributeItemPin from '../parts/AttributeItemPin.svelte';
  import AttributeActivityPin from '../parts/AttributeActivityPin.svelte';
  import { error } from 'src/utils/logging';

  let context = $derived(getCharacterSheetContext());

  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let searchCriteria: string = $state('');

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let favorites = $derived(
    SheetSections.configureFavorites(
      context.favorites,
      context.actor,
      tabId,
      UserSheetPreferencesService.getByType(context.actor.type),
      TidyFlags.sectionConfig.get(context.actor)?.[tabId],
    ),
  );

  let localize = FoundryAdapter.localize;
</script>

<UtilityToolbar>
  <Search bind:value={searchCriteria} />
  <PinnedFilterToggles
    filterGroupName={tabId}
    filters={ItemFilterRuntime.getPinnedFiltersForTab(
      context.filterPins,
      context.filterData,
      tabId,
    )}
  />
  <FilterMenu {tabId}>
    {#snippet beforeClearButton()}
      <div class="filter-option-group">
        <label class="filter-option flex-row no-gap align-items-center">
          <input
            type="checkbox"
            checked={TidyFlags.includeRitualsInCanCast.get(context.actor)}
            onchange={(ev) =>
              TidyFlags.includeRitualsInCanCast.set(
                context.actor,
                ev.currentTarget.checked,
              )}
          />
          <span
            >{localize(
              'TIDY5E.ItemFilters.Options.IncludeRitualsInCanCast',
            )}</span
          >
        </label>
      </div>
    {/snippet}
  </FilterMenu>
  {#each utilityBarCommands as command (command.id)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
      sections={favorites}
    />
  {/each}
</UtilityToolbar>

<div class="scroll-container">
  <div class="attributes-tab-contents">
    <section class="side-panel">
      <SkillsList
        actor={context.actor}
        toggleable={settings.value.toggleEmptyCharacterSkills}
        expanded={!!TidyFlags.skillsExpanded.get(context.actor)}
        toggleField={TidyFlags.skillsExpanded.prop}
      />
      {#if !settings.value.moveCharacterTraitsToRightOfSkills}
        <Traits />
      {/if}
    </section>
    <section class="main-panel">
      {#if context.attributePins.length}
        <div class="attribute-pins">
          {#each context.attributePins as ctx (ctx.id)}
            <svelte:boundary
              onerror={(e) =>
                error(
                  'An error occurred while rendering an attribute pin',
                  false,
                  e,
                )}
            >
              {#if ctx.type === 'item'}
                <AttributeItemPin {ctx} />
              {:else if ctx.type === 'activity'}
                <AttributeActivityPin {ctx} />
              {/if}
            </svelte:boundary>
          {/each}
        </div>
      {/if}
      {#if settings.value.moveCharacterTraitsToRightOfSkills}
        <Traits />
      {/if}
      <Favorites {favorites} {searchCriteria} />
    </section>
  </div>
</div>

<style lang="scss">
  .attributes-tab-contents {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    width: 15rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    flex: 1;
    padding: 0;
    height: auto;
    overflow-x: auto;
  }
</style>
