<script lang="ts">
  import type { FoundryDocument } from 'src/types/document';

  export let value: unknown;
  export let tooltip: string | null = null;
  export let field: string;
  export let document: FoundryDocument;
  export let dtype: string | null = null;
  export let id: string | null = null;

  function saveChange(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    }
  ) {
    document.update({
      [field]: event.currentTarget.value,
    });
  }
</script>

<select
  {id}
  data-dtype={dtype}
  {value}
  data-tooltip={tooltip}
  on:change={document && saveChange}
>
  <slot />
</select>
