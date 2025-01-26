<script lang="ts">
  import ButtonWithOptionPanel from 'src/components/buttons/ButtonWithOptionPanel.svelte';
  import { CONSTANTS } from 'src/constants';
  import { ExpansionTracker } from 'src/features/expand-collapse/ExpansionTracker.svelte';
  import type { ExpandCollapseBehavior } from 'src/features/user-preferences/user-preferences.types';
  import UserPreferencesService from 'src/features/user-preferences/UserPreferencesService';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { getContext } from 'svelte';

  const sectionExpansionTracker = ExpansionTracker.getOrInit(
    CONSTANTS.SVELTE_CONTEXT.SECTION_EXPANSION_TRACKER,
  );

  const localize = FoundryAdapter.localize;

  let context = $derived(getContainerSheetQuadroneContext());
  let tabId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.TAB_ID);

  let allExpanded = $derived(
    context.userPreferences.expandCollapseBehavior === 'top-level'
      ? sectionExpansionTracker.tabStats[tabId]?.topAllExpanded === true
      : sectionExpansionTracker.tabStats[tabId]?.allExpanded === true,
  );

  function toggleContents() {
    sectionExpansionTracker.setAll(
      tabId,
      !allExpanded,
      context.userPreferences.expandCollapseBehavior === 'top-level'
        ? 'shallow'
        : 'deep',
    );
  }

  function onExpandCollapseBehaviorChanged(
    event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    UserPreferencesService.setPreference(
      'expandCollapseBehavior',
      event.currentTarget.value as ExpandCollapseBehavior,
    );
  }
</script>

<ButtonWithOptionPanel
  class="icon-button expand-button {allExpanded ? 'expanded' : 'collapsed'}"
  onclick={() => toggleContents()}
>
  <i class="expand-button-indicator fas fa-angles-down fa-fw"></i>
  {#snippet options()}
    <h4>{localize('TIDY5E.ExpandCollapseMenu.OptionTitle')}</h4>
    <label
      for="{context.document.id}-expand-collapse-behavior-top-level-sections"
    >
      <input
        id="{context.document.id}-expand-collapse-behavior-top-level-sections"
        type="radio"
        checked={context.userPreferences.expandCollapseBehavior === 'top-level'}
        value={'top-level' satisfies ExpandCollapseBehavior}
        onchange={onExpandCollapseBehaviorChanged}
      />
      {localize('TIDY5E.ExpandCollapseMenu.OptionTopLevel')}
    </label>
    <label for="{context.document.id}-expand-collapse-behavior-all-sections">
      <input
        type="radio"
        id="{context.document.id}-expand-collapse-behavior-all-sections"
        checked={context.userPreferences.expandCollapseBehavior === 'all'}
        value={'all' satisfies ExpandCollapseBehavior}
        onchange={onExpandCollapseBehaviorChanged}
      />
      {localize('TIDY5E.ExpandCollapseMenu.OptionAllSections')}
    </label>
  {/snippet}
</ButtonWithOptionPanel>
