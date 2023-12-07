import type { OnRenderArgs } from './api.types';
import { ItemTabBase } from './item/ItemTabBase';

export class HandlebarsTab extends ItemTabBase {
  title: string = '';
  tabId: string = '';
  path: string = '';
  tabContentsClasses: string[] = [];

  constructor(props?: Partial<HandlebarsTab>) {
    super();

    const merged = mergeObject(this, props);
    Object.assign(this, merged);
  }

  getData?: (context: any) => any | Promise<any>;

  enabled?: (context: any) => boolean;

  onRender?: (args: OnRenderArgs & { tabContentsElement: HTMLElement }) => void;
}
