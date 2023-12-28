import type { OnRenderParams, RenderScheme } from '../api.types';

export class HtmlContent {
  html: string = '';
  renderScheme: RenderScheme = 'handlebars';
  tabContentsClasses: string[] = [];
  activateDefaultSheetListeners?: boolean | undefined;

  enabled?: (context: any) => boolean;

  onRender?: (params: OnRenderParams) => void;
}
