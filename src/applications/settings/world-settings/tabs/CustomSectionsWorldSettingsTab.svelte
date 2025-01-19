<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';
  import type { DefaultCustomSectionSetting } from 'src/settings/settings.types';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  let newSection = $state<DefaultCustomSectionSetting>(createNewSection());

  function createNewSection(): DefaultCustomSectionSetting {
    return {
      section: '',
      alwaysShow: false,
      filterBySheetType: [],
      filterByTabId: [],
    };
  }

  function removeSection(section: DefaultCustomSectionSetting) {
    context.settings.defaultCustomSections =
      context.settings.defaultCustomSections.filter((x) => x !== section);
  }

  function addSection() {
    try {
      const trimmedNewSection = newSection.section?.trim() ?? '';
      if (trimmedNewSection === '') {
        return;
      }

      context.settings.defaultCustomSections.push(newSection);

      context.settings.defaultCustomSections.sort((left, right) =>
        left.section.localeCompare(right.section),
      );
    } finally {
      newSection = createNewSection();
    }
  }

  const localize = FoundryAdapter.localize;

  let sheetTypes: { type: string; label: string }[] = [
    {
      type: CONSTANTS.SHEET_TYPE_CHARACTER,
      label: localize('TYPES.Actor.character'),
    },
    { type: CONSTANTS.SHEET_TYPE_NPC, label: localize('DND5E.NPC') },
    {
      type: CONSTANTS.SHEET_TYPE_VEHICLE,
      label: localize('TYPES.Actor.vehicle'),
    },
    {
      type: CONSTANTS.SHEET_TYPE_GROUP,
      label: localize('TYPES.Actor.vehicle'),
    },
    {
      type: CONSTANTS.SHEET_TYPE_CONTAINER,
      label: localize('TYPES.Actor.group'),
    },
  ];

  let tabs: { id: string; label: string }[] = [
    {
      id: 'some ID',
      label: 'test',
    },
    {
      id: 'some ID 2',
      label: 'TODO: Get these from the runtimes',
    },
  ];
</script>

<div class="settings-form">
  <article class="setting group">
    <section>
      <div class="description">
        <label for="defaultCustomSections-{appId}"
          >{localize(
            SettingsProvider.settings.defaultCustomSections.options.name,
          )}</label
        >
        <p class="tidy5e-notes">
          {localize(
            SettingsProvider.settings.defaultCustomSections.options.hint,
          )}
        </p>
      </div>
      {#each context.settings.defaultCustomSections as sectionConfig}
        <div class="settings-group flex-column small-gap">
          <label>{localize('TIDY5E.Section.Label')}</label>
          <input type="button" bind:value={sectionConfig.section} />
          <label>{localize('TIDY5E.Section.AlwaysShowLabel')}</label>

          <label>{localize('TIDY5E.Section.FilterBySheetLabel')}</label>
          <label>{localize('TIDY5E.Section.FilterByTabLabel')}</label>
        </div>
      {/each}
      <button>
        <i class="fa-solid fa-plus"></i>
        {localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
      </button>
    </section>
  </article>
</div>

<style lang="scss">
  .custom-section-list {
    margin: 0;
    padding: 0;
    list-style: none;
    border: 1px solid var(--t5e-light-color);

    li:hover {
      background-color: var(--t5e-faintest-color);
    }

    li > * {
      padding: 0.325rem;
    }
  }

  .add-new-section,
  .delete-section {
    padding-left: 0.325rem;
    padding-right: 0.325rem;
    transition: color 0.2s ease;

    color: var(--t5e-icon-font-color);

    &:hover {
      color: var(--t5e-icon-hover-color);
    }
  }
</style>
