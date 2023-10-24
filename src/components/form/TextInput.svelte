<script lang="ts">
  import { processInputChangeDelta } from 'src/sheets/form';
  import type { FoundryDocument } from 'src/types/document';
  import { buildDataset } from 'src/utils/data';

  type OnSaveChangeFn = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) => boolean;

  export let value: string | number | null = null;
  export let placeholder: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let tooltip: string | null = null;
  export let id: string | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let cssClass: string | null = null;
  export let maxlength: number | null = null;
  export let ariaDescribedBy: string | null = null;
  export let selectOnFocus: boolean = false;
  export let saveEmptyAsNull: boolean = false;
  export let title: string | null = null;
  export let allowDeltaChanges: boolean = false;
  export let disabled: boolean = false;
  export let onSaveChange: OnSaveChangeFn = () => true;
  /**
   * Stop propagation on input change event.
   * Useful for cases when outside listeners like
   * the FormApplication are clearing an input
   * during a change event, since these inputs
   * do not use the `[name]` attribute.
   */
  export let stopChangePropagation: boolean = false;

  $: draftValue = value?.toString() ?? '';
  $: actualDataset = buildDataset(dataset);
  let theInput: HTMLInputElement | undefined;

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    stopChangePropagation && event.stopPropagation();

    let valueToSave =
      saveEmptyAsNull && event.currentTarget.value === ''
        ? null
        : !isNaN(parseInt(event.currentTarget.value)) && allowDeltaChanges
        ? processInputChangeDelta(event, document, field)
        : event.currentTarget.value;

    const result = await document.update({
      [field]: valueToSave,
    });

    if (result === undefined) {
      draftValue = value?.toString() ?? '';
    }

    setTimeout(() => {
      if (selectOnFocus && theInput === window.document.activeElement) {
        theInput.select();
      }
    });
  }
</script>

<input
  bind:this={theInput}
  type="text"
  {id}
  bind:value={draftValue}
  {placeholder}
  data-tooltip={tooltip}
  {...actualDataset}
  class={cssClass}
  {maxlength}
  aria-describedby={ariaDescribedBy}
  {title}
  {disabled}
  on:change={(ev) => onSaveChange(ev) && saveChange(ev)}
  on:click
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
/>
