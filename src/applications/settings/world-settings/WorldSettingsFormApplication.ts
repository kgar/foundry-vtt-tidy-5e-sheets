import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import type { SvelteComponent } from 'svelte';
import WorldSettings from './WorldSettings.svelte';

export class WorldSettingsFormApplication extends SvelteFormApplicationBase {
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new WorldSettings({
      target: node,
    });
  }
}
