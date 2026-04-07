<script lang="ts">
  import { getContext, onMount, tick } from 'svelte';

  type EditorOptions =
    any /*foundry.applications.elements.HTMLProseMirrorElement.ProseMirrorInputConfig*/;

  interface Props {
    field: string;
    content: string;
    enriched?: string | null;
    editorOptions?: EditorOptions;
    documentUuid: string;
    onSave?: () => void;
    [key: string]: any;
  }

  let {
    field,
    content,
    enriched = null,
    editorOptions = {},
    documentUuid,
    onSave,
    host,
    ...rest
  }: Props = $props();

  let proseMirrorContainerEl = $state<HTMLElement | undefined>();

  let actualEditorOptions: EditorOptions = $derived(
    foundry.utils.mergeObject(
      {
        name: field,
        collaborate: false,
        compact: false,
        documentUUID: documentUuid,
        editable: true,
        height: 200,
        toggled: true,
        value: content,
        enriched: enriched ?? content,
      },
      editorOptions,
    ) as EditorOptions,
  );

  function onEditorActivation(node: HTMLElement) {
    node.addEventListener('save', async () => {
      await tick();
      onSave?.();
    });
  }
</script>

<div
  style="display: contents;"
  class={rest.class ?? ''}
  bind:this={proseMirrorContainerEl}
  use:onEditorActivation
>
  <prose-mirror
    name={actualEditorOptions.name}
    value={actualEditorOptions.value}
    document-uuid={actualEditorOptions.documentUuid}
    height={actualEditorOptions.height}
    toggled={actualEditorOptions.toggled}
    enriched={actualEditorOptions.enriched}
    editable={actualEditorOptions.editable}
    compact={actualEditorOptions.compact}
  ></prose-mirror>
</div>
