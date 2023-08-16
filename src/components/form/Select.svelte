<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';
  import { buildDataset } from 'src/utils/data';

  export let value: unknown;
  export let tooltip: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let dtype: string | null = null;
  export let id: string | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let title: string | null = null;

  $: datasetAttributes = buildDataset(dataset);

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    }
  ) {
    const targetValue = event.currentTarget.value;

    document.update({
      [field]: targetValue !== '' ? targetValue : null,
    });
  }
</script>

<select
  {id}
  data-dtype={dtype}
  value={value?.toString() ?? ''}
  data-tooltip={tooltip}
  on:change={document && saveChange}
  {title}
  {...datasetAttributes}
>
  <slot />
</select>
