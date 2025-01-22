<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { getContainerSheetClassicContext } from 'src/sheets/sheet-context.svelte';
  import NumberInputSetting from 'src/applications/settings/parts/NumberInputSetting.svelte';

  let context = $derived(getContainerSheetClassicContext());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={context.concealDetails}>
  <h3 class="form-header">{localize('DND5E.CONTAINER.Details')}</h3>

  <div class="form-group stacked container-properties">
    <label for="">{localize('DND5E.CONTAINER.FIELDS.properties.label')}</label>
    <ItemProperties />
  </div>

  {#if context.properties.object.mgc}
    <div class="form-group">
      <label for="{appId}-attunement">{localize('DND5E.Attunement')}</label>
      <Checkbox
        id="{appId}-attuned"
        document={context.item}
        field="system.attuned"
        checked={context.source.attuned}
        disabled={!context.editable ||
          // @ts-expect-error
          !context.config.attunementTypes[context.system.attunement]}
        title={localize('DND5E.AttunementAttuned')}
      />
      <Select
        id="{appId}-attunement"
        document={context.item}
        field="system.attunement"
        value={context.source.attunement}
        disabled={!context.editable}
      >
        <SelectOptions
          data={context.config.attunementTypes}
          blank={localize('DND5E.AttunementNone')}
        />
      </Select>
    </div>
  {/if}

  <h3 class="form-header">
    {localize('DND5E.CONTAINER.FIELDS.capacity.label')}
  </h3>

  <div class="form-group">
    <div class="form-group">
      <label>{localize('DND5E.CONTAINER.FIELDS.capacity.count.label')}</label>
      <div class="form-fields">
        <NumberInput
          document={context.item}
          field="system.capacity.count"
          value={context.source.capacity.count}
          step="1"
          min="0"
          placeholder="—"
        />
      </div>
    </div>
  </div>

  <!-- Volume Capacity -->

  <div class="form-group split-group">
    <label>{localize('DND5E.CONTAINER.FIELDS.capacity.volume.label')}</label>
    <div class="form-fields">
      <div class="form-group label-top">
        <label>{localize('DND5E.Amount')}</label>
        <div class="form-fields">
          <NumberInput
            document={context.item}
            field="system.capacity.volume.value"
            value={context.source.capacity.volume.value}
            step="any"
            min="0"
            placeholder="—"
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <Select
            document={context.item}
            field="system.capacity.volume.units"
            value={context.source.capacity.volume.units}
            blankValue=""
          >
            <SelectOptions
              data={context.config.volumeUnits}
              labelProp="label"
            />
          </Select>
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
          <NumberInput
            document={context.item}
            field="system.capacity.weight.value"
            value={context.source.capacity.weight.value}
            step="any"
            min="0"
            placeholder="—"
          />
        </div>
      </div>

      <div class="form-group label-top">
        <label>{localize('DND5E.Unit')}</label>
        <div class="form-fields">
          <Select
            document={context.item}
            field="system.capacity.weight.units"
            value={context.source.capacity.weight.units}
            blankValue=""
          >
            <SelectOptions
              data={context.config.weightUnits}
              labelProp="label"
            />
          </Select>
        </div>
      </div>
    </div>
  </div>
</ContentConcealer>
