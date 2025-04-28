<script lang="ts">
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import ItemProperties from '../../../sheets/quadrone/item/parts/ItemProperties.svelte';
  import { DndTashasCauldronModuleIntegration } from './DndTashasCauldron';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FieldUses from 'src/sheets/quadrone/item/parts/FieldUses.svelte';
  import QuantityWeightPriceFormGroups from 'src/sheets/quadrone/item/parts/QuantityWeightPriceFormGroups.svelte';

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

<fieldset>
  <QuantityWeightPriceFormGroups />
</fieldset>

<fieldset>
  <legend>
    {localize('TCOE.Tattoo.Details')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group split-group">
    {#if context.source.attunement === 0}
      <label>{localize('DND5E.Attunement')}</label>
    {:else}
      <label class="reference">
        {#await attuneHtmlPromise then attune}
          {@html attune}
        {/await}
      </label>
    {/if}
    <div class="form-fields">
      <!-- Attuned -->
      <label class="checkbox" for="{appId}-attuned">
        <CheckboxQuadrone
          id={`${appId}-system-attuned`}
          document={context.item}
          field="system.attuned"
          checked={context.source.attuned}
          disabledChecked={context.system.attuned}
          disabled={!context.unlocked ||
            !context.config.attunementTypes[context.source.attunement]}
          title={localize('DND5E.Attuned')}
        />
      </label>

      <!-- Attunement -->
      <SelectQuadrone
        id="{appId}-attunement"
        document={context.item}
        field="system.attunement"
        value={context.source.attunement}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.attunementTypes}
          blank={localize('DND5E.AttunementNone')}
        />
      </SelectQuadrone>
    </div>
  </div>

  <div class="form-group">
    {#if context.system.isSpellwrought}
      <label class="reference">
        {#await spellwroughtHtmlPromise then spellwrought}
          {@html spellwrought}
        {/await}
      </label>
    {:else}
      <label>{localize('TCOE.Tattoo.Type')}</label>
    {/if}
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabled={!context.unlocked}
        blankValue=""
      >
        <SelectOptions
          data={DndTashasCauldronModuleIntegration.tcoeTattooTypes}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>

  {#if context.system.isSpellwrought}
    <div class="form-group">
      <label>{localize('DND5E.SpellLevel')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-level"
          document={context.item}
          field="system.level"
          value={context.source.level}
          disabled={!context.unlocked}
        >
          <SelectOptions data={spellwroughtOptions} />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  <div class="form-group">
    <label for="{appId}-proficient">
      {localize('DND5E.ProficiencyLevel')}
    </label>
    <div class="form-fields">
      <Select
        id="{appId}-proficient"
        document={context.item}
        field="system.proficient"
        value={context.source.proficient}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weaponAndArmorProficiencyLevels}
          blank={localize('DND5E.Automatic')}
        />
      </Select>
    </div>
  </div>

  <div class="form-group stacked tattoo-properties checkbox-grid">
    <label for="">{localize('TCOE.Tattoo.Properties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

<FieldUses />
