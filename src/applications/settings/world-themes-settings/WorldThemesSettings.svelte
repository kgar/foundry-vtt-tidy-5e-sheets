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

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  const config = $derived(app.value);

  const localize = FoundryAdapter.localize;

  const compendia = [...game.packs.values()]
    .map((c) => ({
      // TODO: need a util for getting full folder path
      text: `${[c.folder, ...c.folder.ancestors]
        .reverse()
        .map((f) => f.name)
        .join('/')}/${c.metadata.label}`,
      value: c.metadata.id,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));
  const typeDenylist = new Set(['base', 'backpack']);

  let folder = $state('');
  let themeMode = $state<string | undefined>(undefined);
  let compendium = $state<string | undefined>(undefined);

  let selectedTheme = $derived(config.settings[0]);

  const orderedThemes = $derived(
    config.settings.toSorted((a, b) => a.sort - b.sort),
  );

  const supportedDocuments = [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

  const availableTypes = $derived(
    (selectedTheme.documentNames ?? [])
      .flatMap(
        (docName: any) =>
          foundry.documents[docName]?.TYPES.filter(
            (t: string) =>
              !!CONFIG[docName as keyof typeof CONFIG]?.typeLabels[t] &&
              !typeDenylist.has(t),
          ).map((t: string) => ({
            text: localize(
              CONFIG[docName as keyof typeof CONFIG].typeLabels[t],
            ),
            value: t,
          })) ?? [],
      )
      .sort((a, b) => a.text.localeCompare(b.text)),
  );

  const availableTypeKeys = $derived(
    new Set<string>(availableTypes.map((t) => t.value)),
  );

  function selectTheme(id: string) {
    const themeOfId = config.settings.find((t) => t.id === id);
    selectedTheme = themeOfId ?? selectedTheme;
  }

  function onDocumentNamesChanged(
    _event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    selectedTheme.types = selectedTheme.types?.filter(availableTypeKeys.has);
  }

  function clearFilter() {
    selectedTheme.filter = undefined;
    themeMode = undefined;
    compendium = undefined;
    folder = '';
  }

  function refreshFilter() {
    const filter: FilterDescription[] = [];

    if (folder.trim() !== '') {
      filter.push({
        k: 'folder',
        v: folder,
      });
    }

    if (themeMode) {
      filter.push({
        k: 'themeMode',
        v: themeMode,
      });
    }

    if (compendium) {
      filter.push({
        k: 'document.pack',
        v: compendium,
      });
    }

    selectedTheme.filter = JSON.stringify(filter, null, '  ');
  }

  function addTheme(): any {
    const maxSort = app.value.settings.reduce(
      (prev, curr) => Math.max(prev, curr.sort),
      0,
    );

    app.value.settings.push({
      filterMode: 'basic',
      id: foundry.utils.randomID(),
      name: 'TODO: New Name Here',
      settings: {},
      sort: maxSort + 1,
      documentNames: [],
      filter: undefined,
      types: [],
    });
  }

  function deleteTheme(id: string): any {
    app.value.settings = app.value.settings
      .filter((t) => t.id !== id)
      .sort((a, b) => a.sort - b.sort);

    for (let i = 0; i < app.value.settings.length; i++) {
      app.value.settings[i].sort = i + 1;
    }
  }
</script>

<div class="tidy-sheet-settings">
  <div class="nav-group">
    {#each orderedThemes as theme}
      <button
        onclick={() => selectTheme(theme.id)}
        disabled={selectedTheme?.id === theme.id}
        class="button">{theme.name}</button
      >
    {/each}

    <button type="button" class="button" onclick={() => addTheme()}>
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
          onclick={() => deleteTheme(selectedTheme.id)}
        >
          <i class="fa-solid fa-trash"></i> TODO Delete
        </button>
      </p>
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
      {#if availableTypes.length}
        <div class="form-group stacked checkbox-grid">
          <label>TODO: Document Types</label>
          <div class="form-fields">
            {#each availableTypes as type}
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
          <input type="text" bind:value={folder} onchange={refreshFilter} />
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
              bind:group={themeMode}
              value={undefined}
            />
            TODO: Any
          </label>
          <label>
            <input
              type="radio"
              onchange={refreshFilter}
              bind:group={themeMode}
              value="light"
            />
            TODO: Light
          </label>
          <label>
            <input
              type="radio"
              onchange={refreshFilter}
              bind:group={themeMode}
              value="dark"
            />
            TODO: Dark
          </label>
        </div>
        <div>
          <label>TODO: Compendium</label>
          <select bind:value={compendium} onchange={refreshFilter}>
            <option>TODO: Select an option</option>
            {#each compendia as c}
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
                selectedTheme.filter = e.target.value;
              }}>{selectedTheme.filter}</filters-input
            >
          {/key}
        </div>
      {/if}
      <ThemeSettings3
        bind:settings={selectedTheme.settings}
        rarities={config.rarities}
        spellPreparationMethodColors={config.spellMethods}
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
