import type { SvelteComponent } from 'svelte';
import { Tidy5eContainerSheetClassic } from '../classic/Tidy5eContainerSheetClassic';
import { CONSTANTS } from 'src/constants';
import ContainerSheet from './container/ContainerSheet.svelte';

export class Tidy5eContainerSheetHightouch extends Tidy5eContainerSheetClassic {
  _createComponent(node: HTMLElement): SvelteComponent<any, any, any> {
    const context = new Map<any, any>([
      [CONSTANTS.SVELTE_CONTEXT.CONTEXT, this._store],
    ]);

    const component = new ContainerSheet({
      target: node,
      context: context,
    });

    return component;
  }
}
