<script lang="ts">
  import { processInputChangeDelta } from 'src/utils/form';
  import { tick } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';

  type OnSaveChangeFn = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => boolean;

  type Props = {
    disabledValue?: string;
    field: string;
    document: any;
    selectOnFocus?: boolean;
    saveEmptyAsNull?: boolean;
    enableDeltaChanges?: boolean;
    onSaveChange?: OnSaveChangeFn;
    /**
     * There are cases where related data must be updated together,
     * else odd behaviors will result.
     */
    additionalDataToSave?: Record<string, any>;
    /**
     * Stop propagation on input change event.
     * Useful for cases when outside listeners like
     * the Foundry Application are clearing an input
     * during a change event, since these inputs
     * do not use the `[name]` attribute.
     */
    stopChangePropagation?: boolean;
    blurAfterChange?: boolean;
  } & HTMLInputAttributes;

  let {
    disabledValue,
    field,
    document,
    selectOnFocus = false,
    saveEmptyAsNull = false,
    enableDeltaChanges = false,
    onSaveChange = () => true,
    additionalDataToSave = {},
    stopChangePropagation = false,
    blurAfterChange = false,
    ...rest
  }: Props = $props();

  let theInput: HTMLInputElement | undefined = $state();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    if (!theInput) {
      return;
    }

    if (rest.name) {
      return;
    }

    stopChangePropagation && event.stopPropagation();

    const currentTarget = event.currentTarget;
    const targetValue = currentTarget.value;

    let valueToSave =
      saveEmptyAsNull && targetValue === ''
        ? null
        : !isNaN(parseInt(targetValue)) && enableDeltaChanges
          ? processInputChangeDelta(targetValue, document, field)
          : targetValue;

    const result = await document.update({
      ...additionalDataToSave,
      [field]: valueToSave,
    });

    if (blurAfterChange) {
      theInput?.blur();
    } else {
      setTimeout(() => {
        if (selectOnFocus && theInput === window.document.activeElement) {
          theInput?.select();
        }
      });
    }

    return result;
  }

  let value = $derived(
    rest.disabled ? (disabledValue ?? rest.value) : rest.value,
  );

  export async function selectText() {
    await tick();
    theInput?.focus();
    theInput?.select();
  }
</script>

<input
  bind:this={theInput}
  type="text"
  onchange={(ev) => onSaveChange(ev) && saveChange(ev)}
  onfocus={(ev) => selectOnFocus && ev.currentTarget.select()}
  data-tidy-field={field}
  {...rest}
  {value}
/>
