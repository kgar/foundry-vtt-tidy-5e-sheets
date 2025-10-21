<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import FeatureOriginFormGroup from '../parts/FeatureOriginFormGroup.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemFeatureDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group">
    <label for="{appId}-requirements">{localize('DND5E.Requirements')}</label>
    <div class="form-fields">
      <TextInputQuadrone
        id="{appId}-requirements"
        document={context.item}
        field="system.requirements"
        value={context.source.requirements}
        disabled={!context.unlocked}
      />
    </div>
  </div>

  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.Type')}</label>
    <div class="form-fields">
      <SelectQuadrone
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.featureTypes}
          labelProp="label"
          blank=""
        />
      </SelectQuadrone>
    </div>
  </div>

  {#if context.item.actor?.type === CONSTANTS.SHEET_TYPE_CHARACTER}
    <FeatureOriginFormGroup />
  {/if}

  {#if context.itemSubtypes}
    {@const category =
      context.config.featureTypes[context.system.type.value]?.label}

    <div class="form-group">
      <label for="{appId}-type-subtype"
        >{localize('DND5E.ItemFeatureSubtype', { category })}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-type-subtype"
          document={context.item}
          field="system.type.subtype"
          value={context.source.type.subtype}
          disabled={!context.unlocked}
        >
          <SelectOptions data={context.itemSubtypes} blank="" />
        </SelectQuadrone>
      </div>
    </div>
  {/if}

  {#if context.system.type.value === CONSTANTS.FEAT_TYPE_VEHICLE}
    <div class="form-group">
      <label for="{appId}-cover"
        >{localize('DND5E.FEATURE.FIELDS.cover.label')}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-cover"
          document={context.item}
          field="system.cover"
          value={context.source.cover}
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.coverOptions}
            labelProp="label"
            valueProp="value"
            blank=""
          />
        </SelectQuadrone>
      </div>
      <p class="hint">
        {localize('DND5E.FEATURE.FIELDS.cover.hint')}
      </p>
    </div>
  {/if}

  <div class="form-group">
    <label for="{appId}-prerequisites-level"
      >{localize('DND5E.Prerequisites.FIELDS.prerequisites.level.label')}</label
    >
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-prerequisites-level"
        document={context.item}
        field="system.prerequisites.level"
        value={context.source.prerequisites.level}
        disabled={!context.unlocked}
        step="1"
      />
    </div>

    <p class="hint">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.level.hint')}
    </p>
  </div>

  <div class="form-group">
    <label for="{appId}-prerequisites-items"
      >{localize(
        context.system.schema.fields.prerequisites.fields.items.label,
      )}</label
    >
    <div
      class="form-fields"
      {@attach (el) => {
        const input: HTMLElement =
          context.system.schema.fields.prerequisites.fields.items.toInput({
            disabled: !context.unlocked,
            value: [...context.source.prerequisites.items],
            id: `${appId}-prerequisites-items`,
          });

        el.appendChild(input);

        return () => {
          input.remove();
        };
      }}
    ></div>

    <p class="hint">
      {localize(context.system.schema.fields.prerequisites.fields.items.hint)}
    </p>
  </div>

  <div class="form-group">
    <label for="prerequisites-repeatable-{appId}">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.repeatable.label')}
    </label>
    <div class="form-fields">
      <label class="checkbox" for="prerequisites-repeatable-{appId}">
        <CheckboxQuadrone
          id="prerequisites-repeatable-{appId}"
          document={context.item}
          field="system.prerequisites.repeatable"
          checked={context.source.prerequisites.repeatable}
          disabledChecked={context.system.prerequisites.repeatable}
          disabled={!context.unlocked}
        />
        &nbsp;
      </label>
    </div>
    <p class="hint">
      {localize('DND5E.Prerequisites.FIELDS.prerequisites.repeatable.hint')}
    </p>
  </div>

  <div class="form-group stacked feature-properties checkbox-grid">
    <label for="">{localize('DND5E.ItemFeatureProperties')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>
</fieldset>

{#if context.system.isEnchantmentSource}
  <fieldset>
    <legend>
      {localize('DND5E.ENCHANTMENT.Label')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <!-- Max Enchantments -->
    <div class="form-group">
      <label for="{appId}-enchant-max"
        >{localize(
          'DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.label',
        )}</label
      >
      <div class="form-fields">
        <TextInputQuadrone
          id="{appId}-enchant-max"
          document={context.item}
          field="system.enchant.max"
          value={context.source.enchant.max}
          disabled={!context.unlocked}
        />
      </div>

      <p class="hint">
        {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.max.hint')}
      </p>
    </div>

    <!-- Enchantment Replacement -->
    <div class="form-group">
      <label for="{appId}-enchant-period"
        >{localize(
          'DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.label',
        )}</label
      >
      <div class="form-fields">
        <SelectQuadrone
          id="{appId}-enchant-period"
          document={context.item}
          field="system.enchant.period"
          value={context.source.enchant.period}
          blankValue=""
          disabled={!context.unlocked}
        >
          <SelectOptions
            data={context.config.enchantmentPeriods}
            blank={localize('DND5E.USES.Recovery.Never')}
            labelProp="label"
            valueProp="value"
          />
        </SelectQuadrone>
      </div>

      <p class="hint">
        {localize('DND5E.ENCHANTMENT.FIELDS.enchantment.items.period.hint')}
      </p>
    </div>
  </fieldset>
{/if}

<FieldUses />
