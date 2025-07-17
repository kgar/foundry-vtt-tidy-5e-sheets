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
  import { ThemeQuadroneImportService } from 'src/theme/theme-import-service';
  import ImportButton from './parts/ImportButton.svelte';
  import ImagePickerButton from './parts/ImagePickerButton.svelte';

  interface Props {
    app: ThemeSettingsQuadroneApplication;
    settings: ThemeSettingsContext;
  }

  let { app, settings: context }: Props = $props();

  const localize = FoundryAdapter.localize;

  let idPrefix = `theme-settings-${foundry.utils.randomID()}`;

  let portraitShapes = ThemeQuadrone.getActorPortraitShapes();

  $effect(() => {
    const liveSettings = app.mapContextToSettings(context);
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
      const imported = await ThemeQuadroneImportService.import(file);
      if (imported) {
        context.value = app._getSettings(imported).value;
      }
    }
  }
</script>

<div class="scrollable flex1" ondrop={onDrop}>
  <div class="flexrow flexgap-1">
    <h2>
      {localize('TIDY5E.ThemeSettings.SheetMenu.name')}
    </h2>
    <ImportButton onfilechanged={(file) => processImportFile(file)} />
    <button
      type="button"
      class="button flexshrink"
      onclick={() =>
        ThemeQuadroneImportService.export(app.mapContextToSettings(context))}
    >
      <i class="fa-solid fa-file-export"></i>
      {localize('TIDY5E.ThemeSettings.Sheet.export')}
    </button>
  </div>

  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.SheetTheme.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <ThemeSettingColorFormGroupQuadrone
      key="accent-color"
      bind:value={context.value.accentColor}
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
            bind:value={context.value.portraitShape}
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
            bind:value={context.value.actorHeaderBackground}
          />
          <ImagePickerButton
            current={context.value.actorHeaderBackground}
            onimagepicked={(image) =>
              (context.value.actorHeaderBackground = image)}
          />
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
            bind:value={context.value.itemSidebarBackground}
          />
          <ImagePickerButton
            current={context.value.itemSidebarBackground}
            onimagepicked={(image) =>
              (context.value.itemSidebarBackground = image)}
          />
        </div>
      </div>
    {/if}
  </fieldset>
  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.RarityColors.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each context.value.rarityColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={color.value}
        label={color.label.titleCase()}
      />
    {/each}
  </fieldset>

  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.SpellPreparationMethodColors.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each context.value.spellPreparationMethodColors as color}
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
