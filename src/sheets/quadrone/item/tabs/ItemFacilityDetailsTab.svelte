<script lang="ts">
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import CheckboxQuadrone from 'src/components/inputs/CheckboxQuadrone.svelte';

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
  <div class="form-group">
    <label for="{appId}-system-type-value">
      {localize('DND5E.FACILITY.FIELDS.type.value.label')}
    </label>
    <div class="form-fields">
      <SelectQuadrone
        document={context.document}
        field="system.type.value"
        value={context.source.type.value}
        id="{appId}-system-type-value"
        blankValue={null}
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.config.facilities.types}
          labelProp="label"
          valueProp="value"
        ></SelectOptions>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Sub-Type -->
  <div class="form-group">
    <label for="{appId}-system-type-subtype">
      {localize('DND5E.FACILITY.FIELDS.type.subtype.label')}
    </label>
    <div class="form-fields">
      <SelectQuadrone
        document={context.document}
        field="system.type.subtype"
        value={context.source.type.subtype}
        id="{appId}-system-type-subtype"
        disabled={!context.unlocked}
      >
        <SelectOptions
          data={context.facilitySubtypes ?? {}}
          labelProp="label"
          valueProp="value"
          blank=""
        ></SelectOptions>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Size -->
  <div class="form-group">
    <label for="{appId}-system-size">
      {localize('DND5E.FACILITY.FIELDS.size.label')}
    </label>
    <div class="form-fields">
      <SelectQuadrone
        document={context.document}
        field="system.size"
        value={context.source.size}
        id="{appId}-system-size"
        disabled={!context.unlocked}
      >
        <SelectOptions data={context.config.facilities.sizes} labelProp="label"
        ></SelectOptions>
      </SelectQuadrone>
    </div>
  </div>

  <!-- Level -->
  {#if context.source.type.value === CONSTANTS.FACILITY_TYPE_BASIC}
    <div class="form-group">
      <label for="{appId}-system-level">
        {localize('DND5E.FACILITY.FIELDS.level.label')}
      </label>
      <div class="form-fields">
        <NumberInputQuadrone
          id="{appId}-system-level"
          document={context.document}
          field="system.level"
          value={context.source.level}
          selectOnFocus={true}
          min="1"
          step="1"
          disabled={!context.unlocked}
        />
      </div>
    </div>
  {/if}

  {#if context.source.type.value === CONSTANTS.FACILITY_TYPE_SPECIAL}
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
            <NumberInputQuadrone
              id="{appId}-system-level"
              document={context.document}
              field="system.level"
              value={context.source.level}
              selectOnFocus={true}
              min="1"
              step="1"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Order -->
        <div class="form-group label-top">
          <label for="{appId}-system-order">
            {localize('DND5E.FACILITY.FIELDS.order.label')}
          </label>
          <div class="form-fields">
            <SelectQuadrone
              document={context.document}
              field="system.order"
              value={context.source.order}
              id="{appId}-system-order"
              disabled={!context.unlocked}
            >
              <SelectOptions
                data={context.orders?.available ?? []}
                blank=""
                labelProp="label"
                valueProp="value"
              ></SelectOptions>
            </SelectQuadrone>
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
            <NumberInputQuadrone
              id="{appId}-system-hirelings-max"
              document={context.document}
              field="system.hirelings.max"
              value={context.source.hirelings.max}
              selectOnFocus={true}
              min="1"
              step="1"
              placeholder="—"
              disabled={!context.unlocked}
            />
          </div>
        </div>

        <!-- Defenders -->
        <div class="form-group label-top">
          <label for="{appId}-system-defenders-max">
            {localize('DND5E.FACILITY.FIELDS.defenders.max.label')}
          </label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-system-defenders-max"
              document={context.document}
              field="system.defenders.max"
              value={context.source.defenders.max}
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

    <!-- Free Facility -->
    <div class="form-group">
      <label for="{appId}-system-free">
        {localize('DND5E.FACILITY.FIELDS.free.label')}
      </label>
      <div class="form-fields">
        <CheckboxQuadrone
          id="{appId}-system-free"
          document={context.document}
          field="system.free"
          checked={context.source.free}
          disabledChecked={context.system.free}
          disabled={!context.unlocked}
        />
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
        <CheckboxQuadrone
          id="{appId}-system-enlargeable"
          document={context.document}
          field="system.enlargeable"
          checked={context.source.enlargeable}
          disabledChecked={context.system.enlargeable}
          disabled={!context.unlocked}
        />
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
        <CheckboxQuadrone
          id="{appId}-system-disabled"
          document={context.document}
          field="system.disabled"
          checked={context.source.disabled}
          disabledChecked={context.system.disabled}
          disabled={!context.unlocked}
        />
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
                    context.item.sheet.submit({
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
              onchange={async () => await context.item.sheet.submit()}
              disabled={!context.unlocked}
            ></document-tags>
          {/if}
        </li>
      </ul>
      {#if context.isHarvesting}
        <div class="quantity">
          <span class="separator">&times;</span>
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
