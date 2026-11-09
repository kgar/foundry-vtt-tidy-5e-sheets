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
  const idPrefix = foundry.utils.randomID();

  const compendiumLabels = $derived(
    new Map(app.compendia.map((c) => [c.value, c.text])),
  );

  const availableCompendia = $derived(
    app.compendia.filter((c) => !selectedTheme.compendia.includes(c.value)),
  );

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

<fieldset>
  <legend>
    {localize('TIDY5E.FILTER.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <div class="form-group">
    <label for="{idPrefix}-folder"
      >{localize('TIDY5E.COMMON.Theme.Folder')}</label
    >
    <div class="form-fields">
      <input
        id="{idPrefix}-folder"
        type="text"
        bind:value={selectedTheme.folder}
        onchange={app.applyBasicFilters}
      />
    </div>
    <p class="hint">{localize('TIDY5E.COMMON.Theme.FolderHint')}</p>
  </div>
  <div class="form-group">
    <label for="{idPrefix}-compendium-only">
      {localize('TIDY5E.COMMON.Theme.CompendiumOnly')}
    </label>
    <div class="form-fields">
      <input
        type="checkbox"
        id="{idPrefix}-compendium-only"
        checked={selectedTheme.compendiumOnly}
        onchange={(ev) => {
          selectedTheme.compendiumOnly = ev.currentTarget.checked;
          app.applyBasicFilters();
        }}
      />
    </div>
    <p class="hint">{localize('TIDY5E.COMMON.Theme.CompendiumHint')}</p>
  </div>
  <div class="form-group">
    <label for="{idPrefix}-add-compendium">
      {localize('TIDY5E.COMMON.Theme.Compendia')}
    </label>
    <div class="form-fields vertical theme-compendia">
      {#each selectedTheme.compendia as packId (packId)}
        <div class="theme-compendia-row">
          <span class="theme-compendia-row-name">
            {compendiumLabels.get(packId) ?? packId}
          </span>
          <button
            type="button"
            class="button button-icon-only button-borderless"
            aria-label={localize('TIDY5E.COMMON.Theme.RemoveCompendium')}
            data-tooltip
            onclick={() => app.removeCompendium(packId)}
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      {/each}
      <select
        id="{idPrefix}-add-compendium"
        value=""
        onchange={(ev) => {
          app.addCompendium(ev.currentTarget.value);
          ev.currentTarget.value = '';
        }}
      >
        <option value="" disabled>
          {localize('TIDY5E.COMMON.Theme.AddCompendium')}
        </option>
        {#each availableCompendia as c (c.value)}
          <option value={c.value}>{c.text}</option>
        {/each}
      </select>
    </div>
    <p class="hint">{localize('TIDY5E.COMMON.Theme.CompendiaHint')}</p>
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
        {localize('SETTINGS.UI.FIELDS.colorScheme.choices.light')}
      </label>
      <label class="radio">
        <input
          type="radio"
          onchange={app.applyBasicFilters}
          bind:group={selectedTheme.themeMode}
          value="dark"
        />
        {localize('SETTINGS.UI.FIELDS.colorScheme.choices.dark')}
      </label>
      <p class="hint">
        {localize('TIDY5E.COMMON.Theme.ThemeModeHint')}
      </p>
    </div>
  </div>
  <div class="form-group stacked">
    <label for="{idPrefix}-advanced-filter">
      {localize('TIDY5E.COMMON.Theme.AdvancedFilter')}
    </label>
    {#key selectedTheme.filter}
      <div class="form-fields">
        <filters-input
          id="{idPrefix}-advanced-filter"
          onchange={(e: any) => app.setFilter(e.target.value)}
          >{selectedTheme.filter}</filters-input
        >
      </div>
    {/key}
    <p class="hint">
      {selectedTheme.filterMode === 'advanced'
        ? localize('TIDY5E.COMMON.Theme.AdvancedFilterCustomHint')
        : localize('TIDY5E.COMMON.Theme.AdvancedFilterHint')}
    </p>
  </div>
</fieldset>
