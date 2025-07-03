<script lang="ts">
  import type {
    ThemeSettingsContext,
    ThemeSettingsQuadroneApplication,
  } from './ThemeSettingsQuadroneApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSettingColorFormGroupQuadrone from './ThemeSettingColorFormGroupQuadrone.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { isNil } from 'src/utils/data';
  import { getSingleFileFromDropEvent } from 'src/utils/file';
  import { settings } from 'src/settings/settings.svelte';

  interface Props {
    app: ThemeSettingsQuadroneApplication;
    settings: ThemeSettingsContext;
  }

  let { app, settings: data }: Props = $props();

  const localize = FoundryAdapter.localize;

  let fileImportInput: HTMLInputElement;

  let idPrefix = `theme-settings-${foundry.utils.randomID()}`;

  function pickImage(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
    current: string,
  ): Promise<string> {
    const rect = event.currentTarget.getBoundingClientRect();

    return new Promise((resolve) => {
      const fp = new foundry.applications.apps.FilePicker({
        type: 'image',
        current: current,
        callback: (path: string) => {
          resolve(path ?? '');
        },
        top: rect.top + 40,
        left: rect.left + 10,
      });

      fp.browse();
    });
  }

  let portraitShapes = ThemeQuadrone.getActorPortraitShapes();

  $effect(() => {
    const liveSettings = app.mapContextToSettings(data);
    ThemeQuadrone.applyCurrentThemeSettingsToStylesheet({
      doc: app.document,
      settingsOverride: liveSettings,
    });
  });

  async function onDrop(
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLElement;
    },
  ) {
    let file = getSingleFileFromDropEvent(ev);

    await processImportFile(file);
  }

  async function processImportFile(file: File | null | undefined) {
    if (file) {
      const imported = await ThemeQuadrone.import(file);
      if (imported) {
        data = app._getSettings(imported);
      }
    }
  }

  function onFileChanged(
    ev: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    const file = ev.currentTarget.files?.[0];

    ev.currentTarget.value = '';

    processImportFile(file);
  }
</script>

<div class="scrollable flex1" ondrop={onDrop}>
  <div class="flexrow flexgap-1">
    <h2>
      {localize('TIDY5E.ThemeSettings.SheetMenu.name')}
    </h2>
    <button
      type="button"
      class="button flexshrink"
      onclick={() => fileImportInput.click()}
    >
      <i class="fa-solid fa-file-import"></i>
      {localize('TIDY5E.ThemeSettings.Sheet.import')}
    </button>
    <button
      type="button"
      class="button flexshrink"
      onclick={() => ThemeQuadrone.export(app.mapContextToSettings(data))}
    >
      <i class="fa-solid fa-file-export"></i>
      {localize('TIDY5E.ThemeSettings.Sheet.export')}
    </button>
  </div>
  <input
    class="theme-import-input hidden"
    type="file"
    accept={CONSTANTS.THEME_EXTENSION_WITH_DOT}
    onchange={onFileChanged}
    bind:this={fileImportInput}
  />

  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.SheetTheme.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <ThemeSettingColorFormGroupQuadrone
      key="accent-color"
      bind:value={data.accentColor}
      label={localize('TIDY5E.ThemeSettings.AccentColor.title')}
    />
    <p class="hint">
      {localize('TIDY5E.ThemeSettings.SheetTheme.hint')}
    </p>

    {#if isNil(app.document?.documentName, CONSTANTS.DOCUMENT_NAME_ACTOR)}
      <div class="form-group">
        <label for="{idPrefix}-actor-portrait-shape">
          {localize('TIDY5E.ThemeSettings.PortraitShape.title', {
            type: localize(CONSTANTS.DOCUMENT_NAME_ACTOR),
          })}
        </label>
        <div class="form-fields">
          <select
            id="{idPrefix}-actor-portrait-shape"
            bind:value={data.portraitShape}
          >
            <option></option>
            {#each portraitShapes as shape}
              <option value={shape}
                >{localize(
                  `TIDY5E.ThemeSettings.PortraitShape.option.${shape}`,
                )}</option
              >
            {/each}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label for="{idPrefix}-actor-header-background">
          {localize('TIDY5E.ThemeSettings.ActorHeaderBackground.title')}
        </label>
        <div class="form-fields">
          <input
            id="{idPrefix}-actor-header-background"
            type="text"
            bind:value={data.actorHeaderBackground}
          />
          <button
            type="button"
            class="button button-icon-only"
            onclick={async (ev) =>
              (data.actorHeaderBackground = await pickImage(
                ev,
                data.actorHeaderBackground,
              ))}
          >
            <i class="fa-solid fa-search"></i>
          </button>
        </div>
      </div>
    {/if}

    {#if settings.value.truesight}
      <div class="form-group">
        <label for="{idPrefix}-item-sidebar-background">
          {localize('TIDY5E.ThemeSettings.ItemSidebarBackground.title')}
        </label>
        <div class="form-fields">
          <input
            id="{idPrefix}-item-sidebar-background"
            type="text"
            bind:value={data.itemSidebarBackground}
          />
          <button
            type="button"
            class="button button-icon-only"
            onclick={async (ev) =>
              (data.itemSidebarBackground = await pickImage(
                ev,
                data.itemSidebarBackground,
              ))}
          >
            <i class="fa-solid fa-search"></i>
          </button>
        </div>
      </div>
    {/if}
  </fieldset>
  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.RarityColors.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each data.rarityColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={color.value}
        label={color.label.titleCase()}
      />
    {/each}
  </fieldset>

  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.SpellPreparationModeColors.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each data.spellPreparationModeColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={color.value}
        label={color.label}
      />
    {/each}
  </fieldset>
</div>

<div class="flexrow flexgap-1">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
  <button
    type="button"
    class="button button-secondary use-default-btn"
    onclick={() => app.useDefault()}
  >
    {localize('TIDY5E.UseDefault')}
  </button>
  <button
    type="button"
    class="button button-secondary apply-changes-btn"
    data-testid="section-config-apply-changes"
    onclick={() => app.close()}
  >
    {localize('Cancel')}
  </button>
</div>
