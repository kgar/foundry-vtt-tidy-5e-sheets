<script lang="ts">
  import { buildDataset } from 'src/utils/data';

  export let value: unknown;
  export let tooltip: string | null = null;
  export let field: string;
  export let document: any;
  export let id: string | null = null;
  export let dataset: Record<string, unknown> | null = null;
  export let title: string | null = null;
  export let disabled: boolean = false;

  $: draftValue = value?.toString() ?? '';
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

    draftValue = value?.toString() ?? '';
  }
</script>

<select
  {id}
  bind:value={draftValue}
  data-tooltip={tooltip}
  on:change={document && saveChange}
  {title}
  {...datasetAttributes}
  {disabled}
>
  <slot />
</select>
