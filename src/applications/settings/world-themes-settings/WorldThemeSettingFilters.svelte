<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    WorldThemeSettingEntry,
    WorldThemesSettingsEditor,
  } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import {
    getEffectiveTypeSelection,
    setEffectiveTypeSelection,
    type ThemeDocumentTypeNode,
  } from 'src/settings/editors/shared/theme-setting-functions';

  type Props = {
    app: WorldThemesSettingsEditor;
    selectedTheme: WorldThemeSettingEntry;
  };

  const { app, selectedTheme }: Props = $props();

  const localize = FoundryAdapter.localize;

  function applySelection(node: ThemeDocumentTypeNode, selected: string[]) {
    const result = setEffectiveTypeSelection(
      app.documentTypeTree,
      node,
      selectedTheme,
      selected,
    );
    selectedTheme.documentNames = result.documentNames;
    selectedTheme.types = result.types;
  }

  function toggleType(node: ThemeDocumentTypeNode, type: string) {
    const current = getEffectiveTypeSelection(node, selectedTheme);
    applySelection(
      node,
      current.includes(type)
        ? current.filter((t) => t !== type)
        : [...current, type],
    );
  }
</script>

<div class="form-group stacked">
  <label>{localize('TIDY5E.COMMON.Theme.SheetTypes')}</label>
  <div class="form-fields theme-sheet-type-tree">
    {#each app.documentTypeTree as node (node.documentName)}
      {@const selected = getEffectiveTypeSelection(node, selectedTheme)}
      {@const full =
        selected.length > 0 && selected.length >= node.types.length}
      {@const partial = selected.length > 0 && !full}
      <div
        class="theme-sheet-type-tree-group"
        role="group"
        style:--t5e-theme-type-count={node.types.length}
      >
        <label class="checkbox theme-sheet-type-tree-parent">
          <input
            type="checkbox"
            checked={full}
            {@attach (el: HTMLInputElement) => {
              el.indeterminate = partial;
            }}
            onchange={() =>
              applySelection(node, full ? [] : node.types.map((t) => t.value))}
          />
          {node.label}
        </label>
        <div class="theme-sheet-type-tree-children">
          {#each node.types as type (type.value)}
            <label class="checkbox">
              <input
                type="checkbox"
                checked={selected.includes(type.value)}
                onchange={() => toggleType(node, type.value)}
              />
              {type.text}
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

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
