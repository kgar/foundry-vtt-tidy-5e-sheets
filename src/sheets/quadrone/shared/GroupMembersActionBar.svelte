<script lang="ts">
  import {
    type SectionOptionGroup,
  } from 'src/applications-quadrone/configure-sections/ConfigureSectionsApplication.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { TidySheetSettingsQuadroneApplication } from 'src/applications/settings/sheet/TidySheetSettingsQuadroneApplication.svelte';
  import type {
    GroupSheetQuadroneContext,
    TidySectionBase,
  } from 'src/types/types';
  import { buildGroupMembersSettingsTab } from '../actor/settings/GroupMemberSettingsTab';
  import ExpandCollapseButton from './ExpandCollapseButton.svelte';
  import Search from 'src/sheets/quadrone/shared/Search.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    searchCriteria: string;
    tabId: string;
    sections: TidySectionBase[];
    tabOptionGroups?: SectionOptionGroup[];
  }

  let {
    searchCriteria = $bindable(),
    tabId,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context = $derived(getSheetContext<GroupSheetQuadroneContext>());

  let tab = $derived(context.tabs.find((t) => t.id === tabId));
  let settingsTab = $derived(buildGroupMembersSettingsTab(context, tabId));

  let tabName = $derived(localize(tab?.title ?? ''));

  function openTabSettings() {
    context.editable &&
    context.sheet._renderChild(
      new TidySheetSettingsQuadroneApplication({
        document: context.document,
        initialTabId: tabId,
        tabSettings: { [tabId]: settingsTab },
      }),
    );
  }
</script>

<section
  class="action-bar"
  data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ACTION_BAR}
>
  <ExpandCollapseButton />

  <Search bind:searchCriteria />

  {#if context.editable}
    <!-- svelte-ignore a11y_missing_attribute -->
    <a
      role="button"
      tabindex="0"
      aria-label={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
      class="button button-icon-only"
      title={localize('TIDY5E.ConfigureTab.Title', { tabName: tabName })}
      onclick={openTabSettings}
      onkeydown={(event) => {
        if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
          event.preventDefault();
          openTabSettings();
        }
      }}
    >
      <i class="fas fa-gear"></i>
    </a>
  {/if}
</section>
