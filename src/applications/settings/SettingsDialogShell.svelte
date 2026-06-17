<script lang="ts">
  import type { Component } from 'svelte';
  import SettingsFooter from './SettingsFooter.svelte';
  import type { SettingsFooterHost } from './settings-pane.types';

  interface Props {
    host: SettingsFooterHost;
    /** The settings content component to render above the footer. */
    pane: Component<any>;
    paneProps: Record<string, any>;
  }

  let { host, pane: Pane, paneProps }: Props = $props();
</script>

<Pane {...paneProps} />
<SettingsFooter {host} />
