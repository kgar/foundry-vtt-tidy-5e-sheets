<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    ContainerSheetClassicContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { buildDataset } from 'src/utils/data';

  interface Props {
    value?: number | null;
    step?: string;
    placeholder?: string | null;
    field: string;
    document: any;
    tooltip?: string | null;
    min?: string | number | null | undefined;
    max?: string | number | null | undefined;
    id?: string | null;
    disabled?: boolean | null;
    dataset?: Record<string, unknown> | null;
    readonly?: boolean | null;
    cssClass?: string | null;
    maxlength?: HTMLInputElement['maxLength'] | null;
    selectOnFocus?: boolean;
    title?: string | null;
    stopClickPropagation?: boolean;
  }

  let {
    value = null,
    step = 'any',
    placeholder = null,
    field,
    document,
    tooltip = null,
    min = null,
    max = null,
    id = null,
    disabled = null,
    dataset = null,
    readonly = null,
    cssClass = null,
    maxlength = null,
    selectOnFocus = false,
    title = null,
    stopClickPropagation = false,
  }: Props = $props();

  let theInput: HTMLInputElement | undefined = $state();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    const proposedValueToSave = parseFloat(event.currentTarget.value);

    const parsedValueToSave = !isNaN(proposedValueToSave)
      ? proposedValueToSave
      : null;

    await document.update({
      [field]: parsedValueToSave,
    });

    if (selectOnFocus && theInput === window.document.activeElement) {
      theInput.select();
    }
  }

  const context =
    $derived(
      getSheetContext<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetClassicContext
        | ItemSheetContext
      >(),
    );

  const localize = FoundryAdapter.localize;

  let datasetAttributes = $derived(buildDataset(dataset));
  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(document, field),
  );
  let isEnchanted = $derived(
    context.itemOverrides instanceof Set && context.itemOverrides.has(field),
  );
  let overrideTooltip = $derived(
    isEnchanted
      ? localize('DND5E.ENCHANTMENT.Warning.Override')
      : localize('DND5E.ActiveEffectOverrideWarning'),
  );
</script>

<input
  bind:this={theInput}
  type="number"
  {id}
  {step}
  {value}
  {min}
  {max}
  {placeholder}
  onchange={saveChange}
  data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  disabled={disabled || activeEffectApplied}
  {readonly}
  class={cssClass}
  {maxlength}
  {...datasetAttributes}
  onfocus={(ev) => selectOnFocus && ev.currentTarget.select()}
  onclick={(ev) => stopClickPropagation && ev.stopPropagation()}
  {title}
  data-tidy-field={field}
/>
