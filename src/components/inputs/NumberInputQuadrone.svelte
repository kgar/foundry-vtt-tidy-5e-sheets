<script lang="ts">
  import { type HTMLInputAttributes } from 'svelte/elements';

  type Props = {
    field: string;
    document: any;
    selectOnFocus?: boolean;
    stopClickPropagation?: boolean;
  } & HTMLInputAttributes;

  let {
    placeholder = null,
    field,
    document,
    selectOnFocus = false,
    stopClickPropagation = false,
    ...rest
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
</script>

<input
  bind:this={theInput}
  type="number"
  {placeholder}
  onchange={saveChange}
  onfocus={(ev) => selectOnFocus && ev.currentTarget.select()}
  onclick={(ev) => stopClickPropagation && ev.stopPropagation()}
  data-tidy-field={field}
  {...rest}
/>
