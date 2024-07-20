<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import type { ItemSheetContext } from 'src/types/item.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let field: string | null = null;
  export let labelText: string | null = null;
  export let cssClass: string = '';

  $: inputId =
    field !== null ? `${$context.appId}-${field.replaceAll('.', '-')}` : null;

  let context = getContext<Readable<ItemSheetContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );
</script>

<div class="form-group {cssClass}" data-form-group-for={field ?? null}>
  {#if labelText !== null}
    <label for={inputId}>{labelText} <slot name="inside-after-label" /></label>
  {/if}
  <slot {inputId} />
</div>
