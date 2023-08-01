<script lang="ts">
    import type { FoundryDocument } from "src/types/document";

  export let value: number | null = null;
  export let step: string = 'any';
  export let placeholder: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let tooltip: string | null = null;

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    document.update({
      [field]: event.currentTarget.value,
    });
  }
</script>

<input
  type="number"
  {step}
  {value}
  {placeholder}
  on:change={saveChange}
  data-tooltip={tooltip}
/>
