<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import { SettingsProvider } from 'src/settings/settings.svelte';
  import type { WorldSettingsContext } from '../WorldSettings.types';
  import { CONSTANTS } from 'src/constants';

  const context = getContext<WorldSettingsContext>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const appId = getContext<string>(CONSTANTS.SVELTE_CONTEXT.APP_ID);

  let newSection = $state('');

  function removeSection(section: string) {
    context.settings.defaultCustomSections =
      context.settings.defaultCustomSections.filter((x) => x !== section);
  }

  function addSection() {
    try {
      const trimmedNewSection = newSection.trim();
      if (trimmedNewSection === '') {
        return;
      }

      if (context.settings.defaultCustomSections.includes(trimmedNewSection)) {
        return;
      }

      context.settings.defaultCustomSections.push(newSection);

      context.settings.defaultCustomSections.sort((left, right) =>
        left.localeCompare(right),
      );
    } finally {
      newSection = '';
    }
  }

  const localize = FoundryAdapter.localize;
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
      <div class="settings-group flex-column small-gap">
        <ul class="custom-section-list flex-column extra-small-gap">
          {#each context.settings.defaultCustomSections as section (section)}
            <li class="flex-row extra-small-gap">
              <span class="flex-grow-1">
                {section}
              </span>
              <a
                class="delete-section flex-grow-0"
                onclick={() => removeSection(section)}
                title={localize('TIDY5E.ContextMenuActionDelete')}
              >
                <i class="fa-solid fa-trash"></i>
              </a>
            </li>
          {/each}
        </ul>

        <form
          onsubmit={(ev) => {
            ev.preventDefault();
            addSection();
          }}
          class="flex-row no-gap align-items-center"
        >
          <input
            placeholder={localize(
              'TIDY5E.Section.SectionSelectorNewSectionName',
            )}
            type="text"
            class="flex-grow-1"
            bind:value={newSection}
          />

          <a
            class="add-new-section flex-grow-0"
            title={localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
            onclick={() => addSection()}
          >
            <i class="fa-solid fa-plus"></i>
          </a>
        </form>
      </div>
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
