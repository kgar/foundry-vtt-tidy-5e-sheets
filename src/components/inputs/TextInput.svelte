<script lang="ts">
  import { processInputChangeDelta } from 'src/utils/form';
  import { buildDataset } from 'src/utils/data';

  type OnSaveChangeFn = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => boolean;

  export let value: string | number | null = null;
  export let placeholder: string | null = null;
  export let field: string;
  export let document: any;
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
   * There are cases where related data must be updated together,
   * else odd behaviors will result.
   */
  export let additionalDataToSave: Record<string, any> = {};
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
    },
  ) {
    stopChangePropagation && event.stopPropagation();

    const targetValue = event.currentTarget.value;

    let valueToSave =
      saveEmptyAsNull && targetValue === ''
        ? null
        : !isNaN(parseInt(targetValue)) && allowDeltaChanges
          ? processInputChangeDelta(targetValue, document, field)
          : targetValue;

    await document.update({
      ...additionalDataToSave,
      [field]: valueToSave,
    });

    draftValue = value?.toString() ?? '';

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
  on:keypress
  on:focus={(ev) => selectOnFocus && ev.currentTarget.select()}
/>
