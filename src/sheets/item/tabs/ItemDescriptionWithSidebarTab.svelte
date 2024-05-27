<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import ItemDescriptions from '../parts/ItemDescriptions.svelte';
  import RerenderAfterFormSubmission from 'src/components/utility/RerenderAfterFormSubmission.svelte';
  import OpenSheetEditor from 'src/components/editor/OpenSheetEditor.svelte';
  import SheetEditor from 'src/components/editor/SheetEditor.svelte';
  import { CONSTANTS } from 'src/constants';
  import ItemFormGroup from '../form/ItemFormGroup.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';

  let context =
    getContext<Readable<ItemSheetContext | ContainerSheetContext>>('context');

  function onEditorActivation(node: HTMLElement) {
    if (editorIsActive) {
      editing = false;
      editorIsActive = false;
      return;
    }

    $context.activateEditors(node, { bindSecrets: false });
    editorIsActive = true;
  }

  let editing = false;
  let editorIsActive = false;
  let valueToEdit: string;
  let fieldToEdit: string;

  function edit(value: string, field: string) {
    valueToEdit = value;
    fieldToEdit = field;
    editing = true;
  }

  const localize = FoundryAdapter.localize;
</script>

<div
  class="item-description flexrow align-items-stretch small-gap"
  class:hidden={editing}
>
  <div
    class="item-properties"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.ITEM_SHEET_PROPERTIES}
  >
    {#if $context.isPhysical}
      {#if $context.item.type !== CONSTANTS.ITEM_TYPE_CONTAINER}
        <div class="form-group">
          <label for="{$context.appId}-{$context.item.id}-quantity"
            >{localize('DND5E.Quantity')}</label
          >
          <NumberInput
            id="{$context.appId}-{$context.item.id}-quantity"
            value={$context.system.quantity}
            field="system.quantity"
            document={$context.item}
            step="1"
            disabled={!$context.editable || $context.lockItemQuantity}
            selectOnFocus={true}
          />
        </div>

        <HorizontalLineSeparator />
      {/if}

      <div class="form-group">
        <label for="{$context.appId}-{$context.item.id}-weight-value"
          >{localize('DND5E.Weight')}</label
        >
        <NumberInput
          id="{$context.appId}-{$context.item.id}-weight-value"
          value={$context.system.weight.value}
          step="any"
          field="system.weight.value"
          document={$context.item}
          disabled={!$context.editable}
          selectOnFocus={true}
        />
      </div>

      <HorizontalLineSeparator />

      <div class="form-group stacked">
        <label for="{$context.appId}-{$context.item.id}-price"
          >{localize('DND5E.Price')}</label
        >
        {#if $context.concealDetails}
          <span>{localize('DND5E.Unidentified.Value')}</span>
        {:else}
          <NumberInput
            id="{$context.appId}-{$context.item.id}-price"
            value={$context.system.price.value}
            step="any"
            field="system.price.value"
            document={$context.item}
            disabled={!$context.editable}
            selectOnFocus={true}
            cssClass="large-value"
          />
          <Select
            value={$context.system.price.denomination}
            field="system.price.denomination"
            document={$context.item}
            disabled={!$context.editable}
          >
            <SelectOptions
              data={$context.config.currencies}
              labelProp="abbreviation"
            />
          </Select>
        {/if}
      </div>
    {/if}

    {#if $context.labels.toHit || $context.labels.derivedDamage}
      <h4 class="properties-header">
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ol class="properties-list animate-inert" inert={$context.concealDetails}>
        {#if $context.labels.save}
          <li>
            {$context.labels.save}
          </li>
        {/if}

        {#if $context.labels.toHit}
          <li>
            {$context.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each $context.labels.derivedDamage ?? [] as derivedDamage}
          {@const label = derivedDamage.label}
          <li>
            {label}
          </li>
        {/each}
      </ol>
    {/if}

    {#if $context.itemProperties.length}
      <section class="inert-animation-container">
        <h4 class="properties-header">{localize('DND5E.Properties')}</h4>
        <ol class="properties-list" inert={$context.concealDetails}>
          {#each $context.itemProperties as prop}
            <li>{prop}</li>
          {/each}
        </ol>
      </section>
    {/if}

    <div class="flex-column small-gap">
      <ItemFormGroup
        labelText={localize('TIDY5E.Section.Label')}
        field={TidyFlags.section.prop}
        cssClass="section"
        let:inputId
      >
        <TextInput
          document={$context.item}
          field={TidyFlags.section.prop}
          id={inputId}
          placeholder={localize('TIDY5E.Section.Default')}
          value={TidyFlags.section.get($context.item) ?? ''}
          selectOnFocus={true}
          title={localize('TIDY5E.Section.Tooltip')}
        ></TextInput>
      </ItemFormGroup>
      <ItemFormGroup
        labelText={localize('TIDY5E.Section.ActionLabel')}
        field={TidyFlags.actionSection.prop}
        cssClass="section"
        let:inputId
      >
        <TextInput
          document={$context.item}
          field={TidyFlags.actionSection.prop}
          id={inputId}
          placeholder={localize('TIDY5E.Section.Default')}
          value={TidyFlags.actionSection.get($context.item) ?? ''}
          selectOnFocus={true}
          title={localize('TIDY5E.Section.ActionTooltip')}
        ></TextInput>
      </ItemFormGroup>
    </div>
  </div>

  <VerticalLineSeparator />

  {#if FoundryAdapter.userIsGm() || $context.isIdentified}
    <ItemDescriptions
      on:edit={(ev) => edit(ev.detail.valueToEdit, ev.detail.fieldToEdit)}
      renderDescriptions={!editing}
    />
  {:else if $context.editable || $context.system.unidentified.description}
    <RerenderAfterFormSubmission
      andOnValueChange={$context.enriched.unidentified}
    >
      <div class="flexrow" role="presentation" use:$context.activateEditors>
        <SheetEditor
          content={$context.enriched.unidentified}
          editable={$context.editable}
          target="system.unidentified.description"
        />
      </div>
    </RerenderAfterFormSubmission>
  {/if}
</div>

{#if editing}
  <RerenderAfterFormSubmission andOnValueChange={valueToEdit}>
    <article class="editor-container" use:onEditorActivation>
      <OpenSheetEditor content={valueToEdit} target={fieldToEdit} />
    </article>
  </RerenderAfterFormSubmission>
{/if}

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
  }

  .editor-container {
    width: 100%;
  }
</style>
