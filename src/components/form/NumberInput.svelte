<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';

  export let value: number | null = null;
  export let step: string = 'any';
  export let placeholder: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let tooltip: string | null = null;
  export let min: string | number | null | undefined = null;
  export let max: string | number | null | undefined = null;
  export let id: string | null = null;
  export let disabled: boolean | null = null;

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    const value = parseFloat(event.currentTarget.value);

    document.update({
      [field]: !isNaN(value) ? value : null,
    });
  }
</script>

<input
  type="number"
  {id}
  {step}
  {value}
  {min}
  {max}
  {placeholder}
  on:change={saveChange}
  data-tooltip={tooltip}
  {disabled}
/>
