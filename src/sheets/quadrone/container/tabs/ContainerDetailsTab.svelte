<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import ItemProperties from 'src/sheets/quadrone/item/parts/ItemProperties.svelte';
  import { getContainerSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';

  let context = $derived(getContainerSheetQuadroneContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <div class="form-group">
    <label for="{appId}-weight-value">
      {localize('DND5E.Weight')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-weight-value"
        value={context.source.weight.value}
        step="any"
        field="system.weight.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
      />
      <SelectQuadrone
        document={context.item}
        field="system.weight.units"
        value={context.source.weight.units}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.weightUnits}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
  <div class="form-group">
    <label for="{appId}-price-value">
      {localize('DND5E.Price')}
    </label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-price-value"
        value={context.source.price.value}
        step="any"
        field="system.price.value"
        document={context.item}
        disabled={!context.unlocked}
        selectOnFocus={true}
        class="large-value"
      />
      <SelectQuadrone
        value={context.source.price.denomination}
        field="system.price.denomination"
        document={context.item}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.currencies}
          labelProp="abbreviation"
        />
      </SelectQuadrone>
    </div>
  </div>
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.CONTAINER.Details')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group stacked container-properties checkbox-grid">
    <label>{localize('DND5E.CONTAINER.FIELDS.properties.label')}</label>
    <div class="form-fields">
      <ItemProperties />
    </div>
  </div>

  {#if context.properties.object.mgc}
    <div class="form-group split-group">
      <label for="{appId}-attunement">
        {localize('DND5E.Attunement')}
      </label>
      <div class="form-fields">
        <label class="checkbox" for="{appId}-attuned">
          <CheckboxQuadrone
            id="{appId}-attuned"
            document={context.item}
            field="system.attuned"
            checked={context.source.attuned}
            disabledChecked={context.system.attuned}
            disabled={!context.unlocked ||
              !context.config.attunementTypes[context.system.attunement]}
            title={localize('DND5E.AttunementAttuned')}
          />
        </label>
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
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.CONTAINER.FIELDS.capacity.label')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <div class="form-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.count.label')}</label>
    <div class="form-fields">
      <NumberInputQuadrone
        document={context.item}
        field="system.capacity.count"
        value={context.source.capacity.count}
        step="1"
        min="0"
        placeholder="—"
        disabled={!context.unlocked}
      />
    </div>
  </div>

  <!-- Volume Capacity -->

  <div class="form-group split-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.volume.label')}</label>
    <div class="form-fields">
      <div class="form-group label-top">
        <label>{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <NumberInputQuadrone
            document={context.item}
            field="system.capacity.volume.value"
            value={context.source.capacity.volume.value}
            step="any"
            min="0"
            placeholder="—"
            disabled={!context.unlocked}
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <SelectQuadrone
            document={context.item}
            field="system.capacity.volume.units"
            value={context.source.capacity.volume.units}
            blankValue=""
            disabled={!context.unlocked}
          >
            <SelectOptions
              data={context.config.volumeUnits}
              labelProp="label"
            />
          </SelectQuadrone>
        </div>
      </div>
    </div>
  </div>

  <!-- Weight Capacity -->
  <div class="form-group split-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.weight.label')}</label>
    <div class="form-fields">
      <div class="form-group label-top">
        <label>{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <NumberInputQuadrone
            document={context.item}
            field="system.capacity.weight.value"
            value={context.source.capacity.weight.value}
            step="any"
            min="0"
            placeholder="—"
            disabled={!context.unlocked}
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <SelectQuadrone
            document={context.item}
            field="system.capacity.weight.units"
            value={context.source.capacity.weight.units}
            blankValue=""
            disabled={!context.unlocked}
          >
            <SelectOptions
              data={context.config.weightUnits}
              labelProp="label"
            />
          </SelectQuadrone>
        </div>
      </div>
    </div>
  </div>
</fieldset>
