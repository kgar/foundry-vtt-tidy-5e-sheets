<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  interface Props {
    documentName: string;
    documentType: string;
    title: string;
  }
  
  const localize = FoundryAdapter.localize;

  let { documentName, documentType, title }: Props = $props();
</script>

<!-- TODO: Migrate in three tabs: Tab Visibility, Player Acccess, and Header Controls -->
<div
  class="dialog-content-container flexcol"
  data-document-name={documentName}
  data-document-type={documentType}
  aria-label={title}
>
  <h3>{localize('TIDY5E.TabConfiguration.SelectionTab.Title')}</h3>
  <div>Tab Display</div>
  <h3>{localize('TIDY5E.TabConfiguration.VisibilityTab.Title')}</h3>
  <div>User Visibility</div>
  <h3>{localize('TIDY5E.SettingsMenu.HeaderControlConfiguration.label')}</h3>
  <div>Header Controls</div>
  <!-- Then sidebar tabs just for the PC sheet -->

</div>
