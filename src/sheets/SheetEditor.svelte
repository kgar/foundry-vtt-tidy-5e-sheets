<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { onMount } from 'svelte';

  /**
   * The HTML to render or to edit.
   */
  export let content: string;
  /**
   * The data field to update via form post, which will be applied to the entity the form represents (e.g., to the Actor).
   */
  export let target: string;
  /**
   * Whether or not the editor is editable or readonly.
   */
  export let editable: boolean;

  /**
   * Optional header text to inject as the first child of the editor, as a `h2` tag.
   */
  export let headerDetailsText: string | null = null;

  const headerId: string = foundry.utils.randomID();

  onMount(() => {
    const editor = document.getElementById(headerId)?.nextElementSibling;

    if (!editor || editor.childElementCount === 0) {
      return;
    }

    const detailsHeaderNode = document.createElement('h2');
    detailsHeaderNode.classList.add('details-headline');
    detailsHeaderNode.textContent = headerDetailsText;
    editor.insertBefore(detailsHeaderNode, editor.firstElementChild);
  });
</script>

<div
  id={headerId}
  class="hidden header-details-content-container"
  aria-hidden="true"
/>

{@html FoundryAdapter.createEditorHtml(content, target, editable)}
