<script lang="ts">
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetContext,
    NpcSheetContext,
    SpecialTraits,
  } from 'src/types/types';

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  let flags = $derived(context.flags);

  let headerEl = document.createElement('h1');
  headerEl.innerHTML = 'Hello, world!';
</script>

<div class="scroll-container">
  {#key context}
    {#each flags.sections as section}
      <fieldset>
        <legend>{section.label}</legend>
        {#each section.fields as field}
          <!-- TODO: Make a svelte component that can process DataField subclasses and churn out Tidy inputs and Tidy-style form group class structures. -->
          {@const element = field.field.toFormGroup({
            localize: true,
          }).outerHTML}
          {@html element}
        {/each}
      </fieldset>
    {/each}
  {/key}
</div>
