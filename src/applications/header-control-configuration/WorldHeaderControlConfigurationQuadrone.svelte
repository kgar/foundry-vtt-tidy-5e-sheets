<script lang="ts">
  import type {
    WorldHeaderControlConfigContext,
    WorldHeaderControlConfigurationQuadroneApplication,
  } from './WorldHeaderControlConfigurationQuadroneApplication.svelte';

  interface Props {
    app: WorldHeaderControlConfigurationQuadroneApplication;
    config: WorldHeaderControlConfigContext;
  }

  let { config = $bindable(), app }: Props = $props();
</script>
