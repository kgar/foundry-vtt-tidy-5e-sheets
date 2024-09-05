<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { getContext, onMount } from 'svelte';
  import type { Readable } from 'svelte/store';

  type EditorOptions =
    any /*foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig*/;
  type EnrichOptions = any /*TextEditor.EnrichmentOptions*/;

  export let field: string;
  export let content: string;
  export let editorOptions: EditorOptions = {};

  const context: any = getContext<Readable<any>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  // Build Options
  editorOptions = foundry.utils.mergeObject(
    {
      name: field,
      collaborate: false,
      compact: false,
      documentUUID: $context.document.uuid,
      editable: true,
      height: 200,
      toggled: true,
      value: content,
    },
    editorOptions,
  ) as EditorOptions;

  let proseMirrorElem: HTMLElement;

  // Create Editor element and assign it
  onMount(() => {
    const element = foundry.applications.elements.HTMLProseMirrorElement.create(
      foundry.utils.mergeObject(editorOptions, { enriched: content }),
    );

    proseMirrorElem.innerHTML = element.outerHTML;
  });
</script>

<div class={$$restProps.class ?? ''} bind:this={proseMirrorElem}></div>

<style lang="scss">
</style>
