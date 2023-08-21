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
  export let dtype: string | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let cssClass: string | null = null;
  export let maxlength: number | null = null;
  export let ariaDescribedBy: string | null = null;
  export let selectOnFocus: boolean = false;
  export let saveEmptyAsNull: boolean = false;
  export let title: string | null = null;
  export let allowDeltaChanges: boolean = false;
  export let readonly: boolean = false;
  export let onSaveChange: OnSaveChangeFn = () => true;
  /**
   * Stops propagation on input change event.
   * Useful for cases when outside listeners like
   * the FormApplication are clearing an input
   * during a change event, since these inputs
   * do not use the `[name]` attribute.
   */
  export let stopChangePropagation: boolean = false;

  $: actualDataset = buildDataset(dataset);

  function saveChange(
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

    document.update({
      [field]: valueToSave,
    });
  }
</script>

<input
  type="text"
  {id}
  value={value?.toString() ?? ''}
  {placeholder}
  data-tooltip={tooltip}
  {...actualDataset}
  class={cssClass}
  {maxlength}
  data-dtype={dtype}
  aria-describedby={ariaDescribedBy}
  {title}
  {readonly}
  on:change={(ev) => onSaveChange(ev) && saveChange(ev)}
  on:click
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
/>
