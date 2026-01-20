<script lang="ts">
  import { type HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    disabledValue?: HTMLInputElement['value'];
    field: string;
    document: any;
    selectOnFocus?: boolean;
    stopClickPropagation?: boolean;
    /** When true, empty input falls back to min (if defined) or 0 instead of null */
    valueRequired?: boolean;
  } & HTMLInputAttributes;

  let {
    disabledValue,
    field,
    document,
    selectOnFocus = false,
    stopClickPropagation = false,
    valueRequired = false,
    ...rest
  }: Props = $props();

  let theInput: HTMLInputElement | undefined = $state();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    if (rest.name) {
      return;
    }

    const proposedValueToSave = parseFloat(event.currentTarget.value);

    let parsedValueToSave: number | null = !isNaN(proposedValueToSave)
      ? proposedValueToSave
      : null;

    if (parsedValueToSave === null && valueRequired) {
      const minValue = parseFloat(String(rest.min));
      parsedValueToSave = !isNaN(minValue) ? minValue : 0;
    }

    await document.update({
      [field]: parsedValueToSave,
    });

    if (selectOnFocus && theInput === window.document.activeElement) {
      theInput.select();
    }
  }

  let value = $derived(
    rest.disabled ? (disabledValue ?? rest.value) : rest.value,
  );
</script>

<input
  bind:this={theInput}
  type="number"
  onchange={saveChange}
  onfocus={(ev) => selectOnFocus && ev.currentTarget.select()}
  onclick={(ev) => stopClickPropagation && ev.stopPropagation()}
  data-tidy-field={field}
  {...rest}
  {value}
/>
