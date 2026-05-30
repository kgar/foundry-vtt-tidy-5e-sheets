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

  let isVisible = $derived(entry.selected.some((t) => t.id === tabId));

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
    if (visible) {
      if (entry.selected.some((t) => t.id === tabId)) {
        return;
      }
      const info =
        entry.unselected.find((t) => t.id === tabId) ?? entry.allTabs[tabId];
      if (!info) {
        return;
      }
      entry.selected = [...entry.selected, info];
      entry.unselected = entry.unselected.filter((t) => t.id !== tabId);
    } else {
      const info = entry.selected.find((t) => t.id === tabId);
      if (!info) {
        return;
      }
      entry.selected = entry.selected.filter((t) => t.id !== tabId);
      if (!entry.unselected.some((t) => t.id === tabId)) {
        entry.unselected = [...entry.unselected, info];
      }
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
      {localize('TIDY5E.TabConfiguration.options.visibility')}
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