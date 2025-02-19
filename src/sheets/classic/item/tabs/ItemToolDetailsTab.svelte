<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import FieldUses from '../parts/FieldUses.svelte';
  import { getItemSheetContext } from 'src/sheets/sheet-context.svelte';

  let context = $derived(getItemSheetContext());

  const localize = FoundryAdapter.localize;

  let appId = $derived(context.document.id);
</script>

<ContentConcealer conceal={context.concealDetails}>
  <!-- Tool Type -->
  <div class="form-group">
    <label for="{appId}-type-value">{localize('DND5E.ItemToolType')}</label>
    <div class="form-fields">
      <Select
        id="{appId}-type-value"
        document={context.item}
        field="system.type.value"
        value={context.source.type.value}
        disabled={!context.editable}
      >
        <SelectOptions data={context.config.toolTypes} blank="" />
      </Select>
    </div>
  </div>

  <!-- Base Tool -->
  {#if Object.keys(context.baseItems).length}
    <div class="form-group">
      <label for="{appId}-type-baseItem">{localize('DND5E.ItemToolBase')}</label
      >
      <div class="form-fields">
        <Select
          id="{appId}-type-baseItem"
          document={context.item}
          field="system.type.baseItem"
          value={context.source.type.baseItem}
          disabled={!context.editable}
        >
          <SelectOptions data={context.baseItems} blank="" />
        </Select>
      </div>
    </div>
  {/if}

  <!-- Tool Properties -->
  <div class="form-group stacked tool-properties">
    <label for="">{localize('DND5E.ItemToolProperties')}</label>
    <ItemProperties />
  </div>

  <!-- Ability Check -->
  <div class="form-group">
    <label for="{appId}-proficient">{localize('DND5E.ActionAbil')}</label>
    <div class="form-fields">
      <!-- Proficiency -->
      <div class="form-group label-top">
        <label for="">{localize('DND5E.Proficiency')}</label>
        <div class="form-fields">
          <Select
            id="{appId}-proficient"
            document={context.item}
            field="system.proficient"
            value={context.source.proficient}
            disabled={!context.editable}
          >
            <SelectOptions
              data={context.config.proficiencyLevels}
              blank={localize('DND5E.Automatic')}
            />
          </Select>
        </div>
      </div>

      <!-- Ability -->
      <div class="form-group label-top">
        <label for="{appId}-ability">{localize('DND5E.Ability')}</label>
        <div class="form-fields">
          <Select
            id="{appId}-ability"
            document={context.item}
            field="system.ability"
            value={context.source.ability}
            disabled={!context.editable}
          >
            <SelectOptions
              data={context.config.abilities}
              labelProp="label"
              blank={localize('DND5E.Default')}
            />
          </Select>
        </div>
      </div>
    </div>
  </div>

  <!-- Tool Bonus -->
  <div class="form-group">
    <label for="{appId}-bonus">{localize('DND5E.ItemToolBonus')}</label>
    <div class="form-fields">
      <TextInput
        id={`${appId}-system-bonus`}
        document={context.item}
        field="system.bonus"
        value={context.source.bonus}
        disabled={!context.editable}
      />
    </div>
  </div>

  <!-- Attunement -->
  {#if context.properties.object.mgc}
    <div class="form-group">
      <label for="{appId}-attunement">{localize('DND5E.Attunement')}</label>
      <div class="form-fields no-gap">
        {#if context.source.attunement}
          <!-- Attuned -->
          <Checkbox
            id={`${appId}-system-attuned`}
            document={context.item}
            field="system.attuned"
            checked={context.source.attuned}
            disabled={!context.editable ||
              // @ts-expect-error
              !context.config.attunementTypes[context.source.attunement]}
            title={localize('DND5E.Attuned')}
          />
        {/if}

        <!-- Attunement -->
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
    </div>
  {/if}

  <FieldUses />
</ContentConcealer>
