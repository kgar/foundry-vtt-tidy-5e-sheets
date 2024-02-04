import type { SvelteComponent } from 'svelte';
import SvelteFormApplicationBase from '../SvelteFormApplicationBase';
import Migrations from './Migrations.svelte';

export class MigrationsApplication extends SvelteFormApplicationBase {
  createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    return new Migrations({
      target: node,
      context: new Map<any, any>([['confirm', this.confirm]]),
    });
  }

  confirm(onYes: () => void) {
    const dlg = new Dialog({
      title: `Test`,
      content: 'To Do: Put some content here.',
      buttons: {
        yes: {
          icon: '<i class="fas fa-right-left"></i>',
          label: 'Localize Migrate',
          callback: () => {
            onYes();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: 'Localize cancel',
        },
      },
      default: 'yes',
      close: () => {},
    });
    dlg.render(true);
  }
}
