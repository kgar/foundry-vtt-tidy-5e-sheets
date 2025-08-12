<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getContext } from 'svelte';
  import UtilityToolbar from 'src/components/utility-bar/UtilityToolbar.svelte';
  import UtilityToolbarCommand from 'src/components/utility-bar/UtilityToolbarCommand.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { GroupSheetSections } from 'src/features/sections/GroupSheetSections';
  import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
  import EncounterMemberList from '../parts/EncounterMemberList.svelte';
  import GroupLanguages from '../../group/parts/GroupLanguages.svelte';
  import GroupSkills from '../../group/parts/GroupSkills.svelte';
  import UnderlinedTabStrip from 'src/components/tabs/UnderlinedTabStrip.svelte';
  import ExpandableContainer from 'src/components/expandable/ExpandableContainer.svelte';
  import { getGroupSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import {
    createSearchResultsState,
    setSearchResultsContext,
  } from 'src/features/search/search.svelte';

  const tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  const context = $derived(getGroupSheetClassicContext());

  const localize = FoundryAdapter.localize;

  let utilityBarCommands = $derived(
    context.utilities[tabId]?.utilityToolbarCommands ?? [],
  );

  let searchResults = createSearchResultsState();
  setSearchResultsContext(searchResults);

  let memberSections = $derived(
    GroupSheetSections.configureMemberSections(
      context.memberSections,
      tabId,
      SheetPreferencesService.getByType(context.actor.type),
    ),
  );

  let aggregateTabs = {
    languages: localize('DND5E.Languages'),
    skills: localize('DND5E.Skills'),
  } as const;

  let selectedAggregateTab = $state(aggregateTabs.languages);
</script>

<UtilityToolbar>
  <!-- Filters? Pinned Filters? Perhaps filters related to senses, immunities, etc. -->
  {#each utilityBarCommands as command (command.id)}
    <UtilityToolbarCommand
      title={command.title}
      iconClass={command.iconClass}
      text={command.text}
      visible={command.visible ?? true}
      onExecute={(ev) => command.execute?.(ev)}
      sections={memberSections}
    />
  {/each}
</UtilityToolbar>

<section
  class="scroll-container flex-column small-gap"
  data-tidy-track-scroll-y
>
  {#if context.memberSections.length > 0}
    {#if context.isGM}
      <ExpandableContainer expanded={context.showGroupMemberTabInfoPanel}>
        <UnderlinedTabStrip
          tabs={Object.values(aggregateTabs)}
          bind:selected={selectedAggregateTab}
        />
        <div class="group-member-info-panel">
          <div class:hidden={selectedAggregateTab !== aggregateTabs.languages}>
            <GroupLanguages />
          </div>
          <div class:hidden={selectedAggregateTab !== aggregateTabs.skills}>
            <GroupSkills />
          </div>
        </div>
      </ExpandableContainer>
    {/if}

    {#each memberSections as section (section.key)}
      <EncounterMemberList {section} />
    {/each}
  {:else}
    <div class="drop-zone full-height">
      {localize('TIDY5E.Group.EmptyMembersTabHint')}
    </div>
  {/if}
</section>
