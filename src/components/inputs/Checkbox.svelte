<script lang="ts">
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
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { buildDataset } from 'src/utils/data';
  import { getContext, type Snippet } from 'svelte';
  import type { Readable } from 'svelte/store';

  // TODO: File this away somewhere.
  type SvelteInputEvent = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => any;

  interface Props {
    value?: number | string | null;
    checked?: boolean;
    field: string;
    document: any;
    title?: string | null;
    tooltip?: string | null;
    id?: string | null;
    disabled?: boolean | null;
    dataset?: Record<string, unknown> | null;
    labelCssClass?: string | null;
    checkboxCssClass?: string | null;
    onDataPreparing?: SvelteInputEvent | null;
    // TODO: Get rid of the these horrendous green checkboxes and remove all the code that barely props them up.
    greenCheckboxWidthOverride?: string | null;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    value = null,
    checked = false,
    field,
    document,
    title = null,
    tooltip = null,
    id = null,
    disabled = null,
    dataset = null,
    labelCssClass = null,
    checkboxCssClass = null,
    onDataPreparing = null,
    greenCheckboxWidthOverride = null,
    children,
    ...rest
  }: Props = $props();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    let data: any = onDataPreparing?.(event) ?? {
      [field]: value ?? event.currentTarget.checked,
    };

    await document.update(data);
  }

  const context =
    getContext<
      Readable<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetClassicContext
        | ItemSheetContext
      >
    >('context');

  const localize = FoundryAdapter.localize;
  let greenCheckboxStyle = $derived(
    greenCheckboxWidthOverride !== null
      ? `width: ${greenCheckboxWidthOverride}`
      : '',
  );

  let datasetAttributes = $derived(buildDataset(dataset));
  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(document, field),
  );
  let isEnchanted = $derived(
    $context.itemOverrides instanceof Set && $context.itemOverrides.has(field),
  );
  let overrideTooltip = $derived(
    isEnchanted
      ? localize('DND5E.ENCHANTMENT.Warning.Override')
      : localize('DND5E.ActiveEffectOverrideWarning'),
  );
</script>

<!-- TODO: Make label wrapper conditional when Svelte 5 snippets come out -->
{#if children}
  <label
    class={labelCssClass}
    {title}
    style={greenCheckboxStyle}
    data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  >
    <input
      type="checkbox"
      {id}
      {value}
      {checked}
      onchange={saveChange}
      disabled={disabled || activeEffectApplied}
      {...datasetAttributes}
      class={checkboxCssClass}
      data-tidy-field={field}
      {...rest.attributes}
    />
    {@render children?.()}
  </label>
{:else}
  <input
    type="checkbox"
    {id}
    {value}
    {checked}
    onchange={saveChange}
    {title}
    disabled={disabled || activeEffectApplied}
    data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
    {...datasetAttributes}
    class={checkboxCssClass}
    data-tidy-field={field}
  />
{/if}

<style lang="scss">
  label {
    --tidy-checkbox-width-internal: var(--tidy-checkbox-width, unset);
    width: var(--tidy-checkbox-width-internal);
  }
</style>
