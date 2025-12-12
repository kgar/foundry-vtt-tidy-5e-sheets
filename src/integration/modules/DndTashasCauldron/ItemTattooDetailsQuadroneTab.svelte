<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import ItemProperties from '../../../sheets/quadrone/item/parts/ItemProperties.svelte';
  import { DndTashasCauldronModuleIntegration } from './DndTashasCauldron';
  import FieldUses from 'src/sheets/quadrone/item/parts/FieldUses.svelte';
  import QuantityWeightPriceFormGroups from 'src/sheets/quadrone/item/parts/QuantityWeightPriceFormGroups.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id.slugify());

  let localize = FoundryAdapter.localize;

  let spellwroughtOptions = Array.fromRange(
    DndTashasCauldronModuleIntegration.tcoeSpellwroughtOptions,
  ).map((value) => {
    return { value, label: CONFIG.DND5E.spellLevels[value] };
  });

  let attuneHtmlPromise = foundry.applications.ux.TextEditor.enrichHTML(
    `&Reference[tattoo]{${game.i18n.localize('DND5E.Attunement')}}`,
  );

  let spellwroughtHtmlPromise = foundry.applications.ux.TextEditor.enrichHTML(
    `&Reference[spellwrought]{${game.i18n.localize('TCOE.Tattoo.Type')}}`,
  );
</script>

<fieldset disabled={!context.unlocked}>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset disabled={!context.unlocked}>
  <legend>
    {localize('TCOE.Tattoo.Details')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FormGroup
    document={context.document}
    fields={[
      {
        field: context.fields.attuned,
        config: {
          id: `${appId}-attuned`,
          value: context.source.attuned,
          disabled: !context.config.attunementTypes[context.source.attunement],
          aria: {
            label: localize('DND5E.Attuned'),
          },
        },
        tooltip: 'DND5E.Attuned',
      },
      {
        field: context.fields.attunement,
        config: {
          id: `${appId}-attunement`,
          value: context.source.attunement,
        },
        blankLabel: 'DND5E.AttunementNone',
        choices: context.config.attunementTypes,
      },
    ]}
  >
    {#snippet formLabel()}
      {#if context.source.attunement === 0}
        <label>{localize('DND5E.Attunement')}</label>
      {:else}
        <label class="reference">
          {#await attuneHtmlPromise then attune}
            {@html attune}
          {/await}
        </label>
      {/if}
    {/snippet}
  </FormGroup>

  <FormGroup
    document={context.document}
    fields={[
      {
        field: context.fields.type.fields.value,
        config: {
          id: `${appId}-type-value`,
          value: context.source.type.value,
        },
        choices: DndTashasCauldronModuleIntegration.tcoeTattooTypes,
      },
    ]}
  >
    {#snippet formLabel()}
      {#if context.system.isSpellwrought}
        <label class="reference">
          {#await spellwroughtHtmlPromise then spellwrought}
            {@html spellwrought}
          {/await}
        </label>
      {:else}
        <label>{localize('TCOE.Tattoo.Type')}</label>
      {/if}
    {/snippet}
  </FormGroup>

  {#if context.system.isSpellwrought}
    <FormGroup
      label="DND5E.SpellLevel"
      labelFor="{appId}-level"
      document={context.document}
      field={context.fields.level}
      config={{
        id: `${appId}-level`,
        value: context.source.level,
      }}
      choices={spellwroughtOptions}
    />
  {/if}

  <FormGroup
    labelFor="{appId}-proficient"
    document={context.document}
    field={context.fields.proficient}
    config={{
      id: `${appId}-proficient`,
      value: context.source.proficient,
    }}
    blankLabel="DND5E.Automatic"
    choices={context.config.weaponAndArmorProficiencyLevels}
  />

  <div class="form-group stacked tattoo-properties checkbox-grid">
    <label for="">{localize('TCOE.Tattoo.Properties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

<FieldUses />
