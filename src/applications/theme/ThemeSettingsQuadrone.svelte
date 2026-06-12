<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSettingColorFormGroupQuadrone from './ThemeSettingColorFormGroupQuadrone.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { isNil } from 'src/utils/data';
  import { coalesce } from 'src/utils/formatting';
  import { getSingleFileFromDropEvent } from 'src/utils/file';
  import { ThemeQuadroneImportService } from 'src/theme/theme-import-service';
  import ImportButton from './parts/ImportButton.svelte';
  import ImagePickerButton from './parts/ImagePickerButton.svelte';
  import { TidyHooks } from 'src/api';
  import { onMount } from 'svelte';
  import chroma from 'chroma-js';
  import type {
    ThemeSettingsContext,
    ThemeSettingsEditor,
  } from '../settings/editors/theme-settings-editor.svelte';
    import type { ThemeColorSettingConfigEntry } from './ThemeSettingsQuadroneApplication.svelte';

  interface Props {
    app: ThemeSettingsEditor;
    // TODO: nix placeholders
    placeholders: ThemeSettingsContext | undefined;
  }

  let { app, placeholders }: Props = $props();

  const context = $derived(app.value);

  const localize = FoundryAdapter.localize;

  let idPrefix = `theme-settings-${foundry.utils.randomID()}`;

  let portraitShapes = ThemeQuadrone.getActorPortraitShapes();

  let portraitShapeDefaultValue = $derived(
    placeholders?.portraitShape ?? ThemeQuadrone.DEFAULT_PORTRAIT_SHAPE,
  );

  let portraitShapeDefaultLabel = $derived(
    localize('TIDY5E.UseSpecificDefaultValue.Label', {
      value: localize(
        `TIDY5E.ThemeSettings.PortraitShape.option.${portraitShapeDefaultValue}`,
      ),
    }),
  );

  let defaultRarityColors = $state<Record<string, string>>({});
  let defaultMethodColors = $state<Record<string, string>>({});

  onMount(() => {
    let target = document.querySelector<HTMLElement>('.tidy5e-sheet.quadrone');
    // imps are so back, gimme those styles
    let imp: HTMLElement | undefined;
    if (!target) {
      imp = document.createElement('div');
      imp.classList.add('tidy5e-sheet', 'quadrone');
      imp.style.display = 'none';
      document.body.appendChild(imp);
      target = imp;
    }

    const styles = getComputedStyle(target);

    const readColor = (variableName: string) => {
      const raw = styles.getPropertyValue(variableName).trim();
      return raw && chroma.valid(raw) ? chroma(raw).hex() : raw;
    };

    defaultRarityColors = Object.fromEntries(
      context.rarityColors.map((c) => [
        c.key,
        readColor(`--t5e-color-rarity-${c.key.toLowerCase()}`),
      ]),
    );

    defaultMethodColors = Object.fromEntries(
      context.spellPreparationMethodColors.map((c) => [
        c.key,
        readColor(`--t5e-color-spellcasting-${c.key.toLowerCase()}`),
      ]),
    );

    imp?.remove();
  });

  let methodColorPlaceholders = $derived.by(() => ({
    ...defaultMethodColors,
    ...createColorPlaceholderMap(placeholders?.spellPreparationMethodColors),
  }));

  let rarityColorPlaceholders = $derived.by(() => ({
    ...defaultRarityColors,
    ...createColorPlaceholderMap(placeholders?.rarityColors),
  }));

  function createColorPlaceholderMap(colors?: ThemeColorSettingConfigEntry[]) {
    return (
      colors?.reduce<Record<string, string>>((prev, curr) => {
        if (!isNil(curr, '')) {
          prev[curr.key] = curr.value;
        }
        return prev;
      }, {}) ?? {}
    );
  }

  $effect(() => {
    // Live Preview is only sanely feasible for sheet-specific theming.
    if (!app.document) {
      return;
    }

    const liveSettings = ThemeQuadrone.getSheetThemeSettings({
      doc: app.document,
      settingsOverride: app.mapContextToChangedSettings(context) as any,
    });

    TidyHooks.tidy5eSheetsThemeSettingsChanged(app.document, liveSettings);
  });

  let useBasicThemeIfChanged = $derived(
    context.useBasicTheme ?? placeholders?.useBasicTheme ?? false,
  );
  let useHeaderBackgroundIfChanged = $derived(
    context.useHeaderBackground ?? placeholders?.useHeaderBackground ?? true,
  );

  let useBasicThemeDefaultLabel = $derived(
    localize('TIDY5E.UseSpecificDefaultValue.Label', {
      value: localize(
        (placeholders?.useBasicTheme ?? false)
          ? localize('COMMON.Yes')
          : localize('COMMON.No'),
      ),
    }),
  );
  let useHeaderBackgroundDefaultLabel = $derived(
    localize('TIDY5E.UseSpecificDefaultValue.Label', {
      value: localize(
        (placeholders?.useHeaderBackground ?? true)
          ? localize('COMMON.Yes')
          : localize('COMMON.No'),
      ),
    }),
  );

  function onUseBasicThemeChange(newValue: boolean | null) {
    context.useBasicTheme = newValue;
    // Keep the legacy invariant: explicit basic theme dictates header background.
    if (newValue === true) {
      context.useHeaderBackground = false;
    } else if (newValue === false) {
      context.useHeaderBackground = true;
    }
  }

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
        app.resetToDefault();
        if (imported) {
          app.value = app.mapFromSettings(imported);
        }
      }
    }
  }
