<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {localize('DND5E.ItemFacilityDetails')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Type -->
  <FormGroup
    labelFor="{appId}-type-value"
    document={context.document}
    field={context.fields.type.fields.value}
    config={{
      id: `${appId}-type-value`,
      value: context.source.type.value,
      disabled: !context.unlocked,
      blank: false,
    }}
    choices={context.config.facilities.types}
  />

  <!-- Sub-Type -->
  <FormGroup
    labelFor="{appId}-type-subtype"
    document={context.document}
    field={context.fields.type.fields.subtype}
    config={{
      id: `${appId}-type-subtype`,
      value: context.source.type.subtype,
      disabled: !context.unlocked,
    }}
    choices={context.facilitySubtypes}
  />

  <!-- Size -->
  <FormGroup
    labelFor="{appId}-size"
    document={context.document}
    field={context.fields.size}
    config={{
      id: `${appId}-size`,
      value: context.source.size,
      disabled: !context.unlocked,
    }}
    choices={context.config.facilities.sizes}
  />

  <!-- Level -->
  {#if context.source.type.value === CONSTANTS.FACILITY_TYPE_BASIC}
    <FormGroup
      labelFor="{appId}-level"
      document={context.document}
      field={context.fields.level}
      config={{
        id: `${appId}-level`,
        value: context.source.level,
        disabled: !context.unlocked,
        min: 1,
        step: 1,
      }}
    />
  {/if}

  {#if context.source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL}
    <!-- Properties -->
    <FormGroup label="DND5E.FACILITY.Properties" groupClasses="split-group">
      <!-- Level -->
      <FormGroup
        label="DND5E.Level"
        labelFor="{appId}-level"
        document={context.document}
        field={context.fields.level}
        config={{
          id: `${appId}-level`,
          value: context.source.level,
          disabled: !context.unlocked,
        }}
        groupClasses="label-top"
      />
      <!-- Order -->
      <FormGroup
        labelFor="{appId}-order"
        document={context.document}
        field={context.fields.order}
        config={{
          id: `${appId}-order`,
          value: context.source.order,
          disabled: !context.unlocked,
        }}
        choices={context.orders?.available ?? []}
        groupClasses="label-top"
      />
    </FormGroup>

    <!-- Occupants -->
    <FormGroup label="DND5E.FACILITY.Occupants" groupClasses="split-group">
      <!-- Hirelings -->
      <FormGroup
        labelFor="{appId}-hirelings-max"
        document={context.document}
        field={context.fields.hirelings.fields.max}
        config={{
          id: `${appId}-hirelings-max`,
          value: context.source.hirelings.max,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
        groupClasses="label-top"
      />
      <!-- Defenders -->
      <FormGroup
        labelFor="{appId}-defenders-max"
        document={context.document}
        field={context.fields.defenders.fields.max}
        config={{
          id: `${appId}-defenders-max`,
          value: context.source.defenders.max,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
        groupClasses="label-top"
      />
    </FormGroup>

    <!-- Free Facility -->
    <FormGroup
      labelFor="{appId}-system-free"
      document={context.document}
      field={context.fields.free}
      config={{
        id: `${appId}-system-free`,
        value: context.source.free,
        disabled: !context.unlocked,
      }}
    />

    <!-- Enlargeable -->
    <FormGroup
      labelFor="{appId}-enlargeable"
      document={context.document}
      field={context.fields.enlargeable}
      config={{
        id: `${appId}-enlargeable`,
        value: context.source.enlargeable,
        disabled: !context.unlocked,
      }}
    />

    <!-- Disabled -->
    <FormGroup
      labelFor="{appId}-disabled"
      document={context.document}
      field={context.fields.disabled}
      config={{
        id: `${appId}-disabled`,
        value: context.source.disabled,
        disabled: !context.unlocked,
      }}
    />
  {:else}
    <!-- Built -->
    <FormGroup
      labelFor="{appId}-building-built"
      document={context.document}
      field={context.fields.building.fields.built}
      config={{
        id: `${appId}-building-built`,
        value: context.source.building.built,
        disabled: !context.unlocked,
      }}
    />

    <div class="form-group">
      <label for="{appId}-system-building-built">
        {localize('DND5E.FACILITY.FIELDS.building.built.label')}
      </label>
      <div class="form-fields">
        <CheckboxQuadrone
          id="{appId}-system-building-built"
          document={context.document}
          field="system.building.built"
          checked={context.source.building.built}
          disabledChecked={context.system.building.built}
          disabled={!context.unlocked}
        />
      </div>
      <p class="hint">
        {localize('DND5E.FACILITY.FIELDS.building.built.hint')}
      </p>
    </div>
  {/if}
</fieldset>

<fieldset>
  <legend>
    {localize('DND5E.FACILITY.Orders.Label')}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Executing -->
  <FormGroup
    labelFor="{appId}-progress-order"
    document={context.document}
    field={context.fields.progress.fields.order}
    config={{
      id: `${appId}-progress-order`,
      value: context.source.progress.order,
      disabled: !context.unlocked,
    }}
    choices={context.orders?.executable ?? []}
  />

  <div class="form-group">
    <label for="{appId}-system-progress-order">
      {localize('DND5E.FACILITY.FIELDS.progress.order.label')}
    </label>
    <div class="form-fields">
      <SelectQuadrone
        document={context.document}
        field="system.progress.order"
        value={context.source.progress.order}
        disabled={!context.unlocked}
        id="{appId}-system-progress-order"
      >
        <SelectOptions
          data={context.orders?.executable ?? []}
          blank=""
          labelProp="label"
          valueProp="value"
        ></SelectOptions>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Progress -->
  <FormGroup label="DND5E.FACILITY.Progress" groupClasses="split-group">
    <!-- Current -->
    <FormGroup
      labelFor="{appId}-progress-value"
      document={context.document}
      field={context.fields.progress.fields.value}
      config={{
        id: `${appId}-progress-value`,
        value: context.source.progress.value,
        disabled: !context.unlocked,
      }}
      groupClasses="label-top"
    />
    <!-- Total -->
    <FormGroup
      labelFor="{appId}-progress-max"
      document={context.document}
      field={context.fields.progress.fields.max}
      config={{
        id: `${appId}-progress-max`,
        value: context.source.progress.max,
        disabled: !context.unlocked,
        placeholder: '—',
      }}
      groupClasses="label-top"
    />
  </FormGroup>

  <div class="form-group split-group">
    <label for="{appId}-system-progress-value">
      {localize('DND5E.FACILITY.Progress')}
    </label>
    <div class="form-fields">
      <!-- Current -->
      <div class="form-group label-top">
        <label for="{appId}-system-progress-value">
          {localize('DND5E.FACILITY.FIELDS.progress.value.label')}
        </label>
        <div class="form-fields">
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-system-progress-value"
              document={context.document}
              field="system.progress.value"
              value={context.source.progress.value}
              selectOnFocus={true}
              min="0"
              step="0"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="form-group label-top">
        <label for="{appId}-system-progress-max">
          {localize('DND5E.FACILITY.FIELDS.progress.max.label')}
        </label>
        <div class="form-fields">
          <NumberInputQuadrone
            id="{appId}-system-progress-max"
            document={context.document}
            field="system.progress.max"
            value={context.source.progress.max}
            selectOnFocus={true}
            min="1"
            step="1"
            placeholder="—"
            disabled={!context.unlocked}
          />
        </div>
      </div>
    </div>
  </div>
</fieldset>

{#if context.canCraft}
  <fieldset>
    <legend>
      {localize(`DND5E.FACILITY.Orders.${context.source.order}.present`)}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="hint">
      {localize('DND5E.FACILITY.Craft.Hint')}
    </p>

    <div class:harvesting={context.isHarvesting}>
      <ul class="unlist single-item facility-craft">
        <li>
          {#if context.craft}
            <div class="details flexrow">
              <img src={context.craft.img} alt={context.craft.name} />
              {@html context.craft.contentLink}
              <div class="list-controls flexrow">
                <button
                  type="button"
                  class="button button-borderless button-icon-only"
                  onclick={() =>
                    context.sheet.submit({
                      updateData: { 'system.craft': null },
                    })}
                  data-tooltip={localize('DND5E.FACILITY.Action.RemoveCraft')}
                  aria-label={localize('DND5E.FACILITY.Action.RemoveCraft')}
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          {:else}
            <TidyFormInput
              document={context.document}
              field={context.system.schema.fields.craft.fields.item}
              config={{
                id: `${appId}-craft-item`,
                disabled: !context.unlocked,
                value: context.source.craft.item,
              }}
            />
          {/if}
        </li>
      </ul>
      {#if context.isHarvesting}
        <div class="quantity">
          <span class="separator">&times;</span>
          <TidyFormInput
            document={context.document}
            field={context.fields.craft.fields.quantity}
            config={{
              id: `${appId}-craft-quantity`,
              value: context.source.craft.quantity,
              disabled: !context.unlocked,
            }}
          />
          <NumberInputQuadrone
            id="{appId}-system-craft-quantity"
            document={context.document}
            field="system.craft.quantity"
            value={context.source.craft.quantity}
            selectOnFocus={true}
            disabled={!context.unlocked}
          />
        </div>
      {/if}
    </div>
  </fieldset>
{/if}

{#if context.source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && context.source.order === 'trade'}
  <fieldset>
    <legend>
      {localize('DND5E.FACILITY.Orders.trade.present')}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <!-- Stocked -->
    <FormGroup
      document={context.document}
      labelFor="{appId}-system-trade-stock-stocked"
      field={context.fields.trade.fields.stock.fields.stocked}
      config={{
        id: `${appId}-system-trade-stock-stocked`,
        value: context.source.trade.stock.stocked,
        disabled: !context.unlocked,
      }}
    />

    <div class="form-group">
      <label for="{appId}-system-trade-stock-stocked">
        {localize('DND5E.FACILITY.FIELDS.trade.stock.stocked.label')}
      </label>
      <div class="form-fields">
        <CheckboxQuadrone
          id="{appId}-system-trade-stock-stocked"
          document={context.document}
          field="system.trade.stock.stocked"
          checked={context.source.trade.stock.stocked}
          disabledChecked={context.system.trade.stock.stocked}
          disabled={!context.unlocked}
        />
      </div>
    </div>

    <!-- Goods -->
    <FormGroup label="DND5E.FACILITY.Goods" groupClasses="split-group">
      <!-- Value -->
      <FormGroup
        document={context.document}
        labelFor="{appId}-system-trade-stock-value"
        field={context.fields.trade.fields.stock.fields.value}
        config={{
          id: `${appId}-system-trade-stock-value`,
          value: context.source.trade.stock.value,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
      />

      <!-- Max -->
      <FormGroup
        document={context.document}
        labelFor="{appId}-system-trade-stock-max"
        field={context.fields.trade.fields.stock.fields.max}
        config={{
          id: `${appId}-system-trade-stock-max`,
          value: context.source.trade.stock.max,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
      />
    </FormGroup>

    <div class="form-group split-group">
      <label for="{appId}-">
        {localize('DND5E.FACILITY.Goods')}
      </label>
      <div class="form-fields">
        <!-- Value -->
        <div class="form-group label-top">
          <label for="{appId}-system-trade-stock-value">
            {localize('DND5E.FACILITY.FIELDS.trade.stock.value.label')}
          </label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-system-trade-stock-value"
              document={context.document}
              field="system.trade.stock.value"
              value={context.source.trade.stock.value}
              selectOnFocus={true}
              min="0"
              step="0"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Max -->
        <div class="form-group label-top">
          <label for="{appId}-system-trade-stock-max">
            {localize('DND5E.FACILITY.FIELDS.trade.stock.max.label')}
          </label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-system-trade-stock-max"
              document={context.document}
              field="system.trade.stock.max"
              value={context.source.trade.stock.max}
              selectOnFocus={true}
              min="1"
              step="1"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Creatures -->
    <FormGroup
      labelFor="{appId}-trade-creatures-max"
      document={context.document}
      field={context.fields.trade.fields.creatures.fields.max}
      config={{
        id: `${appId}-trade-creatures-max`,
        value: context.source.trade.creatures.max,
        disabled: !context.unlocked,
        placeholder: '—',
      }}
    />
    <div class="form-group">
      <label for="{appId}-system-trade-creatures-max">
        {localize('DND5E.FACILITY.FIELDS.trade.creatures.max.label')}
      </label>
      <div class="form-fields">
        <NumberInputQuadrone
          id="{appId}-system-trade-creatures-max"
          document={context.document}
          field="system.trade.creatures.max"
          value={context.source.trade.creatures.max}
          selectOnFocus={true}
          min="1"
          step="1"
          placeholder="—"
          disabled={!context.unlocked}
        />
      </div>
    </div>

    <!-- Profit Factor -->
    <FormGroup
      label="DND5E.FACILITY.FIELDS.trade.profit.label"
      labelFor="{appId}-system-trade-profit"
    >
      <TidyFormInput
        document={context.document}
        field={context.fields.trade.fields.profit}
        config={{
          id: `${appId}-system-trade-profit`,
          value: context.source.trade.profit,
          disabled: !context.unlocked,
          placeholder: '—',
        }}
      />
      <span class="sep unit">&percnt;</span>
    </FormGroup>

    <div class="form-group">
      <label for="{appId}-system-trade-profit">
        {localize('DND5E.FACILITY.FIELDS.trade.profit.label')}
      </label>
      <div class="form-fields">
        <NumberInputQuadrone
          id="{appId}-system-trade-profit"
          document={context.document}
          field="system.trade.profit"
          value={context.source.trade.profit}
          selectOnFocus={true}
          min="0"
          step="0"
          placeholder="—"
          disabled={!context.unlocked}
        />
        <span class="sep unit">&percnt;</span>
      </div>
    </div>
  </fieldset>
{/if}
