<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { TabConfigContextEntry } from 'src/applications/tab-configuration/tab-configuration.types';
  import { VisibilityLevels } from 'src/features/visibility-levels/VisibilityLevels';
  import { CONSTANTS } from 'src/constants';

  interface Props {
    entry: TabConfigContextEntry;
    tabId: string;
  }

  // Passed in a TabConfigContextEntry and the settings tab ID
  let { entry, tabId }: Props = $props();

  const localize = FoundryAdapter.localize;

  let isVisible = $derived(
    entry.tabs.some((t) => t.id === tabId && t.show),
  );

  let visibilityLevelIndex = $derived(
    entry.visibilityLevels.findIndex((v) => v.id === tabId),
  );

  let visibilityLevelOptions = $derived(
    VisibilityLevels.getOptions(entry.documentName),
  );

  let userIsGm = FoundryAdapter.userIsGm();

  let canConfigureViewers = $derived(
    visibilityLevelIndex >= 0 &&
      (userIsGm ||
        entry.visibilityLevels[visibilityLevelIndex].visibilityLevel !==
          CONSTANTS.VISIBILITY_LEVEL_GM),
  );

  function toggleVisibility(visible: boolean) {
    if (entry.tabs.some((t) => t.id === tabId)) {
      entry.tabs = entry.tabs.map((t) =>
        t.id === tabId ? { ...t, show: visible } : t,
      );
      return;
    }

    // Tab isn't in the list yet (shouldn't normally happen); add it from the
    // registry when turning it on.
    const info = entry.allTabs[tabId];
    if (visible && info) {
      entry.tabs = [...entry.tabs, { ...info, show: true }];
    }
  }
</script>

<fieldset>
  <legend>
    {localize('TIDY5E.TabConfiguration.VisibilityTab.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <label for="">
      {localize('TIDY5E.TabConfiguration.VisibilityTab.Title')}
    </label>
    <div class="form-fields vertical">
      <label class="checkbox">
        <input
          type="checkbox"
          checked={isVisible}
          onchange={(ev) => toggleVisibility(ev.currentTarget.checked)}
        />
        {localize('TIDY5E.TabConfiguration.options.visibility')}
      </label>
    </div>
  </div>

  {#if canConfigureViewers}
    {@const viewersId = `${tabId}-viewers`}
    <div class="form-group">
      <label for={viewersId}>
        {localize('TIDY5E.TabConfiguration.options.viewers')}
      </label>
      <div class="form-fields">
        <select
          id={viewersId}
          bind:value={entry.visibilityLevels[visibilityLevelIndex].visibilityLevel}
        >
          {#each visibilityLevelOptions as option (option.key)}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {/if}
</fieldset>