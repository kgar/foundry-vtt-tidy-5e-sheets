<script lang="ts">
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import ItemProperties from '../parts/ItemProperties.svelte';
  import ContentConcealer from 'src/components/content-concealment/ContentConcealer.svelte';
  import Checkbox from 'src/components/inputs/Checkbox.svelte';
  import { CONSTANTS } from 'src/constants';
  import FieldUses from '../parts/FieldUses.svelte';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  $: appId = $context.item.sheet.appId;
</script>

<ContentConcealer conceal={$context.concealDetails}>
  <!-- Tool Type -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemToolType')}
    field="system.type.value"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.value"
      value={$context.source.type.value}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.config.toolTypes} blank="" />
    </Select>
  </ItemFormGroup>

  <!-- Base Tool -->
  <ItemFormGroup
    labelText={localize('DND5E.ItemToolBase')}
    field="system.type.baseItem"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.type.baseItem"
      value={$context.source.type.baseItem}
      disabled={!$context.editable}
    >
      <SelectOptions data={$context.baseItems} blank="" />
    </Select>
  </ItemFormGroup>

  <!-- Tool Properties -->
  <ItemFormGroup
    cssClass="stacked tool-properties"
    labelText={localize('DND5E.ItemToolProperties')}
  >
    <ItemProperties />
  </ItemFormGroup>

  <!-- Ability Check -->
  <div class="form-group">
    <label for="{appId}-system-proficient">{localize('DND5E.ActionAbil')}</label
    >
    <div class="form-fields">
      <!-- Proficiency -->
      <div class="form-group label-top">
        <label for="">{localize('DND5E.Proficiency')}</label>
        <Select
          id="{appId}-system-proficient"
          document={$context.item}
          field="system.proficient"
          value={$context.source.proficient}
        >
          <SelectOptions
            data={$context.config.proficiencyLevels}
            blank={localize('DND5E.Automatic')}
          />
        </Select>
      </div>

      <!-- Ability -->
      <div class="form-group label-top">
        <label for="{appId}-system-ability">{localize('DND5E.Ability')}</label>
        <Select
          id="{appId}-system-ability"
          document={$context.item}
          field="system.ability"
          value={$context.source.ability}
        >
          <SelectOptions
            data={$context.config.abilities}
            labelProp="label"
            blank={localize('DND5E.Default')}
          />
        </Select>
      </div>
    </div>
  </div>

  <!-- Tool Bonus -->
  <div class="form-group">
    <label for="{appId}-system-bonus">{localize('DND5E.ItemToolBonus')}</label>
    <TextInput
      id={`${appId}-system-bonus`}
      document={$context.item}
      field="system.bonus"
      value={$context.source.bonus}
    />
  </div>

  <!-- Attunement -->
  {#if $context.properties.object.mgc}
    <ItemFormGroup
      labelText={localize('DND5E.Attunement')}
      field="system.attunement"
      let:inputId
    >
      <div class="form-fields no-gap">
        <!-- Attuned -->
        <Checkbox
          id={`${appId}-system-attuned`}
          document={$context.item}
          field="system.attuned"
          checked={$context.source.attuned}
          disabled={!$context.editable ||
            // @ts-expect-error
            !$context.config.attunementTypes[$context.source.attunement]}
          title={localize('DND5E.Attuned')}
        />

        <!-- Attunement -->
        <Select
          id={inputId}
          document={$context.item}
          field="system.attunement"
          value={$context.source.attunement}
          disabled={!$context.editable}
        >
          <SelectOptions
            data={$context.config.attunementTypes}
            blank={localize('DND5E.AttunementNone')}
          />
        </Select>
      </div>
    </ItemFormGroup>
  {/if}

  <FieldUses />
</ContentConcealer>
