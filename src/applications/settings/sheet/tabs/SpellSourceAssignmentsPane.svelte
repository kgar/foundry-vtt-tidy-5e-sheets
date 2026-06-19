<script lang="ts">
  import SpellSourceItemAssignmentsQuadrone from 'src/applications/settings/spell-source-item-assignments/SpellSourceItemAssignmentsQuadrone.svelte';
  import type { SpellSourceItemAssignmentsSettingsEditor } from 'src/settings/editors/spell-source-item-assignments-settings-editor.svelte';

  interface Props {
    app: SpellSourceItemAssignmentsSettingsEditor;
  }

  let { app }: Props = $props();
</script>

<SpellSourceItemAssignmentsQuadrone actor={app.document} config={app.value} />
