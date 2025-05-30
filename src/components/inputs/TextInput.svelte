<script lang="ts">
  import { processInputChangeDelta } from 'src/utils/form';
  import { buildDataset } from 'src/utils/data';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetClassicContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import type {
    KeyboardEventHandler,
    MouseEventHandler,
  } from 'svelte/elements';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';

  type OnSaveChangeFn = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => boolean;

  interface Props {
    value?: string | number | null;
    placeholder?: string | null;
    field: string;
    document: any;
    tooltip?: string | null;
    id?: string | null;
    dataset?: Record<string, unknown> | null;
    maxlength?: number | null;
    ariaDescribedBy?: string | null;
    selectOnFocus?: boolean;
    saveEmptyAsNull?: boolean;
    title?: string | null;
    allowDeltaChanges?: boolean;
    disabled?: boolean;
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
    onclick?: MouseEventHandler<HTMLElement>;
    onkeypress?: KeyboardEventHandler<HTMLElement>;
    [key: string]: any;
  }

  let {
    value = null,
    placeholder = null,
    field,
    document,
    tooltip = null,
    id = null,
    dataset = null,
    maxlength = null,
    ariaDescribedBy = null,
    selectOnFocus = false,
    saveEmptyAsNull = false,
    title = null,
    allowDeltaChanges = false,
    disabled = false,
    onSaveChange = () => true,
    additionalDataToSave = {},
    stopChangePropagation = false,
    onclick,
    onkeypress,
    ...rest
  }: Props = $props();

  let theInput: HTMLInputElement | undefined = $state();

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

    value = value?.toString() ?? '';

    setTimeout(() => {
      if (selectOnFocus && theInput === window.document.activeElement) {
        theInput.select();
      }
    });
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

  let actualDataset = $derived(buildDataset(dataset));
  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(document, field),
  );
  let isEnchanted = $derived(
    'itemOverrides' in context &&
      context.itemOverrides instanceof Set &&
      context.itemOverrides.has(field),
  );
  let overrideTooltip = $derived(
    isEnchanted
      ? localize('DND5E.ENCHANTMENT.Warning.Override')
      : localize('DND5E.ActiveEffectOverrideWarning'),
  );
</script>

<input
  bind:this={theInput}
  type="text"
  {id}
  {value}
  {placeholder}
  data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  {...actualDataset}
  {...rest.attributes}
  class={rest.class ?? ''}
  {maxlength}
  aria-describedby={ariaDescribedBy}
  {title}
  disabled={disabled || activeEffectApplied}
  onchange={(ev) => onSaveChange(ev) && saveChange(ev)}
  {onclick}
  {onkeypress}
  onfocus={(ev) => selectOnFocus && ev.currentTarget.select()}
  data-tidy-field={field}
/>
