<script lang="ts">
  import type { DataField, FormInputConfig } from 'foundry.data.fields';
  import TidyFormInput from './TidyFormInput.svelte';
  import type { ComponentProps, Snippet } from 'svelte';
  import FormGroupBuilder from './FormGroupBuilder.svelte';

  type PartialBuilderProps = Partial<ComponentProps<typeof FormGroupBuilder>>;

  type Props = PartialBuilderProps & {
    field?: DataField;
    config?: FormInputConfig;
    document: any;
    disableOverriddenInputs?: boolean;
    name?: string;
    choices?: any[] | object | Function;
    children?: Snippet;
  };

  let {
    field,
    config,
    document,
    disableOverriddenInputs,
    name,
    choices,
    children,
    ...rest
  }: Props = $props();

  let builderProps = $derived.by(() => {
    let props: PartialBuilderProps = {
      ...rest,
      label: rest.label ?? field?.label ?? field?.fieldPath,
      groupClasses:
        rest.groupClasses /* TODO: do we append more classes or is this just a bonus? */,
      hidden: rest.hidden,
      hint: rest.hint ?? field?.hint,
      localize: rest.localize ?? true,
    };

    return props;
  });
</script>

<FormGroupBuilder {...builderProps}>
  {#if field && config}
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
</FormGroupBuilder>
