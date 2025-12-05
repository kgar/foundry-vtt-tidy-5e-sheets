<script lang="ts">
  import Select from 'src/components/inputs/Select.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<h3 class="form-header">
  {localize('DND5E.TargetPl')}
</h3>

<!-- Target Type -->
<div class="form-group split-group">
  <label for="{appId}-target-affects-type">{localize('DND5E.Type')}</label>
  <div class="form-fields">
    <!-- Amount -->
    {#if context.system.target.affects.scalar}
      <div class="form-group label-top">
        <label for="{appId}-target-affects-count"
          >{localize('DND5E.Amount')}</label
        >
        <TextInput
          id="{appId}-target-affects-count"
          document={context.item}
          field="system.target.affects.count"
          value={context.source.target.affects.count}
          placeholder={context.affectsPlaceholder}
          disabled={!context.editable}
        />
      </div>
    {/if}

    <!-- Type -->
    <div class="form-group label-top">
      <label for="{appId}-target-affects-type">{localize('DND5E.Type')}</label>
      <Select
        id="{appId}-target-affects-type"
        document={context.item}
        field="system.target.affects.type"
        value={context.source.target.affects.type}
        blankValue=""
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.config.individualTargetTypes}
          labelProp="label"
          blank=""
        />
      </Select>
    </div>
  </div>

  <!-- Special -->
  {#if context.source.target.affects.type}
    <TextInput
      id="{appId}-target-affects-special"
      document={context.item}
      field="system.target.affects.special"
      value={context.source.target.affects.special}
      class="full-width"
      placeholder={localize('DND5E.TARGET.FIELDS.target.affects.special.label')}
      disabled={!context.editable}
    />
  {/if}
</div>

<!-- Choose Targets  -->
{#if context.system.target.template.type}
  <div class="form-group">
    <label for="{appId}-target-affects-choice"
      >{localize('DND5E.TARGET.FIELDS.target.affects.choice.label')}</label
    >
    <Checkbox
      id="{appId}-target-affects-choice"
      document={context.item}
      field="system.target.affects.choice"
      checked={context.source.target.affects.choice}
      disabled={!context.editable}
    />

    <p class="hint">
      {localize('DND5E.TARGET.FIELDS.target.affects.choice.hint')}
    </p>
  </div>
{/if}

<h3 class="form-header">
  {localize('DND5E.TargetTypeArea')}
</h3>

<!-- Template Type -->
<div class="form-group">
  <label for="{appId}-target-template-type">{localize('DND5E.Shape')}</label>
  <Select
    id="{appId}-target-template-type"
    document={context.item}
    field="system.target.template.type"
    value={context.source.target.template.type}
    disabled={!context.editable}
    blankValue=""
  >
    <SelectOptions
      data={context.config.areaTargetOptions}
      labelProp="label"
      valueProp="value"
    />
  </Select>
</div>

<!-- Dimensions -->
{#if context.system.target.template.type && context.dimensions}
  <div class="form-group split-group">
    <label for="">{localize('DND5E.Dimensions')}</label>
    <div class="form-fields">
      <!-- Size -->
      <div class="form-group label-top">
        <label for="{appId}-target-template-size"
          >{localize(context.dimensions.size)}</label
        >
        <TextInput
          id="{appId}-target-template-size"
          document={context.item}
          field="system.target.template.size"
          value={context.source.target.template.size}
          disabled={!context.editable}
        />
      </div>

      <!-- Width -->
      {#if context.dimensions?.width}
        <div class="form-group label-top">
          <label for="{appId}-target-template-width"
            >{localize(context.dimensions.width)}</label
          >
          <TextInput
            id="{appId}-target-template-width"
            document={context.item}
            field="system.target.template.width"
            value={context.source.target.template.width}
            disabled={!context.editable}
          />
        </div>
      {/if}

      <!-- Height -->
      {#if context.dimensions?.height}
        <div class="form-group label-top">
          <label for="{appId}-target-template-height"
            >{localize(context.dimensions.height)}</label
          >
          <TextInput
            id="{appId}-target-template-height"
            document={context.item}
            field="system.target.template.height"
            value={context.source.target.template.height}
            disabled={!context.editable}
          />
        </div>
      {/if}

      <!-- Units -->
      <div class="form-group label-top">
        <label for="{appId}-target-template-units"
          >{localize('DND5E.MOVEMENT.FIELDS.units.label')}</label
        >
        <Select
          id="{appId}-target-template-units"
          document={context.item}
          field="system.target.template.units"
          value={context.source.target.template.units}
          disabled={!context.editable}
        >
          <SelectOptions
            data={context.config.movementUnits}
            labelProp="label"
          />
        </Select>
      </div>
    </div>
  </div>

  <!-- Multiple -->
  <div class="form-group split-group">
    <label for="{appId}-target-template-count"
      >{localize('DND5E.Multiple')}</label
    >
    <div class="form-fields">
      <!-- Amount -->
      <div class="form-field label-top">
        <label for="{appId}-target-template-count"
          >{localize('DND5E.Amount')}</label
        >
        <TextInput
          id="{appId}-target-template-count"
          document={context.item}
          field="system.target.template.count"
          value={context.source.target.template.count}
          placeholder="1"
          disabled={!context.editable}
        />
      </div>

      <!-- Contiguous -->
      {#if context.system.target.template.type && context.system.target.template.count > 1}
        <div class="form-group checkbox">
          <label for="{appId}-target-template-contiguous"
            >{localize('DND5E.Contiguous')}</label
          >
          <Checkbox
            id="{appId}-target-template-contiguous"
            document={context.item}
            field="system.target.template.contiguous"
            checked={context.source.target.template.contiguous}
            disabled={!context.editable}
          />
        </div>
      {/if}
    </div>
  </div>
{/if}
