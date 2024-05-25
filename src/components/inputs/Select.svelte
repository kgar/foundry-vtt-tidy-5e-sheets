<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { buildDataset } from 'src/utils/data';

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

  $: activeEffectApplied = ActiveEffectsHelper.isActiveEffectAppliedToField(
    document,
    field,
  );

  const localize = FoundryAdapter.localize;
</script>

<select
  {id}
  bind:value={draftValue}
  data-tooltip={activeEffectApplied
    ? localize('DND5E.ActiveEffectOverrideWarning')
    : tooltip}
  on:change={document && saveChange}
  {title}
  {...datasetAttributes}
  disabled={disabled || activeEffectApplied}
  data-tidy-field={field}
  class={$$props.class ?? ''}
>
  <slot />
</select>
