<script lang="ts">
  import type { DataField, FormInputConfig } from 'foundry.data.fields';
  import type { Snippet } from 'svelte';
  import type { ClassValue } from 'svelte/elements';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import TidyFormInput from './TidyFormInput.svelte';

  type Props = {
    children?: Snippet;
    choices?: any[] | object | Function;
    config?: FormInputConfig;
    disableOverriddenInputs?: boolean;
    document?: any;
    field?: DataField;
    groupClasses?: ClassValue;
    hidden?: boolean | 'until-found';
    hint?: string;
    label?: string;
    labelFor?: string;
    localize?: boolean;
    name?: string;
    stacked?: boolean;
    units?: string;
  };

  let {
    children,
    choices,
    config,
    disableOverriddenInputs,
    document,
    field,
    groupClasses,
    hidden,
    hint,
    label,
    labelFor,
    localize = true,
    name,
    stacked,
    units,
  }: Props = $props();

  let effectiveLabel = $derived(label ?? field?.label ?? field?.fieldPath);

  let effectiveHint = $derived(hint ?? field?.hint);

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
  <label for={labelFor}>
    {#if effectiveLabel}
      {localize ? FoundryAdapter.localize(effectiveLabel) : effectiveLabel}
    {/if}
    {#if units}
      <span class="units">{FoundryAdapter.localize(units)}</span>
    {/if}
  </label>
  <div class="form-fields">
    {#if field}
      <TidyFormInput
        {field}
        {config}
        {document}
        {disableOverriddenInputs}
        {name}
        {choices}
      />
    {/if}
    {@render children?.()}
  </div>
  {#if effectiveHint}
    <p class="hint">
      {@html localize ? FoundryAdapter.localize(effectiveHint) : effectiveHint}
    </p>
  {/if}
</div>
