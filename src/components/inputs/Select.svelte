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

  export let value: unknown;
  export let tooltip: string | null = null;
  export let field: string;
  export let document: any;
  export let id: string | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let title: string | null = null;
  export let disabled: boolean = false;
  export let blankValue: any = null;

  $: draftValue = value?.toString() ?? '';
  $: datasetAttributes = buildDataset(dataset);

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ) {
    const targetValue = event.currentTarget.value;

    document.update({
      [field]: targetValue !== '' ? targetValue : blankValue,
    });

    draftValue = value?.toString() ?? '';
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

<select
  {id}
  bind:value={draftValue}
  data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  on:change={document && saveChange}
  {title}
  {...datasetAttributes}
  disabled={disabled || activeEffectApplied}
  data-tidy-field={field}
  class={$$restProps.class ?? ''}
>
  <slot />
</select>
