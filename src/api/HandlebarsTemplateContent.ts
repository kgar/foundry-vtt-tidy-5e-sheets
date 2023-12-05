import { error } from 'src/utils/logging';

export class HandlebarsTemplateContent {
  path: string;

  constructor(props: Partial<HandlebarsTemplateContent>) {
    this.path = props?.path ?? '';
  }

  async render(data: any) {
    try {
      return await renderTemplate(this.path, data);
    } catch (e) {
      error('Failed to render handlebars template', false, e);
      return '';
    }
  }
}
