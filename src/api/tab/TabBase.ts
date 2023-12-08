import type { OnRenderArgs, RenderScheme } from '../api.types';

export abstract class TabBase {
  abstract title: string;
  abstract tabId: string;
  abstract renderScheme: RenderScheme;
  abstract enabled?: (context: any) => boolean;
  abstract onRender?: (
    args: OnRenderArgs & { tabContentsElement: HTMLElement }
  ) => void;
  abstract tabContentsClasses?: string[];
}
