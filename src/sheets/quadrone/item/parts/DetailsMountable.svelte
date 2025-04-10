<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { CONSTANTS } from 'src/constants';
  import { getItemSheetContextQuadrone } from 'src/sheets/sheet-context.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import NumberInputQuadrone from 'src/components/inputs/NumberInputQuadrone.svelte';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';

  let context = $derived(getItemSheetContextQuadrone());

  let appId = $derived(context.document.id);

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>
    {#if context.item.type === CONSTANTS.ITEM_TYPE_WEAPON}
      {localize('DND5E.ItemSiegeProperties')}
    {:else if context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
      {localize('DND5E.ItemVehicleProperties')}
    {/if}
    <tidy-gold-header-underline></tidy-gold-header-underline>
  </legend>

  <!-- Armor Class -->
  <div class="form-group">
    <label for="{appId}-armor-value">{localize('DND5E.ArmorClass')}</label>
    <div class="form-fields">
      <NumberInputQuadrone
        id="{appId}-armor-value"
        document={context.item}
        field="system.armor.value"
        value={context.source.armor.value}
        disabled={!context.unlocked}
        step="1"
      />
    </div>
  </div>

  <!-- Cover -->
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

  <!-- Hit Points -->
  <div class="form-group split-group">
    <label for="{appId}-hp-value">{localize('DND5E.HitPoints')}</label>
    <div class="form-fields">
      <!-- Current -->
      <div class="form-group label-top">
        <label for="{appId}-hp-value">{localize('DND5E.Current')}</label>
        <NumberInputQuadrone
          id="{appId}-hp-value"
          document={context.item}
          field="system.hp.value"
          value={context.source.hp?.value}
          disabled={!context.unlocked}
          placeholder="0"
          min="0"
        />
      </div>

      <!-- Max -->
      <div class="form-group label-top">
        <label for="{appId}-hp-max">{localize('DND5E.Max')}</label>
        <div class="form-fields">
          <NumberInputQuadrone
            id="{appId}-hp-max"
            document={context.item}
            field="system.hp.max"
            value={context.source.hp?.max}
            disabled={!context.unlocked}
            placeholder="0"
            min="0"
          />
        </div>
      </div>

      <!-- Threshold -->
      <div class="form-group label-top">
        <label for="{appId}-hp-dt">{localize('DND5E.Threshold')}</label>
        <div class="form-fields">
          <NumberInputQuadrone
            id="{appId}-hp-dt"
            document={context.item}
            field="system.hp.dt"
            value={context.source.hp?.dt}
            disabled={!context.unlocked}
            placeholder="—"
            min="0"
          />
        </div>
      </div>
    </div>
    <!-- Conditions -->
    <TextInputQuadrone
      id="{appId}-hp-conditions"
      document={context.item}
      field="system.hp.conditions"
      value={context.source.hp?.conditions}
      placeholder={localize(
        'DND5E.VEHICLE.MOUNTABLE.FIELDS.hp.conditions.label',
      )}
      class="full-width"
      disabled={!context.unlocked}
    />
  </div>

  <!-- Speed -->
  {#if context.item.type === CONSTANTS.ITEM_TYPE_EQUIPMENT}
    <div class="form-group split-group">
      <label for="{appId}-speed-value">{localize('DND5E.Speed')}</label>
      <div class="form-fields">
        <!-- Value -->
        <div class="form-group label-top">
          <label for="{appId}-speed-value">
            {localize('DND5E.Value')}
          </label>
          <div class="form-fields">
            <NumberInputQuadrone
              id="{appId}-speed-value"
              document={context.item}
              field="system.speed.value"
              value={context.source.speed.value}
              min="0"
              placeholder="0"
              disabled={!context.unlocked}
            />
          </div>
        </div>
      </div>
      <!-- Conditions -->
      <TextInputQuadrone
        id="{appId}-speed-conditions"
        document={context.item}
        field="system.speed.conditions"
        value={context.source.speed.conditions}
        placeholder={localize(
          'DND5E.VEHICLE.MOUNTABLE.FIELDS.speed.conditions.label',
        )}
        class="full-width"
        disabled={!context.unlocked}
      />
    </div>
  {/if}
</fieldset>
