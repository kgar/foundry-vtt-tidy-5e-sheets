<script lang="ts">
  import TextInputQuadrone from 'src/components/inputs/TextInputQuadrone.svelte';
  import {
    getItemSheetContextQuadrone,
    getSheetContext,
  } from 'src/sheets/sheet-context.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getItemSheetContextQuadrone());

  let unidentified = $derived(context.system.identified === false);
  let isPlayer = $derived(!FoundryAdapter.userIsGm());
  let value = $derived(
    unidentified && isPlayer ? context.system.unidentified.name : context.name.editable,
  );
  let field = $derived(unidentified && isPlayer ? 'system.unidentified.name' : 'name');
</script>

<!-- Name -->
{#if context.unlocked}
  <TextInputQuadrone
    {field}
    document={context.item}
    {value}
    class="document-name"
    data-tooltip={context.item.name}
  />
{:else}
  <div class="document-name" data-tooltip={context.item.name}>
    <!--svelte-ignore a11y_missing_attribute-->
    <a 
      role="button"
      tabindex="0"
      data-action="copyInnerText" 
      class="cursor highlight-on-hover">
      {context.item.name}
    </a>
  </div>
{/if}
