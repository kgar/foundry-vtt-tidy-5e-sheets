<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import FormGroup from 'src/components/form-group/FormGroup.svelte';
  import TidyFormInput from 'src/components/form-group/TidyFormInput.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset disabled={!context.unlocked}>
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
      }}
    />
  {/if}
</fieldset>

<fieldset disabled={!context.unlocked}>
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
    }}
    choices={context.orders?.executable ?? []}
  />

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
        placeholder: '—',
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
        placeholder: '—',
      }}
      groupClasses="label-top"
    />
  </FormGroup>
</fieldset>

{#if context.canCraft}
  <fieldset disabled={!context.unlocked}>
    <legend>
      {localize(`DND5E.FACILITY.Orders.${context.source.order}.present`)}
      <tidy-gold-header-underline></tidy-gold-header-underline>
    </legend>

    <p class="hint">
      {localize('DND5E.FACILITY.Craft.Hint')}
    </p>

    <div class={{ harvesting: context.isHarvesting }}>
      <ul class="unlist single-item facility-craft">
        <li>
          {#if context.craft}
            <div class="details flexrow">
              <img src={context.craft.img} alt={context.craft.name} />
              {@html context.craft.contentLink}
              <div class="list-controls flexrow">
                <button
                  type="button"
                  class="button button-borderless button-icon-only flexshrink"
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
                value: context.source.craft.item,
              }}
            />
          {/if}
        </li>
      </ul>
      {#if context.isHarvesting}
        <div class="quantity flexrow">
          <span class="separator">&times;</span>
          <TidyFormInput
            document={context.document}
            field={context.fields.craft.fields.quantity}
            config={{
              id: `${appId}-craft-quantity`,
              value: context.source.craft.quantity,
              classes: 'flexshrink',
            }}
          />
        </div>
      {/if}
    </div>
  </fieldset>
{/if}

{#if context.source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && context.source.order === 'trade'}
  <fieldset disabled={!context.unlocked}>
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
      }}
    />

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
          placeholder: '—',
        }}
        groupClasses="label-top"
      />

      <!-- Max -->
      <FormGroup
        document={context.document}
        labelFor="{appId}-system-trade-stock-max"
        field={context.fields.trade.fields.stock.fields.max}
        config={{
          id: `${appId}-system-trade-stock-max`,
          value: context.source.trade.stock.max,
          placeholder: '—',
        }}
        groupClasses="label-top"
      />
    </FormGroup>

    <!-- Creatures -->
    <FormGroup
      labelFor="{appId}-trade-creatures-max"
      document={context.document}
      field={context.fields.trade.fields.creatures.fields.max}
      config={{
        id: `${appId}-trade-creatures-max`,
        value: context.source.trade.creatures.max,
        placeholder: '—',
      }}
    />

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
          placeholder: '—',
        }}
      />
      <span class="sep unit">&percnt;</span>
    </FormGroup>
  </fieldset>
{/if}
