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
  import ItemActivation from '../parts/ItemActivation.svelte';
  import { CONSTANTS } from 'src/constants';

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;
</script>

<ContentConcealer conceal={$context.concealDetails}>
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

  <ItemFormGroup
    cssClass="stacked tool-properties"
    labelText={localize('DND5E.ItemToolProperties')}
  >
    <ItemProperties />
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize('DND5E.Attunement')}
    field="system.attunement"
    let:inputId
  >
    <Checkbox
      id={`${$context.appId}-system-attuned`}
      document={$context.item}
      field="system.attuned"
      checked={$context.source.attuned}
      disabled={!$context.editable ||
        // @ts-expect-error
        !$context.config.attunementTypes[$context.system.attunement]}
      title={localize('DND5E.AttunementAttuned')}
    ></Checkbox>
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
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize('DND5E.ItemToolProficiency')}
    field="system.proficient"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.proficient"
      value={$context.source.proficient}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.proficiencyLevels}
        blank={localize('DND5E.Automatic')}
      />
    </Select>
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize('DND5E.DefaultAbilityCheck')}
    field="system.ability"
    let:inputId
  >
    <Select
      id={inputId}
      document={$context.item}
      field="system.ability"
      value={$context.source.ability}
      disabled={!$context.editable}
    >
      <SelectOptions
        data={$context.config.abilities}
        labelProp="label"
        blank={localize('DND5E.Default')}
      />
    </Select>
  </ItemFormGroup>

  <ItemFormGroup
    labelText={localize('DND5E.ItemToolBonus')}
    field="system.bonus"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.bonus"
      value={$context.source.bonus}
      dataset={{ formulaEditor: true }}
      disabled={!$context.editable}
    />
  </ItemFormGroup>

  <h3 class="form-header">{localize('DND5E.ItemToolUsage')}</h3>
  <ItemActivation />

  <ItemFormGroup
    cssClass="stacked"
    labelText={localize('DND5E.ChatFlavor')}
    field="system.chatFlavor"
    let:inputId
  >
    <TextInput
      id={inputId}
      document={$context.item}
      field="system.chatFlavor"
      value={$context.source.chatFlavor}
      disabled={!$context.editable}
    />
  </ItemFormGroup>
</ContentConcealer>
