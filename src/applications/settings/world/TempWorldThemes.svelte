<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import ThemeSettings3 from '../theme/ThemeSettings3.svelte';
  import type {
    TempWorldThemesApplication,
    TempWorldThemesContext,
  } from './TempWorldThemesApplication.svelte';
  import type { ThemeSettingsV3 } from 'src/theme/theme-quadrone.types';
  import { error } from 'src/utils/logging';

  type Props = {
    app: TempWorldThemesApplication;
    config: TempWorldThemesContext;
  };

  const { app, config }: Props = $props();

  let selectedTheme = $derived(config.themes[0]);
  const orderedThemes = $derived(
    config.themes.toSorted((a, b) => a.sort - b.sort),
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
</script>

<div>
  <div>
    {#each config.themes as theme}
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
      <p>TODO: Document Name Select here</p>
      <p>TODO: Document Type Select here</p>
      <p>TODO: Filter Mode Toggle</p>
      {#if selectedTheme.filterMode === 'basic'}
        <p>TODO: Folder filter</p>
        <p>TODO: Light/Dark/Both filter</p>
        <p>TODO: Compendium Select filter</p>
      {:else}
        <p>TODO: Filter Input with visualizer</p>
      {/if}
      <ThemeSettings3
        settings={selectedTheme.settings}
        rarities={config.rarityColors}
        spellPreparationMethodColors={config.spellPreparationMethodColors}
        placeholders={undefined}
        showActorPortraitShape={selectedTheme.documentName ===
          CONSTANTS.DOCUMENT_NAME_ACTOR || !selectedTheme.documentName}
        showActorHeaderBackground={!selectedTheme.documentName ||
          (!!selectedTheme.type &&
            actorHeaderBackgroundSupportedActorTypes.has(selectedTheme.type))}
        showItemSidebarBackground={!selectedTheme.documentName ||
          selectedTheme.documentName === CONSTANTS.DOCUMENT_NAME_ITEM}
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
