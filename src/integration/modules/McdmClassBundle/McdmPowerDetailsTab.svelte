<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import FieldActivation from 'src/sheets/quadrone/item/parts/FieldActivation.svelte';
  import FieldDuration from 'src/sheets/quadrone/item/parts/FieldDuration.svelte';
  import FieldRange from 'src/sheets/quadrone/item/parts/FieldRange.svelte';
  import FieldTargets from 'src/sheets/quadrone/item/parts/FieldTargets.svelte';
  import FieldUses from 'src/sheets/quadrone/item/parts/FieldUses.svelte';
  import ItemProperties from 'src/sheets/quadrone/item/parts/ItemProperties.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  let localize = FoundryAdapter.localize;

</script>

<fieldset>
  <legend>
    {localize('MCDMCB.TALENT.POWERS.SHEET.Details')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Power Order -->
  <div class="form-group">
    <label for="{appId}-order">{localize('MCDMCB.TALENT.POWERS.ORDERS.Label')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-order"
        document={context.item}
        field="system.order"
        value={context.source.order}
        disabled={!context.unlocked}
      >
        <SelectOptions data={CONFIG.MCDM.powerOrders}/>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Power Specialty -->
  <div class="form-group">
    <label for="{appId}-specialty">{localize('MCDMCB.TALENT.POWERS.SPECIALTIES.Label')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-specialty"
        document={context.item}
        field="system.specialty"
        value={context.source.specialty}
        disabled={!context.unlocked}
        blankValue=""
      >
        <SelectOptions data={CONFIG.MCDM.specialties} blank=""/>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Power Properties -->
  <div class="form-group spell-components stacked checkbox-grid">
    <label for="">
      {localize('DND5E.Properties')}
    </label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Ability -->
  {#if context.isEmbedded}
    <div class="form-group">
      <label for="{appId}-ability">{localize('MCDMCB.TALENT.POWERS.ManifestAbility')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-ability"
          document={context.item}
          field="system.ability"
          value={context.source.ability}
          disabled={!context.unlocked}
          blankValue=""
        >
          <SelectOptions data={context.config.abilities} labelProp="label" blank={context.defaultAbility} />
        </SelectQuadrone>
      </div>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('MCDMCB.TALENT.POWERS.SHEET.ManifestingHeader')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FieldActivation />
  <FieldRange />
  <FieldDuration />
</fieldset>

<FieldTargets />

<FieldUses />