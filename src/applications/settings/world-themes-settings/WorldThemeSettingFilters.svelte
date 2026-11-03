<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    WorldThemeSettingEntry,
    WorldThemesSettingsEditor,
  } from 'src/settings/editors/world-themes-settings-editor.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
    selectedTheme: WorldThemeSettingEntry;
  };

  const { app, selectedTheme = $bindable() }: Props = $props();

  const localize = FoundryAdapter.localize;

  const availableTypeKeys = $derived(
    new Set<string>(app.availableTypes.map((t) => t.value)),
  );

  function onDocumentNamesChanged(
    _event: Event & { currentTarget: EventTarget & HTMLInputElement },
  ) {
    selectedTheme.types = selectedTheme.types?.filter(availableTypeKeys.has);
  }
</script>

<div class="form-group stacked checkbox-grid">
  <label>{localize('TIDY5E.COMMON.Theme.Documents')}</label>
  <div class="form-fields">
    {#each app.supportedDocuments as supportedDocument}
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
  <p class="hint">
    {localize('TIDY5E.COMMON.Theme.DocumentsHint')}
  </p>
</div>
{#if app.availableTypes.length}
  <div class="form-group stacked checkbox-grid">
    <label>{localize('TIDY5E.COMMON.Theme.DocumentTypes')}</label>
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
    <div class="hint">{localize('TIDY5E.COMMON.Theme.DocumentTypesHint')}</div>
  </div>
{/if}
<div class="form-group">
  <label>{localize('TIDY5E.COMMON.Theme.FilterMode')}</label>
  <div class="form-fields vertical">
    <label class="radio">
      <input
        type="radio"
        bind:group={selectedTheme.filterMode}
        value="basic"
        onclick={app.clearFilter}
      />
      {localize('TIDY5E.COMMON.Theme.FilterModeBasic')}
    </label>
    <label class="radio">
      <input
        type="radio"
        bind:group={selectedTheme.filterMode}
        value="advanced"
      />
      {localize('TIDY5E.COMMON.Theme.FilterModeAdvanced')}
    </label>
  </div>
</div>
{#if selectedTheme.filterMode === 'basic'}
  <div class="form-group stacked">
    <label>{localize('TIDY5E.COMMON.Theme.Folder')}</label>
    <div class="form-fields">
      <input
        type="text"
        bind:value={selectedTheme.folder}
        onchange={app.applyBasicFilters}
      />
    </div>
    <p class="hint">{localize('TIDY5E.COMMON.Theme.FolderHint')}</p>
  </div>
  <div class="form-group">
    <label>{localize('TIDY5E.COMMON.Theme.ThemeMode')}</label>
    <div class="form-fields vertical">
      <label class="radio">
        <input
          type="radio"
          onchange={app.applyBasicFilters}
          bind:group={selectedTheme.themeMode}
          value={undefined}
        />
        {localize('TIDY5E.COMMON.Theme.ThemeModeAll')}
      </label>
      <label class="radio">
        <input
          type="radio"
          onchange={app.applyBasicFilters}
          bind:group={selectedTheme.themeMode}
          value="light"
        />
        {localize('TIDY5E.COMMON.Theme.ThemeModeLight')}
      </label>
      <label class="radio">
        <input
          type="radio"
          onchange={app.applyBasicFilters}
          bind:group={selectedTheme.themeMode}
          value="dark"
        />
        {localize('TIDY5E.COMMON.Theme.ThemeModeDark')}
      </label>
    </div>
  </div>
  <div class="form-group stacked">
    <label>{localize('TIDY5E.COMMON.Theme.Compendium')}</label>
    <div class="form-fields">
      <select
        bind:value={selectedTheme.compendium}
        onchange={app.applyBasicFilters}
      >
        <option value={undefined}>
          {localize('TIDY5E.COMMON.Theme.CompendiumNone')}
        </option>
        {#each app.compendia as c}
          <option value={c.value}>
            {c.text}
          </option>
        {/each}
      </select>
    </div>
    <p class="hint">
      {localize('TIDY5E.COMMON.Theme.CompendiumHint')}
    </p>
  </div>
{:else}
  <div class="form-group stacked">
    <label>{localize('TIDY5E.COMMON.Theme.AdvancedFilter')}</label>
    {#key selectedTheme.filter}
      <div class="form-fields">
        <filters-input
          onchange={(e: any) => {
            if (selectedTheme) {
              selectedTheme.filter = e.target.value;
            }
          }}>{selectedTheme.filter}</filters-input
        >
      </div>
    {/key}
  </div>
{/if}
