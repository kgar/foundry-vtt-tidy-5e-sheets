<script lang="ts">
  import TabConfigurationSortableListbox from './parts/TabConfigurationSortableListbox.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { rebuildCharacterSidebarTabConfigEntry } from 'src/settings/character-sidebar-tab-configuration';
  import { CharacterSheetQuadroneSidebarRuntime } from 'src/runtime/actor/CharacterSheetQuadroneSidebarRuntime.svelte';
  import type { TabConfigContextEntry } from 'src/settings/editors/shared/tab-configuration.types';

  type Props = {
    tabConfigEntry: TabConfigContextEntry;
  };

  let { tabConfigEntry }: Props = $props();

  const localize = FoundryAdapter.localize;
  let skillsTraitsCombined = $derived(
    tabConfigEntry.skillsTraitsCombined ?? true,
  );

  function onSkillsTraitsCombinedChange(combined: boolean) {
    if (combined === skillsTraitsCombined) {
      return;
    }

    rebuildCharacterSidebarTabConfigEntry(
      tabConfigEntry,
      combined,
      CharacterSheetQuadroneSidebarRuntime.getAllRegisteredTabs(),
    );
  }
</script>

<fieldset class="skills-traits-layout-options">
  <div class="form-group">
    <label for="skills-traits-combined">
      {localize('TIDY5E.Character.Sidebar.SkillsTraitsLayout.label')}
    </label>
    <div class="form-fields vertical">
      <label class="radio">
        <input
          type="radio"
          name="skills-traits-combined"
          checked={skillsTraitsCombined}
          onchange={() => onSkillsTraitsCombinedChange(true)}
        />
        {localize('TIDY5E.Character.Sidebar.SkillsTraitsLayout.combined')}
      </label>
      <label class="radio">
        <input
          type="radio"
          name="skills-traits-combined"
          checked={!skillsTraitsCombined}
          onchange={() => onSkillsTraitsCombinedChange(false)}
        />
        {localize('TIDY5E.Character.Sidebar.SkillsTraitsLayout.separate')}
      </label>
    </div>
    <p class="hint">
      {localize('TIDY5E.Character.Sidebar.SkillsTraitsLayout.hint')}
    </p>
  </div>
</fieldset>

<TabConfigurationSortableListbox {tabConfigEntry} />
