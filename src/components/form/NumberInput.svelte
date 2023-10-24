<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';
  import { buildDataset } from 'src/utils/data';

  export let value: number | null = null;
  export let step: string = 'any';
  export let placeholder: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
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
    }
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
  data-tooltip={tooltip}
  {disabled}
  {readonly}
  class={cssClass}
  {maxlength}
  {...datasetAttributes}
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
  on:click={(ev) => stopClickPropagation && ev.stopPropagation()}
  {title}
/>
