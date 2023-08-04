<script lang="ts">
  import type { ItemSheetContext } from 'src/types/item';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let field: string | null = null;
  export let labelText: string | null = null;
  export let cssClass: string = '';

  $: inputId =
    field !== null ? `${$store.appId}-${field.replaceAll('.', '-')}` : null;

  let store = getContext<Readable<ItemSheetContext>>('store');
</script>

<div class="form-group {cssClass}">
  {#if labelText !== null}
    <label for={inputId}>{labelText} <slot name="inside-after-label" /></label>
  {/if}
  <slot {inputId} />
</div>
