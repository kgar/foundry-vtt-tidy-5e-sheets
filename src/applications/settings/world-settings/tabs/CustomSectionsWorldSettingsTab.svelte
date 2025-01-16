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
      <div class="settings-group">
        <ul>
          {#each context.settings.defaultCustomSections as section (section)}
            <li>
              {section}
              <a
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
          <span>
            <button
              class="flex-grow-0"
              title={localize('TIDY5E.Section.SectionSelectorCreateNewSection')}
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </span>
        </form>
      </div>
    </section>
  </article>
</div>
