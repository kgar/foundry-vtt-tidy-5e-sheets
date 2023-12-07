import type { OnRenderArgs } from '../api.types';

export abstract class ItemTabBase {
  abstract title: string;
  abstract tabId: string;
  abstract enabled?: (context: any) => boolean;
  abstract onRender?: (
    args: OnRenderArgs & { tabContentsElement: HTMLElement }
  ) => void;
  abstract tabContentsClasses?: string[];
}
