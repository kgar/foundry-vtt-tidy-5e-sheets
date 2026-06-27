<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { TabConfigContextEntry } from 'src/settings/editors/shared/tab-configuration.types';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    entry: TabConfigContextEntry;
    tabId: string;
  }

  let { entry = $bindable(), tabId }: Props = $props();

  const localize = FoundryAdapter.localize;

  let isVisible = $derived(entry.tabs.some((t) => t.id === tabId && t.show));

  let visibilityLevelIndex = $derived(
    entry.tabs.findIndex((v) => v.id === tabId),
  );

  let visibilityLevelOptions = $derived(
    VisibilityLevels.getOptions(entry.documentName),
  );

  let userIsGm = FoundryAdapter.userIsGm();

  let canConfigureViewers = $derived(
    visibilityLevelIndex >= 0 &&
      (userIsGm ||
        entry.tabs[visibilityLevelIndex].visibilityLevel !==
          CONSTANTS.VISIBILITY_LEVEL_GM),
  );

  const sidebarExpandableSheetTypes = new Set<string>([
    CONSTANTS.SHEET_TYPE_CHARACTER,
    CONSTANTS.SHEET_TYPE_NPC,
    CONSTANTS.SHEET_TYPE_VEHICLE,
  ]);

  let showSidebarExpandedControl = $derived(
    entry.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR &&
      sidebarExpandableSheetTypes.has(entry.documentType),
  );

  // The value is staged on the shared tab-config entry (seeded from the user's
  // saved preference by the config app) and persisted on the dialog's Save.
  let sidebarExpanded = $derived(
    entry.sidebarExpandedByTabId?.[tabId] ?? false,
  );

  function stageSidebarExpanded(expanded: boolean) {
    entry.sidebarExpandedByTabId = {
      ...(entry.sidebarExpandedByTabId ?? {}),
      [tabId]: expanded,
    };
  }

  function toggleVisibility(visible: boolean) {
    if (entry.tabs.some((t) => t.id === tabId)) {
      entry.tabs = entry.tabs.map((t) =>
        t.id === tabId ? { ...t, show: visible } : t,
      );
      return;
    }
  }

  const tabVisibilityId = $derived(() => `tabVisibility-${tabId}`);
  const sidebarExpandedId = $derived(() => `sidebarExpanded-${tabId}`);
  const viewersId = $derived(() => `viewers-${tabId}`);
</script>

<fieldset>
  <legend>
    {localize('TIDY5E.TabConfiguration.VisibilityTab.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <label for={tabVisibilityId()}>
      {localize('TIDY5E.TabConfiguration.VisibilityTab.Title')}
    </label>
    <div class="form-fields vertical">
      <label class="checkbox">
        <input
          id={tabVisibilityId()}
          type="checkbox"
          checked={isVisible}
          onchange={(ev) => toggleVisibility(ev.currentTarget.checked)}
        />
        {localize('TIDY5E.TabConfiguration.options.visibility')}
      </label>
    </div>
  </div>

  {#if showSidebarExpandedControl}
    <div class="form-group">
      <label for={sidebarExpandedId()}>
        {localize('TIDY5E.TabSettings.SidebarSettings.name')}
      </label>
      <div class="form-fields vertical">
        <label class="checkbox">
          <input
            id={sidebarExpandedId()}
            type="checkbox"
            checked={sidebarExpanded}
            onchange={(ev) => stageSidebarExpanded(ev.currentTarget.checked)}
          />
          {localize('TIDY5E.TabSettings.SidebarSettings.label')}
        </label>
      </div>
    </div>
  {/if}

  {#if canConfigureViewers}
    <div class="form-group">
      <label for={viewersId()}>
        {localize('TIDY5E.TabConfiguration.options.viewers')}
      </label>
      <div class="form-fields">
        <select
          id={viewersId()}
          bind:value={entry.tabs[visibilityLevelIndex].visibilityLevel}
        >
          {#each visibilityLevelOptions as option (option.key)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</fieldset>
