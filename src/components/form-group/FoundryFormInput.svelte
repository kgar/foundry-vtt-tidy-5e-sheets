<script lang="ts">
  import type { DataField, FormInputConfig } from 'foundry.data.fields';

  type Props = {
    field: DataField;
    options: FormInputConfig;
  };

  let { field, options }: Props = $props();

  let inputs: HTMLElement[] = $derived.by(() => {
    let result = field.toInput(options);

    return result instanceof HTMLCollection
      ? (Array.from(result) as HTMLElement[])
      : [result];
  });
</script>

{#each inputs as input}
  {@html input.outerHTML}
{/each}
