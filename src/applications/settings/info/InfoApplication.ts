import SvelteFormApplicationBase from 'src/applications/SvelteFormApplicationBase';
import type { SvelteComponent } from 'svelte';
import Info from './Info.svelte';

export class InfoApplication extends SvelteFormApplicationBase {
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new Info({
      target: node,
    });
  }
}
