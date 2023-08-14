<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';
  import { buildDataset } from 'src/utils/data';

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

  $: actualDataset = buildDataset(dataset);

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const valueToSave =
      saveEmptyAsNull && event.currentTarget.value === ''
        ? null
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
  on:change={saveChange}
  data-tooltip={tooltip}
  {...actualDataset}
  class={cssClass}
  {maxlength}
  data-dtype={dtype}
  aria-describedby={ariaDescribedBy}
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
/>
