<script lang="ts">
  import SpellSourceItemAssignmentsV2 from 'src/applications/spell-source-item-assignments/SpellSourceItemAssignmentsV2.svelte';
  import type { SpellSourceItemAssignmentsSettingsEditor } from 'src/settings/editors/spell-source-item-assignments-settings-editor.svelte';

  interface Props {
    app: SpellSourceItemAssignmentsSettingsEditor;
  }

  let { app }: Props = $props();
</script>

<SpellSourceItemAssignmentsV2 actor={app.document} config={app.value} />
