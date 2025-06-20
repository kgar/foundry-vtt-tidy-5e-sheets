<script lang="ts">
  import type { CoarseReactivityProvider } from 'src/features/reactivity/CoarseReactivityProvider.svelte';
    import type { ThemeSettingsContext, ThemeSettingsQuadroneApplication } from './ThemeSettingsQuadroneApplication.svelte';

  interface Props {
    app: ThemeSettingsQuadroneApplication;
    settings: CoarseReactivityProvider<ThemeSettingsContext>;
  }

  let { app, settings }: Props = $props();
</script>

<marquee>Hello, theme settings!</marquee>

{JSON.stringify(settings.data)}

<h2>
  (Localize) Colors
</h2>

Todo

<h3>
  (Localize) Rarity
</h3>

Todo

<h3>
  (Localize) Spell Preparation Mode
</h3>

Todo


<button type='button' onclick={() => app.reset()}>(Localize) Reset to Default</button>
<button type='button' onclick={() => app.apply()}>(Localize) Apply</button>
<button type='button' onclick={() => app.save()}>(Localize) Save</button>