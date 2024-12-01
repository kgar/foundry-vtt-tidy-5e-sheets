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

  interface Props {
    value: unknown;
    tooltip?: string | null;
    field: string;
    document: any;
    id?: string | null;
    dataset?: Record<string, unknown> | null;
    title?: string | null;
    disabled?: boolean;
    blankValue?: any;
    children?: Snippet;
    [key: string]: any;
  }

  let {
    value,
    tooltip = null,
    field,
    document,
    id = null,
    dataset = null,
    title = null,
    disabled = false,
    blankValue = null,
    children,
    ...rest
  }: Props = $props();

  async function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ) {
    const targetValue = event.currentTarget.value;

    await document.update({
      [field]: targetValue !== '' ? targetValue : blankValue,
    });
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

<select
  {id}
  bind:value
  data-tooltip={activeEffectApplied ? overrideTooltip : tooltip}
  onchange={document && saveChange}
  {title}
  {...datasetAttributes}
  disabled={disabled || activeEffectApplied}
  data-tidy-field={field}
  class={rest.class ?? ''}
>
  {@render children?.()}
</select>
