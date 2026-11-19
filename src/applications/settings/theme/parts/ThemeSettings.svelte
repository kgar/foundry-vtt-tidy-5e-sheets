<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSettingColorFormGroupQuadrone from './ThemeSettingColorFormGroupQuadrone.svelte';
  import { ThemeQuadrone } from 'src/theme/theme-quadrone.svelte';
  import { CONSTANTS } from 'src/constants';
  import { coalesce } from 'src/utils/formatting';
  import ImagePickerButton from './ImagePickerButton.svelte';
  import { onMount } from 'svelte';
  import chroma from 'chroma-js';
  import type { ThemeSettings } from 'src/theme/theme-quadrone.types';
  import type { ThemeColorSettingOption } from 'src/settings/settings.types';

  interface Props {
    settings: Partial<ThemeSettings>;
    rarities: ThemeColorSettingOption[];
    spellPreparationMethodColors: ThemeColorSettingOption[];
    placeholders: Partial<ThemeSettings> | undefined;
    doc?: any;
    showActorPortraitShape?: boolean;
    showActorHeaderBackground?: boolean;
    showItemSidebarBackground?: boolean;
  }

  let {
    settings = $bindable(),
    rarities,
    spellPreparationMethodColors,
    placeholders,
    doc,
    showActorPortraitShape,
    showActorHeaderBackground,
    showItemSidebarBackground,
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let idPrefix = `theme-settings-${foundry.utils.randomID()}`;

  let portraitShapes = ThemeQuadrone.getActorPortraitShapes();

  let portraitShapeDefaultValue = $derived(
    placeholders?.portraitShape ?? ThemeQuadrone.DEFAULT_PORTRAIT_SHAPE,
  );

  let portraitShapeDefaultLabel = $derived(
    localize('TIDY5E.SETTINGS.TabOptions.UseSpecificDefault', {
      value: localize(
        `TIDY5E.SETTINGS.Theme.PortraitShape.option.${portraitShapeDefaultValue}`,
      ),
    }),
  );

  let defaultRarityColors = $state<Record<string, string>>({});
  let defaultMethodColors = $state<Record<string, string>>({});

  onMount(() => {
    let target = document.querySelector<HTMLElement>('.tidy5e-sheet');
    // imps are so back, gimme those styles
    let imp: HTMLElement | undefined;
    if (!target) {
      imp = document.createElement('div');
      imp.classList.add('tidy5e-sheet');
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
      rarities.map((c) => [
        c.key,
        readColor(`--t5e-color-rarity-${c.key.toLowerCase()}`),
      ]),
    );

    defaultMethodColors = Object.fromEntries(
      spellPreparationMethodColors.map((c) => [
        c.key,
        readColor(`--t5e-color-spellcasting-${c.key.toLowerCase()}`),
      ]),
    );

    imp?.remove();
  });

  let methodColorPlaceholders = $derived.by(() => ({
    ...defaultMethodColors,
    ...(placeholders?.spellPreparationMethodColors ?? {}),
  }));

  let rarityColorPlaceholders = $derived.by(() => ({
    ...defaultRarityColors,
    ...(placeholders?.rarityColors ?? {}),
  }));

  let useBasicThemeIfChanged = $derived(
    settings.useBasicTheme ?? placeholders?.useBasicTheme ?? false,
  );
  let useHeaderBackgroundIfChanged = $derived(
    settings.useHeaderBackground ?? placeholders?.useHeaderBackground ?? true,
  );

  let useBasicThemeDefaultLabel = $derived(
    localize('TIDY5E.SETTINGS.TabOptions.UseSpecificDefault', {
      value: localize(
        (placeholders?.useBasicTheme ?? false)
          ? localize('COMMON.Yes')
          : localize('COMMON.No'),
      ),
    }),
  );
  let useHeaderBackgroundDefaultLabel = $derived(
    localize('TIDY5E.SETTINGS.TabOptions.UseSpecificDefault', {
      value: localize(
        (placeholders?.useHeaderBackground ?? true)
          ? localize('COMMON.Yes')
          : localize('COMMON.No'),
      ),
    }),
  );

  function onUseBasicThemeChange(newValue: boolean | undefined) {
    settings.useBasicTheme = newValue;
    // Keep the legacy invariant: explicit basic theme dictates header background.
    if (newValue === true) {
      settings.useHeaderBackground = false;
    } else if (newValue === false) {
      settings.useHeaderBackground = true;
    }
  }
</script>

<fieldset>
  <legend>
    {localize('TIDY5E.SETTINGS.Theme.SheetTheme.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>
  <ThemeSettingColorFormGroupQuadrone
    key="accent-color"
    bind:value={settings.accentColor}
    label={localize('TIDY5E.SETTINGS.Theme.AccentColor.Title')}
    placeholder={coalesce(
      placeholders?.accentColor,
      ThemeQuadrone.DEFAULT_ACCENT_COLOR,
    )}
  />

  <!-- Hide if basic theme -->
  {#if !useBasicThemeIfChanged}
    <!-- TODO: Also toggle visibility based on filter criteria -->
    {#if showActorPortraitShape}
      <div class="form-group">
        <label for="{idPrefix}-actor-portrait-shape">
          {localize('TIDY5E.SETTINGS.Theme.PortraitShape.Title', {
            type: localize(CONSTANTS.DOCUMENT_NAME_ACTOR),
          })}
        </label>
        <div class="form-fields">
          <select
            id="{idPrefix}-actor-portrait-shape"
            bind:value={settings.portraitShape}
          >
            <option value={undefined}>{portraitShapeDefaultLabel}</option>
            {#each portraitShapes as shape}
              <option value={shape}
                >{localize(
                  `TIDY5E.SETTINGS.Theme.PortraitShape.option.${shape}`,
                )}</option
              >
            {/each}
          </select>
        </div>
      </div>
    {/if}

    {#if showActorHeaderBackground}
      <div class="form-group">
        <label for="{idPrefix}-use-header-background">
          {localize('TIDY5E.SETTINGS.Theme.UseHeaderBackground.Title')}
        </label>
        <div class={`form-fields ${doc ? 'vertical' : ''}`}>
          {#if doc}
            <label class="radio">
              <input
                type="radio"
                name="{idPrefix}-use-header-background"
                checked={settings.useHeaderBackground === true}
                onclick={() => (settings.useHeaderBackground = true)}
              />
              {localize('Yes')}
            </label>
            <label class="radio">
              <input
                type="radio"
                name="{idPrefix}-use-header-background"
                checked={settings.useHeaderBackground === false}
                onclick={() => (settings.useHeaderBackground = false)}
              />
              {localize('No')}
            </label>
            <label class="radio">
              <input
                type="radio"
                name="{idPrefix}-use-header-background"
                checked={settings.useHeaderBackground === undefined}
                onclick={() => (settings.useHeaderBackground = undefined)}
              />
              {useHeaderBackgroundDefaultLabel}
            </label>
          {:else}
            <input
              id="{idPrefix}-use-header-background"
              type="checkbox"
              bind:checked={settings.useHeaderBackground}
            />
          {/if}
        </div>
        <p class="hint">
          {localize('TIDY5E.SETTINGS.Theme.UseHeaderBackground.Hint')}
        </p>
      </div>

      {#if useHeaderBackgroundIfChanged}
        <div class="form-group">
          <label for="{idPrefix}-actor-header-background">
            {localize('TIDY5E.SETTINGS.Theme.ActorHeaderBackground.Title')}
          </label>
          <div class="form-fields">
            <input
              id="{idPrefix}-actor-header-background"
              type="text"
              bind:value={settings.actorHeaderBackground}
              placeholder={placeholders?.actorHeaderBackground}
            />
            <ImagePickerButton
              current={settings.actorHeaderBackground}
              onimagepicked={(image) =>
                (settings.actorHeaderBackground = image)}
            />
          </div>
        </div>

        <ThemeSettingColorFormGroupQuadrone
          key="sheet-accent-color"
          bind:value={settings.headerBackgroundColor}
          label={localize('TIDY5E.SETTINGS.Theme.HeaderBackgroundColor.Title')}
          placeholder={placeholders?.headerBackgroundColor}
          hint={localize('TIDY5E.SETTINGS.Theme.HeaderBackgroundColor.Hint')}
        />
      {/if}
    {/if}
  {/if}

  <div class="form-group">
    <label for="{idPrefix}-use-basic-theme">
      {localize('TIDY5E.SETTINGS.Theme.UseBasicTheme.Title')}
    </label>
    <div class={`form-fields ${doc ? 'vertical' : ''}`}>
      {#if doc}
        <label class="radio">
          <input
            type="radio"
            name="{idPrefix}-use-basic-theme"
            checked={settings.useBasicTheme === true}
            onclick={() => onUseBasicThemeChange(true)}
          />
          {localize('Yes')}
        </label>
        <label class="radio">
          <input
            type="radio"
            name="{idPrefix}-use-basic-theme"
            checked={settings.useBasicTheme === false}
            onclick={() => onUseBasicThemeChange(false)}
          />
          {localize('No')}
        </label>
        <label class="radio">
          <input
            type="radio"
            name="{idPrefix}-use-basic-theme"
            checked={settings.useBasicTheme === undefined}
            onclick={() => onUseBasicThemeChange(undefined)}
          />
          {useBasicThemeDefaultLabel}
        </label>
      {:else}
        <input
          id="{idPrefix}-use-basic-theme"
          type="checkbox"
          checked={settings.useBasicTheme ?? false}
          onchange={(ev) => onUseBasicThemeChange(ev.currentTarget.checked)}
        />
      {/if}
    </div>
    <p class="hint">
      {localize('TIDY5E.SETTINGS.Theme.UseBasicTheme.Hint')}
    </p>
  </div>

  <!-- TODO: Add item sidebar background setting -->
  {#if showItemSidebarBackground}
    <div class="form-group">
      <label for="{idPrefix}-item-sidebar-background">
        {localize('TIDY5E.SETTINGS.Theme.ItemSidebarBackground.Title')}
      </label>
      <div class="form-fields">
        <input
          id="{idPrefix}-item-sidebar-background"
          type="text"
          bind:value={settings.itemSidebarBackground}
          placeholder={placeholders?.itemSidebarBackground}
        />
        <ImagePickerButton
          current={settings.itemSidebarBackground}
          onimagepicked={(image) => (settings.itemSidebarBackground = image)}
        />
      </div>
    </div>
  {/if}
</fieldset>
<fieldset>
  <legend>
    {localize('TIDY5E.SETTINGS.Theme.RarityColors.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  {#if settings.rarityColors}
    {#each rarities as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={settings.rarityColors[color.key]}
        label={color.label.titleCase()}
        placeholder={rarityColorPlaceholders[color.key]}
      />
    {/each}
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('TIDY5E.SETTINGS.Theme.SpellcastingMethodColors.Title')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  {#if settings.spellPreparationMethodColors}
    {#each spellPreparationMethodColors as color}
      <ThemeSettingColorFormGroupQuadrone
        key={color.key}
        bind:value={settings.spellPreparationMethodColors[color.key]}
        label={color.label}
        placeholder={methodColorPlaceholders[color.key]}
      />
    {/each}
  {/if}
</fieldset>
