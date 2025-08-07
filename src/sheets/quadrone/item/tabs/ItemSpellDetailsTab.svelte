<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import FieldTargets from '../parts/FieldTargets.svelte';
  import FieldActivation from '../parts/FieldActivation.svelte';
  import FieldRange from '../parts/FieldRange.svelte';
  import FieldDuration from '../parts/FieldDuration.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.SpellDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Spell Level -->
  <div class="form-group">
    <label for="{appId}-level">{localize('DND5E.SpellLevel')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-level"
        document={context.item}
        field="system.level"
        value={context.source.level}
        disabled={!context.unlocked}
      >
        <SelectOptions data={context.config.spellLevels} />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Spell School -->
  <div class="form-group">
    <label for="{appId}-school">{localize('DND5E.SpellSchool')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-school"
        document={context.item}
        field="system.school"
        value={context.source.school}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.spellSchools}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>

  <!-- Spell Components -->
  <div class="form-group spell-components stacked checkbox-grid">
    <label for="">
      {localize('DND5E.SpellComponents')}
    </label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  <!-- Material Components -->
  {#if context.properties.object.material}
    <div class="form-group split-group">
      <label for="">{localize('DND5E.SpellMaterials')}</label>

      <div class="form-fields">
        <!-- Material Supply -->
        <div class="form-group label-top">
          <label for="{appId}-materials-supply"
            >{localize('DND5E.Supply')}</label
          >
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-materials-supply"
              document={context.item}
              field="system.materials.supply"
              value={context.source.materials.supply}
              min="0"
              disabled={!context.unlocked}
            />
          </div>
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
            <NumberInputQuadrone
              id="{appId}-materials-cost"
              document={context.item}
              field="system.materials.cost"
              value={context.source.materials.cost}
              min="0"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Material Consumption -->
        <div class="form-group checkbox">
          <label for="{appId}-materials-consumed" class="checkbox"
            >{localize('DND5E.Consumed')}
            <div class="form-fields">
              <CheckboxQuadrone
                id="{appId}-materials-consumed"
                document={context.item}
                field="system.materials.consumed"
                checked={context.source.materials.consumed}
                disabledChecked={context.system.materials.consumed}
                disabled={!context.unlocked}
              />
            </div>
          </label>
        </div>
      </div>

      <!-- Material Description -->
      <TextInputQuadrone
        id="{appId}-materials-value"
        document={context.item}
        field="system.materials.value"
        value={context.source.materials.value}
        class="full-width"
        disabled={!context.unlocked}
      />
    </div>
  {/if}

  <!-- Preparation Method -->
  <div class="form-group">
    <label for="{appId}-method"
      >{localize('DND5E.SpellPreparation.Method')}</label
    >
    <div class="form-fields">
      <div class="form-group label-top">
        <!-- Method -->
        <label for="{appId}-method">
          {localize('DND5E.Method')}
        </label>
        <div class="form-fields">
          <SelectQuadrone
            id="{appId}-method"
            document={context.item}
            field="system.method"
            value={context.source.method}
            disabled={!context.unlocked}
          >
            <SelectOptions
              data={context.spellcastingMethods}
              labelProp="label"
              valueProp="value"
            />
          </SelectQuadrone>
        </div>
      </div>

      <!-- Preparation -->
      {#if context.canPrepare}
        <div class="form-group label-top">
          <label for="{appId}-prepared">
            {localize('DND5E.Preparation')}
          </label>
          <div class="form-fields">
            <SelectQuadrone
              id="{appId}-prepared"
              document={context.item}
              field="system.prepared"
              value={context.source.prepared}
              disabled={!context.unlocked}
            >
              <SelectOptions
                data={context.config.spellPreparationStates}
                labelProp="label"
                valueProp="value"
              />
            </SelectQuadrone>
          </div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Source Class -->
  {#if context.isEmbedded}
    <div class="form-group">
      <label for="{appId}-sourceClass"
        >{localize('DND5E.SpellSourceClass')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-sourceClass"
          document={context.item}
          field="system.sourceClass"
          value={context.source.sourceClass}
          disabled={!context.unlocked}
          blankValue=""
        >
          <SelectOptions
            data={context.document.parent.spellcastingClasses}
            labelProp="name"
            blank=""
          />
        </SelectQuadrone>
      </div>
    </div>

    <div class="form-group">
      <label for="{appId}-ability">{localize('DND5E.SpellAbility')}</label>
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-ability"
          document={context.item}
          field="system.ability"
          value={context.source.ability}
          disabled={!context.unlocked}
          blankValue=""
        >
          <SelectOptions
            data={context.config.abilities}
            labelProp="label"
            blank={context.defaultAbility}
          />
        </SelectQuadrone>
      </div>
    </div>
  {:else}
    <div class="form-group">
      <label for="{appId}-sourceClass"
        >{localize('DND5E.SpellSourceClass')}</label
      >
      <div class="form-fields">
        <TextInputQuadrone
          id="{appId}-sourceClass"
          document={context.item}
          field="system.sourceClass"
          value={context.source.sourceClass}
          disabled={!context.unlocked}
        />
      </div>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.Casting')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <FieldActivation />
  <FieldRange />
  <FieldDuration />
</fieldset>

<FieldTargets />

<FieldUses />
