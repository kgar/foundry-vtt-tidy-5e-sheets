<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ContainerSheetContext,
    ItemSheetContext,
  } from 'src/types/item.types';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    VehicleSheetContext,
  } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { buildDataset } from 'src/utils/data';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  // TODO: File this away somewhere.
  type SvelteInputEvent = (
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) => any;

  export let value: number | null = null;
  export let checked: boolean = false;
  export let field: string;
  export let document: any;
  export let title: string | null = null;
  export let tooltip: string | null = null;
  export let id: string | null = null;
  export let disabled: boolean | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let labelCssClass: string | null = null;
  export let checkboxCssClass: string | null = null;
  export let onDataPreparing: SvelteInputEvent | null = null;
  // TODO: Get rid of the these horrendous green checkboxes and remove all the code that barely props them up.
  export let greenCheckboxWidthOverride: string | null = null;
  $: greenCheckboxStyle =
    greenCheckboxWidthOverride !== null
      ? `width: ${greenCheckboxWidthOverride}`
      : '';

  $: draftValue = value;
  $: datasetAttributes = buildDataset(dataset);

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    },
  ) {
    let data: any = onDataPreparing?.(event) ?? {
      [field]: value ?? event.currentTarget.checked,
    };

    await document.update(data);

    draftValue = value;
  }

  const context =
    getContext<
      Readable<
        | CharacterSheetContext
        | NpcSheetContext
        | VehicleSheetContext
        | ContainerSheetContext
        | ItemSheetContext
      >
    >('context');

  $: activeEffectApplied = ActiveEffectsHelper.isActiveEffectAppliedToField(
    document,
    field,
  );

  $: isEnchanted =
    $context.itemOverrides instanceof Set && $context.itemOverrides.has(field);

  $: overrideTooltip = isEnchanted
    ? localize('DND5E.Enchantment.Warning.Override')
    : localize('DND5E.ActiveEffectOverrideWarning');

  const localize = FoundryAdapter.localize;
</script>

<!-- TODO: Make label wrapper conditional when Svelte 5 snippets come out -->
{#if $$slots.default}
  <label
    class={labelCssClass}
    {title}
    style={greenCheckboxStyle}
    data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  >
    <input
      type="checkbox"
      {id}
      bind:value={draftValue}
      {checked}
      on:change={saveChange}
      disabled={disabled || activeEffectApplied}
      {...datasetAttributes}
      class={checkboxCssClass}
      data-tidy-field={field}
    />
    <slot />
  </label>
{:else}
  <input
    type="checkbox"
    {id}
    bind:value={draftValue}
    {checked}
    on:change={saveChange}
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
