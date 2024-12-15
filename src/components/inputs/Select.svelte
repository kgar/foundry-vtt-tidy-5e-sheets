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

  let draftValue = $state('');

  $effect(() => {
    draftValue = value?.toString() ?? '';
  });

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

  let datasetAttributes = $derived(buildDataset(dataset));
  let activeEffectApplied = $derived(
    ActiveEffectsHelper.isActiveEffectAppliedToField(document, field),
  );
  let isEnchanted = $derived(
    context.itemOverrides instanceof Set && context.itemOverrides.has(field),
  );
  let overrideTooltip = $derived(
    isEnchanted
      ? localize('DND5E.ENCHANTMENT.Warning.Override')
      : localize('DND5E.ActiveEffectOverrideWarning'),
  );
</script>

<select
  {id}
  bind:value={draftValue}
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
