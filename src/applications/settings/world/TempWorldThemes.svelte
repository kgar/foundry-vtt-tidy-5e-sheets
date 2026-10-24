<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ThemeSettings3 from '../theme/ThemeSettings3.svelte';
  import type {
    TempWorldThemesApplication,
    TempWorldThemesContext,
  } from './TempWorldThemesApplication.svelte';
  import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';
  import { error } from 'src/utils/logging';
  import { Theme } from 'src/theme/theme';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { FilterDescription } from 'src/foundry/dnd5e.types';

  type Props = {
    app: TempWorldThemesApplication;
    config: TempWorldThemesContext;
  };

  const { app, config }: Props = $props();

  const compendia = $derived<{ text: string; value: string }[]>([]);

  let folder = $state('');
  let themeMode = $state<string | undefined>(undefined);
  let compendium = $state<string | undefined>(undefined);

  let selectedTheme = $derived(config.themes[0]);

  const orderedThemes = $derived(
    config.themes.toSorted((a, b) => a.sort - b.sort),
  );

  const localize = FoundryAdapter.localize;

  const supportedDocuments = [...Theme.supportedDocumentNames]
    .map((s) => ({
      text: localize(`DOCUMENT.${s}`),
      value: s,
    }))
    .sort((a, b) => a.text.localeCompare(b.text));

  const availableTypes = $derived(
    supportedDocuments
      .flatMap(
        (doc) =>
          foundry.documents[doc.value]?.TYPES.map((t: string) => ({
            text: localize(CONFIG.Item.typeLabels[t]),
            value: t,
          })) ?? [],
      )
      .sort((a, b) => a.text.localeCompare(b.text)),
  );

  const availableTypeKeys = $derived(
    new Set<string>(availableTypes.map((t) => t.value)),
  );

  const actorHeaderBackgroundSupportedActorTypes = new Set<string>([
    CONSTANTS.SHEET_TYPE_CHARACTER,
    CONSTANTS.SHEET_TYPE_NPC,
    CONSTANTS.SHEET_TYPE_VEHICLE,
    CONSTANTS.SHEET_TYPE_GROUP,
    CONSTANTS.SHEET_TYPE_ENCOUNTER,
  ]);

  function selectTheme(id: string) {
    const themeOfId = config.themes.find((t) => t.id === id);
    selectedTheme = themeOfId ?? selectedTheme;
  }

  async function onExportRequested(
    exported: Partial<ThemeSettingsV3>,
  ): Promise<void> {
    error("It ain't implemented yet.", true);
  }

  function onLiveUpdateRequested(): void {
    error("It ain't implemented yet.", true);
  }

  async function onThemeImportRequested(
    imported: Partial<ThemeSettingsV3> | undefined,
  ): Promise<void> {
    error("It ain't implemented yet.", true);
  }

  function onDocumentNamesChanged(
    _event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    selectedTheme.types = availableTypes.filter(availableTypeKeys.has);
  }

  function clearFilter() {
    selectedTheme.filter = undefined;
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

    selectedTheme.filter = filter;
  }
</script>

<div>
  <div>
    {#each orderedThemes as theme}
      <button
        onclick={() => selectTheme(theme.id)}
        class={[
          'button',
          {
            active: selectedTheme?.id === theme.id,
          },
        ]}>{theme.name}</button
      >
    {/each}

    <button type="button" class="button" data-action="addTheme">
      <i class="fa-solid fa-plus"></i> TODO Add
    </button>
  </div>
  <div>
    {#if selectedTheme}
      <p>TODO: Sort Up/Down here for testing</p>
      <p>
        <button
          type="button"
          class="button"
          data-action="deleteTheme"
          data-id={selectedTheme.id}
        >
          <i class="fa-solid fa-trash"></i> TODO Delete
        </button>
      </p>
      <div>
        <label>TOOD: Documents</label>
        <ul>
          {#each supportedDocuments as supportedDocument}
            <li>
              <input
                type="checkbox"
                bind:group={selectedTheme.documentNames}
                value={supportedDocument.value}
                onchange={onDocumentNamesChanged}
              />
              {supportedDocument.text}
            </li>
          {/each}
        </ul>
      </div>
      {#if availableTypes.length}
        <div>
          <label>TODO: Document Types</label>
          {#each availableTypes as type}
            <li>
              <input
                type="checkbox"
                bind:group={selectedTheme.types}
                value={type.value}
              />
              {type.text}
            </li>
          {/each}
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
          <input type="text" value={folder} />
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
        <p>TODO: Filter Input with visualizer</p>
      {/if}
      <ThemeSettings3
        settings={selectedTheme.settings}
        rarities={config.rarityColors}
        spellPreparationMethodColors={config.spellPreparationMethodColors}
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
        {onExportRequested}
        {onLiveUpdateRequested}
        {onThemeImportRequested}
      />
    {/if}
  </div>
  <div>
    <button type="button" class="button" data-action="save"> TODO Save </button>
  </div>
</div>
