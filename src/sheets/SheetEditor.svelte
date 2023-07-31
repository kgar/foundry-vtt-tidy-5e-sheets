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
</script>

{@html FoundryAdapter.createEditorHtml(content, target, editable)}
