<script lang="ts">
  import type {
    ThemeSettingsContext,
    ThemeSettingsQuadroneApplication,
  } from './ThemeSettingsQuadroneApplication.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ThemeColorSetting } from 'src/theme/theme-quadrone.types';
  import { isNil } from 'src/utils/data';

  interface Props {
    app: ThemeSettingsQuadroneApplication;
    settings: ThemeSettingsContext;
  }

  let { app, settings: data }: Props = $props();

  const localize = FoundryAdapter.localize;
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

    {@render colorFormGroup(data.accentColor)}
  </fieldset>

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
        reduce eye strain, particularly with text. Select this option to use the
        fully saturated rarity color.
      </p>
    </div>
    {#each data.rarityColors as color}
      {@render colorFormGroup(color)}
    {/each}
  </fieldset>

  <fieldset>
    <legend>
      (Localize) Spell Preparation Mode Colors
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    {#each data.spellPreparationColors as color}
      {@render colorFormGroup(color)}
    {/each}
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

{#snippet colorFormGroup(color: ThemeColorSetting & { label: string })}
  <div class="form-group">
    <label for="">{color.label}</label>
    <div class="form-fields">
      <input
        type="text"
        bind:value={color.value}
        onchange={(ev) => {
          color.value = ev.currentTarget.value;
        }}
      />
      <!-- <input
        type="color"
        value={color.value}
        onchange={(ev) => {
          color.value = ev.currentTarget.value;
        }}
      /> -->
      <button
        type="button"
        class="button"
        disabled={isNil(color.value, '')}
        onclick={() => (color.value = '')}
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  </div>
{/snippet}
