<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { SettingsFooterHost } from './settings-pane.types';

  interface Props {
    host: SettingsFooterHost;
  }

  let { host }: Props = $props();

  const localize = FoundryAdapter.localize;

  // The host owns scope + enablement: a composite dialog may scope Undo / Use
  // Global Defaults to the active page, while another host applies them to the
  // whole dialog. Save persists everything and is primary only when dirty.
</script>

<div class="button-bar">
  <button
    type="button"
    class="button button-secondary button-large use-default-btn"
    disabled={!host.canUseDefault}
    onclick={() => host.useDefault()}
  >
    <i class="fas fa-rotate-left"></i>
    {localize(host.useDefaultLabel ?? 'TIDY5E.UseGlobalDefaults')}
  </button>
  <button
    type="button"
    class="button button-secondary button-large undo-changes-btn"
    onclick={() => host.canUndo ? host.undoChanges() : undefined}
  >
    <i class="fas fa-arrow-rotate-left"></i>
    {localize('TIDY5E.UndoChanges')}
  </button>
  <button
    type="button"
    class={[
      'button button-large button-save save-changes-btn',
      host.hasChanges ? 'button-primary' : 'button-secondary',
    ]}
    onclick={() => host.save()}
  >
    <i class="fas fa-save"></i>
    {localize('TIDY5E.SaveChanges')}
  </button>
</div>