</script>

<div class="dialog-content-container flexcol" ondrop={onDrop} role="region">
  <div class="flexrow flexgap-1">
    <h2>
      {localize('TIDY5E.ThemeSettings.SheetMenu.name')}
    </h2>
    <ImportButton onfilechanged={(file) => processImportFile(file)} />
    <button
      type="button"
      class="button flexshrink"
      onclick={() =>
        ThemeQuadroneImportService.export({
          ...ThemeQuadrone.getDefaultThemeSettings(),
          ...app.mapContextToChangedSettings(context),
        })}
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
      bind:value={context.accentColor}
      label={localize('TIDY5E.ThemeSettings.AccentColor.title')}
      placeholder={coalesce(
        placeholders?.accentColor,
        ThemeQuadrone.DEFAULT_ACCENT_COLOR,
      )}
    />

    <!-- Hide if basic theme -->
    {#if !useBasicThemeIfChanged}
      {#if !app.document?.documentName || app.document?.documentName === CONSTANTS.DOCUMENT_NAME_ACTOR}
        <div class="form-group">
          <label for="{idPrefix}-actor-portrait-shape">
            {localize('TIDY5E.ThemeSettings.PortraitShape.title', {
              type: localize(CONSTANTS.DOCUMENT_NAME_ACTOR),
            })}
          </label>
          <div class="form-fields">
            <select
              id="{idPrefix}-actor-portrait-shape"
              bind:value={context.portraitShape}
            >
              <option value={undefined}>{portraitShapeDefaultLabel}</option>
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
      {/if}

      {#if !app.document || app.actorHeaderBackgroundSupportedActorTypes.has(app.document.type)}
        <div class="form-group">
          <label for="{idPrefix}-use-header-background">
            {localize('TIDY5E.ThemeSettings.UseHeaderBackground.title')}
          </label>
          <div class={`form-fields ${app.document ? 'vertical' : ''}`}>
            {#if app.document}
              <label class="radio">
                <input
                  type="radio"
                  name="{idPrefix}-use-header-background"
                  checked={context.useHeaderBackground === true}
                  onclick={() => (context.useHeaderBackground = true)}
                />
                {localize('Yes')}
              </label>
              <label class="radio">
                <input
                  type="radio"
                  name="{idPrefix}-use-header-background"
                  checked={context.useHeaderBackground === false}
                  onclick={() => (context.useHeaderBackground = false)}
                />
                {localize('No')}
              </label>
              <label class="radio">
                <input
                  type="radio"
                  name="{idPrefix}-use-header-background"
                  checked={context.useHeaderBackground === null}
                  onclick={() => (context.useHeaderBackground = null)}
                />
                {useHeaderBackgroundDefaultLabel}
              </label>
            {:else}
              <input
                id="{idPrefix}-use-header-background"
                type="checkbox"
                bind:checked={context.useHeaderBackground}
              />
            {/if}
          </div>
          <p class="hint">
            {localize('TIDY5E.ThemeSettings.UseHeaderBackground.hint')}
          </p>
        </div>

        {#if useHeaderBackgroundIfChanged}
          <div class="form-group">
            <label for="{idPrefix}-actor-header-background">
              {localize('TIDY5E.ThemeSettings.ActorHeaderBackground.title')}
            </label>
            <div class="form-fields">
              <input
                id="{idPrefix}-actor-header-background"
                type="text"
                bind:value={context.actorHeaderBackground}
                placeholder={placeholders?.actorHeaderBackground}
              />
              <ImagePickerButton
                current={context.actorHeaderBackground}
                onimagepicked={(image) =>
                  (context.actorHeaderBackground = image)}
              />
            </div>
          </div>

          <ThemeSettingColorFormGroupQuadrone
            key="sheet-accent-color"
            bind:value={context.headerBackgroundColor}
            label={localize('TIDY5E.ThemeSettings.HeaderBackgroundColor.title')}
            placeholder={placeholders?.headerBackgroundColor}
            hint={localize('TIDY5E.ThemeSettings.HeaderBackgroundColor.hint')}
          />
        {/if}
      {/if}
    {/if}

    <div class="form-group">
      <label for="{idPrefix}-use-basic-theme">
        {localize('TIDY5E.ThemeSettings.UseBasicTheme.title')}
      </label>
      <div class={`form-fields ${app.document ? 'vertical' : ''}`}>
        {#if app.document}
          <label class="radio">
            <input
              type="radio"
              name="{idPrefix}-use-basic-theme"
              checked={context.useBasicTheme === true}
              onclick={() => onUseBasicThemeChange(true)}
            />
            {localize('Yes')}
          </label>
          <label class="radio">
            <input
              type="radio"
              name="{idPrefix}-use-basic-theme"
              checked={context.useBasicTheme === false}
              onclick={() => onUseBasicThemeChange(false)}
            />
            {localize('No')}
          </label>
          <label class="radio">
            <input
              type="radio"
              name="{idPrefix}-use-basic-theme"
              checked={context.useBasicTheme === null}
              onclick={() => onUseBasicThemeChange(null)}
            />
            {useBasicThemeDefaultLabel}
          </label>
        {:else}
          <input
            id="{idPrefix}-use-basic-theme"
            type="checkbox"
            checked={context.useBasicTheme ?? false}
            onchange={(ev) => onUseBasicThemeChange(ev.currentTarget.checked)}
          />
        {/if}
      </div>
      <p class="hint">
        {localize('TIDY5E.ThemeSettings.UseBasicTheme.hint')}
      </p>
    </div>

    <!-- TODO: Add item sidebar background setting -->
    {#if app.document?.documentName === CONSTANTS.DOCUMENT_NAME_ITEM}
      <div class="form-group">
        <label for="{idPrefix}-item-sidebar-background">
          {localize('TIDY5E.ThemeSettings.ItemSidebarBackground.title')}
        </label>
        <div class="form-fields">
          <input
            id="{idPrefix}-item-sidebar-background"
            type="text"
            bind:value={context.itemSidebarBackground}
            placeholder={placeholders?.itemSidebarBackground}
          />
          <ImagePickerButton
            current={context.itemSidebarBackground}
            onimagepicked={(image) => (context.itemSidebarBackground = image)}
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

    {#each context.rarityColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={color.value}
        label={color.label.titleCase()}
        placeholder={rarityColorPlaceholders[color.key]}
      />
    {/each}
  </fieldset>

  <fieldset>
    <legend>
      {localize('TIDY5E.ThemeSettings.SpellcastingMethodColors.title')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each context.spellPreparationMethodColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={color.value}
        label={color.label}
        placeholder={methodColorPlaceholders[color.key]}
      />
    {/each}
  </fieldset>
</div>
