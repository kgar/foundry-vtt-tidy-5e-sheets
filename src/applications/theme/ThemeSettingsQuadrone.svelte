<script lang="ts">
  import type {
    ThemeSettingsContext,
    ThemeSettingsQuadroneApplication,
  } from './ThemeSettingsQuadroneApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ThemeSettingColorFormGroupQuadrone from './ThemeSettingColorFormGroupQuadrone.svelte';

  interface Props {
    app: ThemeSettingsQuadroneApplication;
    settings: ThemeSettingsContext;
  }

  let { app, settings: data }: Props = $props();

  const localize = FoundryAdapter.localize;

  function pickHeaderBackground(
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement },
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const fp = new foundry.applications.apps.FilePicker({
      type: 'image',
      current: data.headerBackground,
      callback: (path: string) => {
        data.headerBackground = path;
      },
      top: rect.top + 40,
      left: rect.left + 10,
    });
    return fp.browse();
  }
</script>

<div class="scrollable flex1">
  <h2>
    {localize('TIDY5E.ThemeSettings.SheetMenu.name')}
  </h2>

  <fieldset>
    <legend>
      (Not Sure how to title this section)
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <ThemeSettingColorFormGroupQuadrone
      key="accent-color"
      bind:value={data.accentColor}
      label="(Localize) Accent Color"
    />

    <div class="form-group">
      <label for="">(Localize) Header Background</label>
      <div class="form-fields">
        <input type="text" bind:value={data.headerBackground} />
        <button type="button" class="button" onclick={pickHeaderBackground}>
          <i class="fa-solid fa-search"></i>
        </button>
      </div>
    </div>

    <fieldset>
      <legend>
        (Localize) Rarity Colors
        <tidy-gold-header-underline></tidy-gold-header-underline>
      </legend>

      <div class="form-group">
        <label for="">(Localize) Use Saturated Rarity Colors</label>
        <div class="form-fields">
          <input type="checkbox" bind:checked={data.useSaturatedRarityColors} />
        </div>
        <p class="hint">
          (Localize) In some cases, Tidy 5e will desaturate rarity colors to
          reduce eye strain, particularly with text. Select this option to use
          the fully saturated rarity color.
        </p>
      </div>
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
        (Localize) Spell Preparation Mode Colors
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
  </fieldset>
</div>

<div class="flexrow flex0">
  <button
    type="button"
    class="button button-primary save-changes-btn"
    onclick={() => app.save()}
  >
    {localize('TIDY5E.SaveChanges')}
  </button>
  <!-- <button type="button" class="button" onclick={() => app.apply()}
      >{localize('TIDY5E.ApplyChanges')}</button
      > -->
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
