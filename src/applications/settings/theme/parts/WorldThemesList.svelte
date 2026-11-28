<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    getAppliesToSegments,
    getThemePreview,
  } from 'src/settings/editors/shared/theme-setting-functions';
  import type {
    WorldThemeSettingEntry,
    WorldThemesSettingsEditor,
  } from 'src/settings/editors/world-themes-settings-editor.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  let { app }: Props = $props();

  const config = $derived(app.value);

  const localize = FoundryAdapter.localize;

  const orderedThemes = $derived(
    config.settings
      .filter((t) => !t.isWorldDefault)
      .toSorted((a, b) => a.sort - b.sort),
  );

  const worldDefaultTheme = $derived(
    config.settings.find((t) => t.isWorldDefault),
  );

  let draggedIndex = $state<number>();

  function onThemeDrag(
    event: DragEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    draggedIndex = Number(event.currentTarget.dataset.index ?? '');

    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function onDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  function onDragEnd(ev: DragEvent) {
    ev.preventDefault();
    draggedIndex = undefined;
  }

  async function onThemeDrop(
    event: DragEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    if (draggedIndex === undefined) {
      return;
    }

    event.preventDefault();

    const sourceIndex = draggedIndex;
    if (!Number.isNumeric(sourceIndex)) {
      return;
    }

    const targetIndex = Number(event.currentTarget.dataset.index);
    if (!Number.isNumeric(targetIndex)) {
      return;
    }

    if (sourceIndex === targetIndex) {
      return;
    }

    const o = $state.snapshot(orderedThemes);

    let source = o[sourceIndex];
    let target = o[targetIndex];
    let siblings = o.filter((s, i) => i !== sourceIndex);

    if (!source || !target) {
      return;
    }

    const updates = foundry.utils.performIntegerSort(source, {
      target,
      siblings,
    });

    for (const { target, update } of updates) {
      const entry = app.value.settings.find((entry) => entry.id === target.id);
      if (entry) {
        entry.sort = update.sort;
      }
    }

    // renumber the sort to sane values
    for (const [i, entry] of orderedThemes.entries()) {
      entry.sort = i + 1;
    }
  }
</script>

<div class="flexrow">
  <h2 class="world-theme-list-header">
    {localize('TIDY5E.COMMON.Theme.LabelPl')}
  </h2>
  <span class="flexshrink flexrow flexgap-1">
    <button
      type="button"
      class="button flexshrink"
      onclick={() => app.importBundle()}
    >
      <i class="fa-solid fa-file-import"></i>
      {localize('TIDY5E.SETTINGS.Theme.Action.Import')}
    </button>
    <button
      type="button"
      class="button flexshrink"
      onclick={() => app.exportBundle()}
    >
      <i class="fa-solid fa-file-export"></i>
      {localize('TIDY5E.SETTINGS.Theme.Action.Export')}
    </button>
    <button
      type="button"
      class="button button-primary flexshrink"
      onclick={() => {
        const theme = app.addTheme();
        app.selectTheme(theme.id);
      }}
    >
      <i class="fa-solid fa-plus"></i>
      {localize('TIDY5E.COMMON.Theme.Add')}
    </button>
  </span>
</div>
<p class="hint flexshrink">
  {localize('TIDY5E.COMMON.Theme.SortHint')}
</p>
{#if orderedThemes.length}
  <ol class="world-theme-list">
    {#each orderedThemes as theme, i (theme.id)}
      <li>
        {@render themeCard(theme, i)}
      </li>
    {/each}
  </ol>
{:else}
  <div class="world-theme-empty empty-state-container">
    <button
      type="button"
      class="button button-tertiary"
      onclick={() => {
        const theme = app.addTheme();
        app.selectTheme(theme.id);
      }}
    >
      <i class="fa-solid fa-plus"></i>
      {localize('TIDY5E.COMMON.Theme.Add')}
    </button>
  </div>
{/if}
<h2 class="world-theme-list-header">
  {localize('TIDY5E.SETTINGS.Theme.World.Title')}
</h2>
{#if worldDefaultTheme}
  {@render themeCard(worldDefaultTheme)}
{:else}
  <div class="world-theme-empty empty-state-container">
    <button
      type="button"
      class="button button-tertiary"
      onclick={() => {
        const theme = app.addDefaultWorldTheme();
        app.selectTheme(theme.id);
      }}
    >
      <i class="fa-solid fa-swatchbook"></i>
      {localize('DND5E.DescriptionEdit', {
        description: localize('TIDY5E.SETTINGS.Theme.World.Title'),
      })}
    </button>
  </div>
{/if}

{#snippet themeCard(theme: WorldThemeSettingEntry, index?: number)}
  {@const preview = getThemePreview(theme.settings, theme.themeMode)}
  {@const sortable = index !== undefined}
  <button
    type="button"
    class={[
      'world-theme-card',
      `theme-${preview.themeMode}`,
      {
        'world-theme-card-parchment': preview.isParchment,
        dragging: sortable && draggedIndex === index,
      },
    ]}
    style={preview.style}
    draggable={sortable}
    data-index={index}
    onclick={() => app.selectTheme(theme.id)}
    ondragstart={sortable ? onThemeDrag : undefined}
    ondrop={sortable ? onThemeDrop : undefined}
    ondragover={sortable ? onDragOver : undefined}
    ondragend={sortable ? onDragEnd : undefined}
    data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_WORLD_THEME}
    data-theme-id={theme.id}
  >
    <span class="world-theme-card-text">
      <span class="world-theme-card-name">{theme.name}</span>
      <div class="world-theme-card-applies-to">
        {#each getAppliesToSegments(app.documentTypeTree, theme) as segment}
          <span>{segment}</span>
          <div class="divider-dot"></div>
        {/each}
        <span>
          {#if preview.sheetStyle === 'basic'}
            {localize('TIDY5E.SETTINGS.Theme.UseBasicTheme.Title')}
          {:else if preview.sheetStyle === 'parchment'}
            {localize('TIDY5E.SETTINGS.Theme.UseHeaderBackground.labelOff')}
          {:else}
            {localize('TIDY5E.SETTINGS.Theme.UseHeaderBackground.Title')}
          {/if}
        </span>
      </div>
    </span>
    {#if sortable}
      <span class="button button-icon-only button-primary">
        <i
          class="world-theme-card-drag-icon fa-solid fa-grip-lines fa-fw"
          aria-hidden="true"
        ></i>
      </span>
    {/if}
  </button>
{/snippet}
