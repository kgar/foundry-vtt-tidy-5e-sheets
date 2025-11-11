<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
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
  import { type Snippet } from 'svelte';

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

{#snippet checkboxInput()}
  <input
    type="checkbox"
    {id}
    {value}
    {checked}
    {title}
    onchange={saveChange}
    disabled={disabled || activeEffectApplied}
    {...datasetAttributes}
    class={checkboxCssClass}
    data-tidy-field={field}
    {...rest.attributes}
    data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  />
{/snippet}

{#if children}
  <label
    class={[labelCssClass, 'checkbox']}
    {title}
    style={greenCheckboxStyle}
    data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  >
    {@render checkboxInput()}
    {@render children?.()}
  </label>
{:else}
  {@render checkboxInput()}
{/if}

<style lang="less">
  label {
    --tidy-checkbox-width-internal: var(--tidy-checkbox-width, unset);
    width: var(--tidy-checkbox-width-internal);
  }
</style>
