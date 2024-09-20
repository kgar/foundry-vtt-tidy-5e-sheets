<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { buildDataset } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let value: number | null = null;
  export let step: string = 'any';
  export let placeholder: string | null = null;
  export let field: string;
  export let document: any;
  export let tooltip: string | null = null;
  export let min: string | number | null | undefined = null;
  export let max: string | number | null | undefined = null;
  export let id: string | null = null;
  export let disabled: boolean | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let readonly: boolean | null = null;
  export let cssClass: string | null = null;
  export let maxlength: HTMLInputElement['maxLength'] | null = null;
  export let selectOnFocus: boolean = false;
  export let title: string | null = null;
  export let stopClickPropagation: boolean = false;

  $: draftValue = value;
  $: datasetAttributes = buildDataset(dataset);
  let theInput: HTMLInputElement | undefined;

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

    draftValue = value;

    if (selectOnFocus && theInput === window.document.activeElement) {
      theInput.select();
    }
  }

  const context =
    getContext<
      Readable<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetContext
        | ItemSheetContext
      >
    >('context');

  $: activeEffectApplied = ActiveEffectsHelper.isActiveEffectAppliedToField(
    document,
    field,
  );

  $: isEnchanted =
    $context.itemOverrides instanceof Set && $context.itemOverrides.has(field);

  $: overrideTooltip = isEnchanted
    ? localize('DND5E.ENCHANTMENT.Warning.Override')
    : localize('DND5E.ActiveEffectOverrideWarning');

  const localize = FoundryAdapter.localize;
</script>

<input
  bind:this={theInput}
  type="number"
  {id}
  {step}
  bind:value={draftValue}
  {min}
  {max}
  {placeholder}
  on:change={saveChange}
  data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  disabled={disabled || activeEffectApplied}
  {readonly}
  class={cssClass}
  {maxlength}
  {...datasetAttributes}
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
  on:click={(ev) => stopClickPropagation && ev.stopPropagation()}
  {title}
  data-tidy-field={field}
/>
