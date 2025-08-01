<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import Select from 'src/components/inputs/Select.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  let appId = $derived(context.document.id);

  let source = $derived(context.source);

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={context.concealDetails}>
  <h3 class="form-header">
    {localize('DND5E.ItemFacilityDetails')}
  </h3>

  <!-- Type -->
  <div class="form-group">
    <label for="{appId}-system-type-value">
      {localize('DND5E.FACILITY.FIELDS.type.value.label')}
    </label>
    <div class="form-fields">
      <Select
        document={context.document}
        field="system.type.value"
        value={source.type.value}
        id="{appId}-system-type-value"
        blankValue={null}
      >
        <SelectOptions
          data={context.config.facilities.types}
          labelProp="label"
          valueProp="value"
        ></SelectOptions>
      </Select>
    </div>
  </div>

  <!-- Sub-Type -->
  <div class="form-group">
    <label for="{appId}-system-type-subtype">
      {localize('DND5E.FACILITY.FIELDS.type.subtype.label')}
    </label>
    <div class="form-fields">
      <Select
        document={context.document}
        field="system.type.subtype"
        value={source.type.subtype}
        id="{appId}-system-type-subtype"
      >
        <SelectOptions
          data={context.facilitySubtypes ?? {}}
          labelProp="label"
          valueProp="value"
          blank=""
        ></SelectOptions>
      </Select>
    </div>
  </div>

  <!-- Size -->
  <div class="form-group">
    <label for="{appId}-system-size">
      {localize('DND5E.FACILITY.FIELDS.size.label')}
    </label>
    <div class="form-fields">
      <Select
        document={context.document}
        field="system.size"
        value={source.size}
        id="{appId}-system-size"
      >
        <SelectOptions data={context.config.facilities.sizes} labelProp="label"
        ></SelectOptions>
      </Select>
    </div>
  </div>

  <!-- Level -->
  {#if source.type.value === CONSTANTS.FACILITY_TYPE_BASIC}
    <div class="form-group">
      <label for="{appId}-system-level">
        {localize('DND5E.FACILITY.FIELDS.level.label')}
      </label>
      <div class="form-fields">
        <NumberInput
          id="{appId}-system-level"
          document={context.document}
          field="system.level"
          value={source.level}
          selectOnFocus={true}
          min="1"
          step="1"
        ></NumberInput>
      </div>
    </div>
  {/if}

  {#if source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL}
    <!-- Properties -->
    <div class="form-group split-group">
      <label for="{appId}-system-level">
        {localize('DND5E.FACILITY.Properties')}
      </label>
      <div class="form-fields">
        <!-- Level -->
        <div class="form-group label-top">
          <label for="{appId}-system-level">
            {localize('DND5E.FACILITY.FIELDS.level.label')}
          </label>
          <div class="form-fields">
            <NumberInput
              id="{appId}-system-level"
              document={context.document}
              field="system.level"
              value={source.level}
              selectOnFocus={true}
              min="1"
              step="1"
            ></NumberInput>
          </div>
        </div>

        <!-- Order -->
        <div class="form-group label-top">
          <label for="{appId}-system-order">
            {localize('DND5E.FACILITY.FIELDS.order.label')}
          </label>
          <div class="form-fields">
            <Select
              document={context.document}
              field="system.order"
              value={source.order}
              id="{appId}-system-order"
            >
              <SelectOptions
                data={context.orders?.available ?? []}
                blank=""
                labelProp="label"
                valueProp="value"
              ></SelectOptions>
            </Select>
          </div>
        </div>
      </div>
    </div>

    <!-- Occupants -->
    <div class="form-group split-group">
      <label for="{appId}-system-hirelings-max">
        {localize('DND5E.FACILITY.Occupants')}
      </label>
      <div class="form-fields">
        <!-- Hirelings -->
        <div class="form-group label-top">
          <label for="{appId}-system-hirelings-max">
            {localize('DND5E.FACILITY.FIELDS.hirelings.max.label')}
          </label>
          <div class="form-fields">
            <NumberInput
              id="{appId}-system-hirelings-max"
              document={context.document}
              field="system.hirelings.max"
              value={source.hirelings.max}
              selectOnFocus={true}
              min="1"
              step="1"
              placeholder="—"
            ></NumberInput>
          </div>
        </div>

        <!-- Defenders -->
        <div class="form-group label-top">
          <label for="{appId}-system-defenders-max">
            {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
          </label>
          <div class="form-fields">
            <div class="form-fields">
              <NumberInput
                id="{appId}-system-defenders-max"
                document={context.document}
                field="system.defenders.max"
                value={source.defenders.max}
                selectOnFocus={true}
                min="1"
                step="1"
                placeholder="—"
              ></NumberInput>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Free Facility -->
    <div class="form-group">
      <label for="{appId}-system-free">
        {localize('DND5E.FACILITY.FIELDS.free.label')}
      </label>
      <div class="form-fields">
        <Checkbox
          id="{appId}-system-free"
          document={context.document}
          field="system.free"
          checked={source.free}
        ></Checkbox>
      </div>
      <p class="hint">
        {localize('DND5E.FACILITY.FIELDS.free.hint')}
      </p>
    </div>

    <!-- Enlargeable -->
    <div class="form-group">
      <label for="{appId}-system-enlargeable">
        {localize('DND5E.FACILITY.FIELDS.enlargeable.label')}
      </label>
      <div class="form-fields">
        <Checkbox
          id="{appId}-system-enlargeable"
          document={context.document}
          field="system.enlargeable"
          checked={source.enlargeable}
        ></Checkbox>
      </div>
      <p class="hint">
        {localize('DND5E.FACILITY.FIELDS.enlargeable.hint')}
      </p>
    </div>

    <!-- Disabled -->
    <div class="form-group">
      <label for="{appId}-system-disabled">
        {localize('DND5E.FACILITY.FIELDS.disabled.label')}
      </label>
      <div class="form-fields">
        <Checkbox
          id="{appId}-system-disabled"
          document={context.document}
          field="system.disabled"
          checked={source.disabled}
        ></Checkbox>
      </div>
      <p class="hint">
        {localize('DND5E.FACILITY.FIELDS.disabled.hint')}
      </p>
    </div>
  {:else}
    <!-- Built -->
    <div class="form-group">
      <label for="{appId}-system-building-built">
        {localize('DND5E.FACILITY.FIELDS.building.built.label')}
      </label>
      <div class="form-fields">
        <Checkbox
          id="{appId}-system-building-built"
          document={context.document}
          field="system.building.built"
          checked={source.building.built}
        ></Checkbox>
      </div>
      <p class="hint">
        {localize('DND5E.FACILITY.FIELDS.building.built.hint')}
      </p>
    </div>
  {/if}

  <h3 class="form-header">
    {localize('DND5E.FACILITY.Orders.Label')}
  </h3>

  <!-- Executing -->
  <div class="form-group">
    <label for="{appId}-system-progress-order">
      {localize('DND5E.FACILITY.FIELDS.progress.order.label')}
    </label>
    <div class="form-fields">
      <Select
        document={context.document}
        field="system.progress.order"
        value={source.progress.order}
        id="{appId}-system-progress-order"
      >
        <SelectOptions
          data={context.orders?.executable ?? []}
          blank=""
          labelProp="label"
          valueProp="value"
        ></SelectOptions>
      </Select>
    </div>
  </div>

  <!-- Progress -->
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
            <NumberInput
              id="{appId}-system-progress-value"
              document={context.document}
              field="system.progress.value"
              value={source.progress.value}
              selectOnFocus={true}
              min="0"
              step="0"
              placeholder="—"
            ></NumberInput>
          </div>
        </div>
      </div>

      <!-- Total -->
      <div class="form-group label-top">
        <label for="{appId}-system-progress-max">
          {localize('DND5E.FACILITY.FIELDS.progress.max.label')}
        </label>
        <div class="form-fields">
          <div class="form-fields">
            <NumberInput
              id="{appId}-system-progress-max"
              document={context.document}
              field="system.progress.max"
              value={source.progress.max}
              selectOnFocus={true}
              min="1"
              step="1"
              placeholder="—"
            ></NumberInput>
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if context.canCraft}
    <h3 class="form-header">
      {localize(`DND5E.FACILITY.Orders.${source.order}.present`)}
    </h3>

    <p class="hint">
      {localize('DND5E.FACILITY.Craft.Hint')}
    </p>

    <div class:harvesting={context.isHarvesting}>
      <ul class="separated-list single-item facility-craft">
        <li>
          {#if context.craft}
            <div class="details flexrow">
              <img src={context.craft.img} alt={context.craft.name} />
              {@html context.craft.contentLink}
              <div class="list-controls flexrow">
                <button
                  type="button"
                  class="icon-button"
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
            <document-tags
              name="system.craft.item"
              single
              onchange={async () => await context.sheet.submit()}
            ></document-tags>
          {/if}
        </li>
      </ul>
      {#if context.isHarvesting}
        <div class="quantity">
          <span class="separator">&times;</span>
          <NumberInput
            id="{appId}-system-craft-quantity"
            document={context.document}
            field="system.craft.quantity"
            value={source.craft.quantity}
            selectOnFocus={true}
          ></NumberInput>
        </div>
      {/if}
    </div>
  {/if}

  {#if source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL && source.order === 'trade'}
    <h3 class="form-header">
      {localize('DND5E.FACILITY.Orders.trade.present')}
    </h3>

    <!-- Stocked -->
    <div class="form-group">
      <label for="{appId}-system-trade-stock-stocked">
        {localize('DND5E.FACILITY.FIELDS.trade.stock.stocked.label')}
      </label>
      <div class="form-fields">
        <Checkbox
          id="{appId}-system-trade-stock-stocked"
          document={context.document}
          field="system.trade.stock.stocked"
          checked={source.trade.stock.stocked}
        ></Checkbox>
      </div>
    </div>

    <!-- Goods -->
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
            <div class="form-fields">
              <NumberInput
                id="{appId}-system-trade-stock-value"
                document={context.document}
                field="system.trade.stock.value"
                value={source.trade.stock.value}
                selectOnFocus={true}
                min="0"
                step="0"
                placeholder="—"
              ></NumberInput>
            </div>
          </div>
        </div>

        <!-- Max -->
        <div class="form-group label-top">
          <label for="{appId}-system-trade-stock-max">
            {localize('DND5E.FACILITY.FIELDS.trade.stock.max.label')}
          </label>
          <div class="form-fields">
            <div class="form-fields">
              <NumberInput
                id="{appId}-system-trade-stock-max"
                document={context.document}
                field="system.trade.stock.max"
                value={source.trade.stock.max}
                selectOnFocus={true}
                min="1"
                step="1"
                placeholder="—"
              ></NumberInput>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Creatures -->
    <div class="form-group">
      <label for="{appId}-system-trade-creatures-max">
        {localize('DND5E.FACILITY.FIELDS.trade.creatures.max.label')}
      </label>
      <div class="form-fields">
        <NumberInput
          id="{appId}-system-trade-creatures-max"
          document={context.document}
          field="system.trade.creatures.max"
          value={source.trade.creatures.max}
          selectOnFocus={true}
          min="1"
          step="1"
          placeholder="—"
        ></NumberInput>
      </div>
    </div>

    <!-- Profit Factor -->
    <div class="form-group">
      <label for="{appId}-system-trade-profit">
        {localize('DND5E.FACILITY.FIELDS.trade.profit.label')}
      </label>
      <div class="form-fields">
        <NumberInput
          id="{appId}-system-trade-profit"
          document={context.document}
          field="system.trade.profit"
          value={source.trade.profit}
          selectOnFocus={true}
          min="0"
          step="0"
          placeholder="—"
        ></NumberInput>
        <span class="sep unit">&percnt;</span>
      </div>
    </div>
  {/if}
</ContentConcealer>
