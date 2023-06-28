<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let content: string;
  export let target: string;
  export let editable: boolean;
</script>

{@html FoundryAdapter.createEditorHtml(content, target, editable)}
