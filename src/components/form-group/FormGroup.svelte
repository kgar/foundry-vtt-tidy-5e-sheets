<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyFormInput from './TidyFormInput.svelte';

  type FormInputOptions = Omit<
    ComponentProps<typeof TidyFormInput>,
    'document'
  >;

  type Props = Partial<FormInputOptions> & {
    formLabel?: Snippet;
    children?: Snippet;
    beforeGroupEnd?: Snippet;
    document?: any;
    fields?: FormInputOptions[];
    groupClasses?: ClassValue;
    hidden?: boolean | 'until-found';
    hint?: string;
    label?: string;
    labelFor?: string;
    localize?: boolean;
    stacked?: boolean;
    units?: string;
  };

  let {
    blankLabel,
    formLabel,
    children,
    beforeGroupEnd,
    choices,
    condition,
    config,
    disabledValue,
    disableOverriddenInputs,
    document,
    field,
    fields = [],
    groupClasses,
    hidden,
    hint,
    label,
    labelAttr,
    labelFor,
    localize = true,
    stacked,
    tooltip,
    units,
    valueAttr,
  }: Props = $props();

  let effectiveLabel = $derived(label ?? field?.label ?? field?.fieldPath);

  let effectiveHint = $derived(hint ?? config?.hint ?? field?.hint);

  let fieldPathSlug = $derived(field?.fieldPath);
</script>

<div
  class={[
    'form-group',
    {
      stacked: stacked,
      hidden: hidden,
    },
    groupClasses,
  ]}
  data-field-path={fieldPathSlug}
>
  {#if formLabel}
    {@render formLabel()}
  {:else}
    <label for={labelFor}>
      {#if effectiveLabel}
        {localize ? FoundryAdapter.localize(effectiveLabel) : effectiveLabel}
      {/if}
      {#if units}
        <span class="units">{FoundryAdapter.localize(units)}</span>
      {/if}
    </label>
  {/if}
  <div class="form-fields">
    {#if field}
      {@render FormInput({
        blankLabel,
        choices,
        config,
        disabledValue,
        disableOverriddenInputs,
        field,
        tooltip,
        labelAttr,
        valueAttr,
        condition,
      })}
    {/if}
    {#each fields as options}
      {@render FormInput(options)}
    {/each}
    {@render children?.()}
  </div>
  {@render beforeGroupEnd?.()}
  {#if effectiveHint}
    <p class="hint">
      {@html localize ? FoundryAdapter.localize(effectiveHint) : effectiveHint}
    </p>
  {/if}
</div>

{#snippet FormInput({
  blankLabel,
  choices,
  config,
  disabledValue,
  disableOverriddenInputs,
  field,
  tooltip,
  labelAttr,
  valueAttr,
  condition,
}: FormInputOptions)}
  {#if field}
    <TidyFormInput
      {blankLabel}
      {choices}
      {config}
      {disabledValue}
      {disableOverriddenInputs}
      {document}
      {field}
      {tooltip}
      {labelAttr}
      {valueAttr}
      {condition}
    />
  {/if}
{/snippet}
