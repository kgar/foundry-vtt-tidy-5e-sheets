<script lang="ts">
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">{localize('DND5E.SpellDetails')}</h3>

<!-- Spell Level -->
<div class="form-group">
  <label for="{appId}-level">{localize('DND5E.SpellLevel')}</label>
  <Select
    id="{appId}-level"
    document={context.item}
    field="system.level"
    value={context.source.level}
    disabled={!context.editable}
  >
    <SelectOptions data={context.config.spellLevels} />
  </Select>
</div>

<!-- Spell School -->
<div class="form-group">
  <label for="{appId}-school">{localize('DND5E.SpellSchool')}</label>
  <Select
    id="{appId}-school"
    document={context.item}
    field="system.school"
    value={context.source.school}
    disabled={!context.editable}
  >
    <SelectOptions
      data={context.config.spellSchools}
      labelProp="label"
      blank=""
    />
  </Select>
</div>

<!-- Spell Components -->
<div class="form-group spell-components stacked">
  <label for="">
    {localize('DND5E.SpellComponents')}
  </label>
  <ItemProperties />
</div>

<!-- Material Components -->
{#if context.properties.object.material}
  <div class="form-group split-group">
    <label for="">{localize('DND5E.SpellMaterials')}</label>

    <div class="form-fields">
      <!-- Material Supply -->
      <div class="form-group label-top">
        <label for="{appId}-materials-supply">{localize('DND5E.Supply')}</label>
        <NumberInput
          id="{appId}-materials-supply"
          document={context.item}
          field="system.materials.supply"
          value={context.source.materials.supply}
          min="0"
          disabled={!context.editable}
        />
      </div>

      <!-- Material Cost -->
      <div class="form-group label-top">
        <label
          for="{appId}-materials-cost"
          class="label-icon currency gp"
          aria-label={localize('DND5E.CostGP')}
        >
          {localize('DND5E.Cost')}
        </label>

        <div class="form-fields">
          <NumberInput
            id="{appId}-materials-cost"
            document={context.item}
            field="system.materials.cost"
            value={context.source.materials.cost}
            min="0"
            placeholder="—"
            disabled={!context.editable}
          />
        </div>
      </div>

      <!-- Material Consumption -->
      <div class="form-group checkbox">
        <label for="{appId}-materials-consumed"
          >{localize('DND5E.Consumed')}</label
        >
        <Checkbox
          id="{appId}-materials-consumed"
          document={context.item}
          field="system.materials.consumed"
          checked={context.source.materials.consumed}
          disabled={!context.editable}
        />
      </div>
    </div>

    <!-- Material Description -->
    <TextInput
      id="{appId}-materials-value"
      document={context.item}
      field="system.materials.value"
      value={context.source.materials.value}
      class="full-width"
      disabled={!context.editable}
    />
  </div>
{/if}

<!-- Preparation Method -->
<div class="form-group">
  <label for="{appId}-method">{localize('DND5E.SpellPreparation.Method')}</label
  >
  <div class="form-fields">
    <div class="form-group label-top">
      <!-- Method -->
      <label for="{appId}-method">
        {localize('DND5E.Method')}
      </label>
      <div class="form-fields">
        <Select
          id="{appId}-method"
          document={context.item}
          field="system.method"
          value={context.source.method}
          disabled={!context.editable}
        >
          <SelectOptions
            data={context.spellcastingMethods}
            labelProp="label"
            valueProp="value"
          />
        </Select>
      </div>
    </div>

    <!-- Preparation -->
    {#if context.item.system.canPrepare}
      <div class="form-group label-top">
        <label for="{appId}-prepared">
          {localize('DND5E.Preparation')}
        </label>
        <div class="form-fields">
          <Select
            id="{appId}-prepared"
            document={context.item}
            field="system.prepared"
            value={context.source.prepared}
            disabled={!context.editable}
          >
            <SelectOptions
              data={context.config.spellPreparationStates}
              labelProp="label"
              valueProp="value"
            />
          </Select>
        </div>
      </div>
    {/if}
  </div>
</div>

<!-- Source Class -->
{#if context.isEmbedded}
  <div class="form-group">
    <label for="{appId}-sourceClass">{localize('DND5E.SpellSourceClass')}</label
    >
    <div class="form-fields">
      <Select
        id="{appId}-sourceClass"
        document={context.item}
        field="system.sourceClass"
        value={context.source.sourceClass}
        disabled={!context.editable}
        blankValue=""
      >
        <SelectOptions
          data={context.document.parent.spellcastingClasses}
          labelProp="name"
          blank=""
        />
      </Select>
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-ability">{localize('DND5E.SpellAbility')}</label>
    <div class="form-fields">
      <Select
        id="{appId}-ability"
        document={context.item}
        field="system.ability"
        value={context.source.ability}
        disabled={!context.editable}
        blankValue=""
      >
        <SelectOptions
          data={context.config.abilities}
          labelProp="label"
          blank={context.defaultAbility}
        />
      </Select>
    </div>
  </div>
{:else}
  <div class="form-group">
    <label for="{appId}-sourceClass">{localize('DND5E.SpellSourceClass')}</label
    >
    <div class="form-fields">
      <TextInput
        id="{appId}-sourceClass"
        document={context.item}
        field="system.sourceClass"
        value={context.source.sourceClass}
        disabled={!context.editable}
      />
    </div>
  </div>
{/if}

<h3 class="form-header">{localize('DND5E.Casting')}</h3>

<!-- Activation -->
<FieldActivation />

<!-- Range -->
<FieldRange />

<!-- Duration -->
<FieldDuration />

<!-- Targets -->
<FieldTargets />

<FieldUses />
