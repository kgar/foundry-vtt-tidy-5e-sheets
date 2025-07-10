<script lang="ts">
  import NumberInput from 'src/components/inputs/NumberInput.svelte';
  import Select from 'src/components/inputs/Select.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { ItemSheetContext } from 'src/types/item.types';
  import HorizontalLineSeparator from 'src/components/layout/HorizontalLineSeparator.svelte';
  import VerticalLineSeparator from 'src/components/layout/VerticalLineSeparator.svelte';
  import ItemDescriptions from '../parts/ItemDescriptions.svelte';
  import { CONSTANTS } from 'src/constants';
  import TextInput from 'src/components/inputs/TextInput.svelte';
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import SheetEditorV2 from 'src/components/editor/SheetEditorV2.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import { SectionSelectorApplication } from 'src/applications/section-selector/SectionSelectorApplication.svelte';
  import PropertyTag from 'src/components/properties/PropertyTag.svelte';
  import SpellBlock from 'src/sheets/quadrone/item/parts/SpellBlock.svelte';

  let context = $derived(getSheetContext<ItemSheetContext>());

  let appId = $derived(context.document.id);

  let editing = $state(false);
  let contentToEdit: string = $state('');
  let enrichedText: string = $state('');
  let fieldToEdit: string = $state('');

  function stopEditing() {
    editing = false;
  }

  function edit(value: string, enriched: string, field: string) {
    contentToEdit = value;
    fieldToEdit = field;
    enrichedText = enriched;
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
    {#if context.isPhysical}
      {#if context.item.type !== CONSTANTS.ITEM_TYPE_CONTAINER}
        <div class="form-group">
          <label for="{appId}-quantity">{localize('DND5E.Quantity')}</label>
          <NumberInput
            id="{appId}-quantity"
            value={context.source.quantity}
            field="system.quantity"
            document={context.item}
            step="1"
            disabled={!context.editable || context.lockItemQuantity}
            selectOnFocus={true}
          />
        </div>

        <HorizontalLineSeparator borderColor="separator" />
      {/if}

      <div class="form-group stacked">
        <label for="{appId}-weight-value">{localize('DND5E.Weight')}</label>
        <NumberInput
          id="{appId}-weight-value"
          value={context.source.weight.value}
          step="any"
          field="system.weight.value"
          document={context.item}
          disabled={!context.editable}
          selectOnFocus={true}
          cssClass="large-value"
        />
        <Select
          document={context.item}
          field="system.weight.units"
          value={context.source.weight.units}
        >
          <SelectOptions
            data={context.config.weightUnits}
            labelProp="abbreviation"
          />
        </Select>
      </div>

      <HorizontalLineSeparator borderColor="separator" />

      <div class="form-group stacked">
        <label for="{appId}-price-value">{localize('DND5E.Price')}</label>
        {#if context.concealDetails}
          <span>{localize('DND5E.Unidentified.Value')}</span>
        {:else}
          <NumberInput
            id="{appId}-price-value"
            value={context.source.price.value}
            step="any"
            field="system.price.value"
            document={context.item}
            disabled={!context.editable}
            selectOnFocus={true}
            cssClass="large-value"
          />
          <Select
            value={context.source.price.denomination}
            field="system.price.denomination"
            document={context.item}
            disabled={!context.editable}
          >
            <SelectOptions
              data={context.config.currencies}
              labelProp="abbreviation"
            />
          </Select>
        {/if}
      </div>
    {/if}

    {#if context.item.type === CONSTANTS.ITEM_TYPE_SPELL}
      <SpellBlock {context} />
    {/if}

    {#if context.labels.toHit || context.labels.damages?.length}
      <h4 class="properties-header">
        {localize('DND5E.Attack')}/{localize('DND5E.Damage')}
      </h4>
      <ol
        class="properties-list animate-concealed-content"
        class:conceal-content={context.concealDetails}
      >
        {#if context.labels.save}
          <li>
            {context.labels.save}
          </li>
        {/if}

        {#if context.labels.toHit}
          <li>
            {context.labels.toHit}
            {localize('DND5E.ToHit')}
          </li>
        {/if}

        {#each context.labels.damages ?? [] as damage}
          {@const label = damage.label}
          <li>
            {label}
          </li>
        {/each}
      </ol>
    {/if}

    {#if context.properties.active.length}
      <section class="concealed-content-animation-container">
        <h4 class="properties-header">{localize('DND5E.Properties')}</h4>
        <ol
          class="properties-list"
          class:conceal-details={context.concealDetails}
        >
          {#each context.properties.active as prop}
            {#if prop !== null && prop !== undefined}
              <li>
                <PropertyTag {prop} showParenthetical={true} class="property" />
              </li>
            {/if}
          {/each}
        </ol>
      </section>
    {/if}

    <div class="flex-column small-gap">
      <div class="form-group section stretch">
        <div
          class="properties-header flex-grow-1 flex-row extra-small-gap justify-content-space-between align-items-center"
        >
          <label for="{appId}-tidy-section"
            >{localize('TIDY5E.Section.Label')}
          </label>
          <a
            title={localize(
              'TIDY5E.Section.SectionSelectorChooseSectionTooltip',
            )}
            class="inline-icon-button"
            onclick={() =>
              new SectionSelectorApplication(
                TidyFlags.section.prop,
                localize('TIDY5E.Section.Label'),
                context.item,
                { document: context.item },
              ).render(true)}
          >
            <i class="fa-solid fa-search"></i>
          </a>
        </div>
        <TextInput
          id="{appId}-tidy-section"
          document={context.item}
          field={TidyFlags.section.prop}
          placeholder={localize('TIDY5E.Section.Default')}
          value={TidyFlags.section.get(context.item) ?? ''}
          selectOnFocus={true}
          title={localize('TIDY5E.Section.Tooltip')}
          disabled={!context.editable}
        />
      </div>
      <div class="form-group section stretch">
        <div
          class="properties-header flex-grow-1 flex-row extra-small-gap justify-content-space-between align-items-center"
        >
          <label for="{appId}-tidy-action-section"
            >{localize('TIDY5E.Section.ActionLabel')}</label
          >
          <a
            title={localize(
              'TIDY5E.Section.SectionSelectorChooseActionSectionTooltip',
            )}
            class="inline-icon-button"
            onclick={() =>
              new SectionSelectorApplication(
                TidyFlags.actionSection.prop,
                localize('TIDY5E.Section.ActionLabel'),
                context.item,
                { document: context.item },
              ).render(true)}
          >
            <i class="fa-solid fa-search"></i>
          </a>
        </div>

        <TextInput
          id="{appId}-tidy-action-section"
          document={context.item}
          field={TidyFlags.actionSection.prop}
          placeholder={localize('TIDY5E.Section.Default')}
          value={TidyFlags.actionSection.get(context.item) ?? ''}
          selectOnFocus={true}
          title={localize('TIDY5E.Section.ActionTooltip')}
          disabled={!context.editable}
        />
      </div>
    </div>
  </div>

  <VerticalLineSeparator />

  {#if FoundryAdapter.userIsGm() || context.isIdentified}
    <ItemDescriptions
      onEdit={(detail) =>
        edit(detail.contentToEdit, detail.enrichedText, detail.fieldToEdit)}
      renderDescriptions={!editing}
    />
  {:else if context.editable || context.system.unidentified.description}
    {#key context.enriched.unidentified}
      <article class="editor-container">
        <SheetEditorV2
          content={context.system.unidentified.description}
          enriched={context.enriched.unidentified}
          field="system.unidentified.description"
          editorOptions={{
            editable: context.editable,
          }}
          documentUuid={context.item.uuid}
          manageSecrets={context.document.isOwner}
        />
      </article>
    {/key}
  {/if}
</div>

{#if editing}
  {#key contentToEdit}
    <article class="editor-container">
      <SheetEditorV2
        enriched={enrichedText}
        content={contentToEdit}
        field={fieldToEdit}
        editorOptions={{
          editable: context.editable,
          toggled: false,
        }}
        documentUuid={context.item.uuid}
        onSave={() => stopEditing()}
        manageSecrets={context.document.isOwner}
      />
    </article>
  {/key}
{/if}

<style lang="scss">
  .item-properties {
    flex: 0 0 7.5rem;
    padding-top: 0.0625rem;
  }

  .editor-container {
    width: 100%;
  }
</style>
