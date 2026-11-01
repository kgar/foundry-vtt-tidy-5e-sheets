<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { FilterDescription } from 'src/foundry/dnd5e.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import {
    actorHeaderBackgroundSupportedActorTypes,
    Theme,
  } from 'src/theme/theme';
  import ThemeSettings3 from '../theme/ThemeSettings3.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  const config = $derived(app.value);
  const selectedTheme = $derived(app.selectedTheme);
  const appId = foundry.utils.randomID();

  const localize = FoundryAdapter.localize;

  const orderedThemes = $derived(
    config.settings.toSorted((a, b) => a.sort - b.sort),
  );

  const supportedDocuments = [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

  const availableTypeKeys = $derived(
    new Set<string>(app.availableTypes.map((t) => t.value)),
  );

  function onDocumentNamesChanged(
    _event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    if (!selectedTheme) {
      return;
    }

    selectedTheme.types = selectedTheme.types?.filter(availableTypeKeys.has);
  }

  function clearFilter() {
    if (!selectedTheme) {
      return;
    }

    selectedTheme.filter = undefined;
    selectedTheme.themeMode = undefined;
    selectedTheme.compendium = undefined;
    selectedTheme.folder = '';
  }

  function refreshFilter() {
    if (!selectedTheme) {
      return;
    }

    const filter: FilterDescription[] = [];

    if (selectedTheme.folder.trim() !== '') {
      filter.push({
        k: 'folder',
        v: selectedTheme.folder,
      });
    }

    if (selectedTheme.themeMode) {
      filter.push({
        k: 'themeMode',
        v: selectedTheme.themeMode,
      });
    }

    if (selectedTheme.compendium) {
      filter.push({
        k: 'document.pack',
        v: selectedTheme.compendium,
      });
    }

    selectedTheme.filter = JSON.stringify(filter, null, '  ');
  }
</script>

{#key app.updateSignal}
  <div class="tidy-sheet-settings">
    <div class="nav-group">
      {#each orderedThemes as theme}
        <button
          onclick={() => app.selectTheme(theme.id)}
          disabled={selectedTheme?.id === theme.id}
          class="button">{theme.name}</button
        >
      {/each}

      <button type="button" class="button" onclick={() => app.addTheme()}>
        <i class="fa-solid fa-plus"></i> TODO Add
      </button>
    </div>
    <section class="settings-pane" role="tabpanel">
      {#if selectedTheme}
        <p>TODO: Sort Up/Down here for testing</p>
        <p>
          <button
            type="button"
            class="button"
            onclick={() => {
              if (selectedTheme) {
                app.deleteTheme(selectedTheme.id);
              }
            }}
          >
            <i class="fa-solid fa-trash"></i> TODO Delete
          </button>
        </p>
        <div class="form-group stacked">
          <label for="{appId}-theme-name">TODO: Theme Name</label>
          <div class="form-fields">
            <input
              id="{appId}-theme-name"
              type="text"
              bind:value={selectedTheme.name}
              {@attach InputAttachments.selectOnFocus}
            />
          </div>
        </div>
        <div class="form-group stacked checkbox-grid">
          <label>TOOD: Documents</label>
          <div class="form-fields">
            {#each supportedDocuments as supportedDocument}
              <label class="checkbox">
                <input
                  type="checkbox"
                  bind:group={selectedTheme.documentNames}
                  value={supportedDocument.value}
                  onchange={onDocumentNamesChanged}
                />
                {supportedDocument.text}
              </label>
            {/each}
          </div>
        </div>
        {#if app.availableTypes.length}
          <div class="form-group stacked checkbox-grid">
            <label>TODO: Document Types</label>
            <div class="form-fields">
              {#each app.availableTypes as type}
                <label class="checkbox">
                  <input
                    type="checkbox"
                    bind:group={selectedTheme.types}
                    value={type.value}
                  />
                  {type.text}
                </label>
              {/each}
            </div>
          </div>
        {/if}
        <div>
          <label>TODO: Filter Mode</label>
          <label>
            <input
              type="radio"
              bind:group={selectedTheme.filterMode}
              value="basic"
              onclick={clearFilter}
            />
            TODO: Basic
          </label>
          <label>
            <input
              type="radio"
              bind:group={selectedTheme.filterMode}
              value="advanced"
            />
            TODO: Advanced
          </label>
        </div>
        {#if selectedTheme.filterMode === 'basic'}
          <div>
            <label>TODO: Folder</label>
            <input
              type="text"
              bind:value={selectedTheme.folder}
              onchange={refreshFilter}
            />
            <p class="hint">
              Folder paths must start with a slash "/". For example, "/My Folder
              Path/My Subfolder".
            </p>
          </div>
          <div>
            <label>TODO: Theme Mode</label>
            <label>
              <input
                type="radio"
                onchange={refreshFilter}
                bind:group={selectedTheme.themeMode}
                value={undefined}
              />
              TODO: Any
            </label>
            <label>
              <input
                type="radio"
                onchange={refreshFilter}
                bind:group={selectedTheme.themeMode}
                value="light"
              />
              TODO: Light
            </label>
            <label>
              <input
                type="radio"
                onchange={refreshFilter}
                bind:group={selectedTheme.themeMode}
                value="dark"
              />
              TODO: Dark
            </label>
          </div>
          <div>
            <label>TODO: Compendium</label>
            <select
              bind:value={selectedTheme.compendium}
              onchange={refreshFilter}
            >
              <option value={undefined}>TODO: Select an option</option>
              {#each app.compendia as c}
                <option value={c.value}>
                  {c.text}
                </option>
              {/each}
            </select>
            <p>
              TODO: hint - No selection indicates targeting the sidebar and any
              compendium.
            </p>
          </div>
        {:else}
          <div>
            <label>TODO: Filter</label>
            {#key selectedTheme.filter}
              <filters-input
                onchange={(e: any) => {
                  if (selectedTheme) {
                    selectedTheme.filter = e.target.value;
                  }
                }}>{selectedTheme.filter}</filters-input
              >
            {/key}
          </div>
        {/if}
        <ThemeSettings3
          bind:settings={selectedTheme.settings}
          rarities={app.rarities}
          spellPreparationMethodColors={app.spellMethods}
          placeholders={undefined}
          showActorPortraitShape={!!selectedTheme.documentNames?.includes(
            CONSTANTS.DOCUMENT_NAME_ACTOR,
          ) || !selectedTheme.documentNames?.length}
          showActorHeaderBackground={!selectedTheme.documentNames?.length ||
            (!!selectedTheme.types?.length &&
              selectedTheme.types.some(
                actorHeaderBackgroundSupportedActorTypes.has,
              ))}
          showItemSidebarBackground={!selectedTheme.documentNames?.length ||
            selectedTheme.documentNames.includes(CONSTANTS.DOCUMENT_NAME_ITEM)}
        />
      {/if}
    </section>
  </div>
{/key}
