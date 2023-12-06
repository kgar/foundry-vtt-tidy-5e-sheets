import { ItemTabBase } from './item/ItemTabBase';

export class HandlebarsTab extends ItemTabBase {
  title: string;
  tabId: string;
  path: string;

  constructor(props?: Partial<HandlebarsTab>) {
    super();

    this.title = props?.title ?? '';
    this.path = props?.path ?? '';
    this.tabId = props?.tabId ?? '';
    this.enabled = props?.enabled;
  }

  enabled?: (context: any) => boolean;
}
