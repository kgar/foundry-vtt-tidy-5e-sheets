<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { WorldThemesSettingsEditor } from 'src/settings/editors/world-themes-settings-editor.svelte';
  import { actorHeaderBackgroundSupportedActorTypes } from 'src/theme/theme';
  import ThemeSettings3 from '../theme/ThemeSettings3.svelte';
  import { InputAttachments } from 'src/attachments/input-attachments.svelte';
  import Tabs, { type TabStripInfo } from 'src/components/tabs/Tabs.svelte';
  import WorldThemeSettingFilters from './WorldThemeSettingFilters.svelte';
  import ImportButton from '../theme/parts/ImportButton.svelte';
  import { ThemeImportService } from 'src/theme/theme-import-service';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';

  type Props = {
    app: WorldThemesSettingsEditor;
  };

  type SubTabId = 'theme' | 'filter';

  let { app }: Props = $props();

  const config = $derived(app.value);
  let selectedTheme = $derived(app.selectedTheme);
  const appId = foundry.utils.randomID();
  let currentSubTabId: SubTabId = $state('theme');

  const tabs: TabStripInfo[] = [
    {
      id: 'theme',
      title: 'TIDY5E.COMMON.Theme.Configure',
    },
    {
      id: 'filter',
      title: 'TIDY5E.COMMON.Theme.ConfigureFilters',
    },
  ];

  const localize = FoundryAdapter.localize;

  const orderedThemes = $derived(
    config.settings.toSorted((a, b) => a.sort - b.sort),
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

<div class="tidy-sheet-settings">
  <div class="settings-nav" role="tablist" aria-orientation="vertical">
    <div class="nav-group">
      <h3 class="nav-group-header">
        {localize('TIDY5E.COMMON.Theme.LabelPl')}
      </h3>
      {#each orderedThemes as theme, i (theme.id)}
        <button
          type="button"
          draggable="true"
          data-index={i}
          onclick={() => app.selectTheme(theme.id)}
          class={[
            'nav-tab',
            {
              active: selectedTheme?.id === theme.id,
            },
          ]}
          ondrag={onThemeDrag}
          ondrop={onThemeDrop}
          ondragover={onDragOver}
          ondragend={onDragEnd}
          data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_WORLD_THEME}
          data-theme-id={theme.id}
        >
          <span class="nav-tab-title">
            {theme.name}
          </span>

          <i
            class="tab-icon tab-drag-icon fa-solid fa-grip-lines fa-fw"
            aria-hidden="true"
          ></i>
        </button>
      {/each}
    </div>

    <button
      type="button"
      class="button button-primary"
      onclick={() => app.addTheme()}
    >
      <i class="fa-solid fa-plus"></i>
      {localize('TIDY5E.COMMON.Theme.Add')}
    </button>
  </div>
  <section class="settings-pane" role="tabpanel">
    {#key app.updateSignal}
      <div class="dialog-content-container flexcol">
        {#if selectedTheme}
          <div>
            <button
              type="button"
              class="button"
              onclick={() => {
                if (selectedTheme) {
                  app.deleteTheme(selectedTheme.id);
                }
              }}
            >
              <i class="fa-solid fa-trash"></i>
              {localize('TIDY5E.COMMON.Theme.Delete')}
            </button>
          </div>
          <div class="form-group stacked">
            <label for="{appId}-theme-name">
              {localize('TIDY5E.COMMON.Theme.Name')}
            </label>
            <div class="form-fields">
              <input
                id="{appId}-theme-name"
                type="text"
                bind:value={selectedTheme.name}
                {@attach InputAttachments.selectOnFocus}
              />
            </div>
          </div>
          <div class="tabs-row tab-configuration-tabs">
            <Tabs
              bind:selectedTabId={currentSubTabId}
              {tabs}
              cssClass="item-tabs"
            />
            <hr class="golden-fade" />
          </div>

          {#if currentSubTabId === 'theme'}
            <div class="flex1">
              <div>
                <button
                  type="button"
                  class="button"
                  onclick={() => app.applyPreset()}
                >
                  <i class="fa-solid fa-sliders"></i>
                  {localize('TIDY5E.SETTINGS.Theme.Action.ApplyPreset')}
                </button>
                <ImportButton
                  onfilechanged={async (file) => {
                    if (file) {
                      const imported = await ThemeImportService.import(file);

                      if (imported) {
                        const indexOfSelectedTheme =
                          app.value.settings.findIndex(
                            (s) => s.id === selectedTheme?.id,
                          );

                        if (indexOfSelectedTheme >= 0) {
                          app.value.settings[indexOfSelectedTheme].settings =
                            imported;
                        }
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  class="button"
                  onclick={() => {
                    ThemeImportService.export({
                      ...ThemeQuadrone.getDefaultThemeSettings(),
                      ...selectedTheme,
                    });
                  }}
                >
                  <i class="fa-solid fa-file-export"></i>
                  {localize('TIDY5E.SETTINGS.Theme.Action.Export')}
                </button>
              </div>
              <ThemeSettings3
                bind:settings={selectedTheme.settings}
                rarities={app.rarities}
                spellPreparationMethodColors={app.spellMethods}
                placeholders={undefined}
                showActorPortraitShape={!!selectedTheme.documentNames?.includes(
                  CONSTANTS.DOCUMENT_NAME_ACTOR,
                ) || !selectedTheme.documentNames?.length}
                showActorHeaderBackground={!selectedTheme.documentNames
                  ?.length ||
                  (!!selectedTheme.types?.length &&
                    selectedTheme.types.some(
                      actorHeaderBackgroundSupportedActorTypes.has,
                    ))}
                showItemSidebarBackground={!selectedTheme.documentNames
                  ?.length ||
                  selectedTheme.documentNames.includes(
                    CONSTANTS.DOCUMENT_NAME_ITEM,
                  )}
              />
            </div>
          {/if}

          {#if currentSubTabId === 'filter'}
            <div class="flex1">
              <WorldThemeSettingFilters {app} bind:selectedTheme />
            </div>
          {/if}
        {/if}
      </div>
    {/key}
  </section>
</div>
