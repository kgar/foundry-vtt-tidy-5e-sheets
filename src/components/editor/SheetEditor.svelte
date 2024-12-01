<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    /**
     * The HTML to render or to edit.
     */
    content: string;
    /**
     * The data field to update via form post, which will be applied to the entity the form represents (e.g., to the Actor).
     */
    target: string;
    /**
     * Whether or not the editor is editable or readonly.
     */
    editable: boolean;
  }

  let { content, target, editable }: Props = $props();
</script>

{@html FoundryAdapter.createEditorHtml(content, target, editable)}
