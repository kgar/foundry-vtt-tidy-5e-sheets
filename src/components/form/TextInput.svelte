<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';

  export let value: number | null = null;
  export let placeholder: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let tooltip: string | null = null;
  export let id: string | null = null;
  export let isFormulaEditor: boolean = false;

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
  type="text"
  {id}
  {value}
  {placeholder}
  on:change={saveChange}
  data-tooltip={tooltip}
  data-formula-editor={isFormulaEditor || null}
/>
