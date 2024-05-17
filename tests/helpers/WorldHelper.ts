import type { Page } from '@playwright/test';
import type { DocumentRef } from 'tests/tests.types';

export type WorldHelperItemCreationArgs = {
  name: string;
  type: string;
} & Record<string, any>;

export class WorldHelper {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async createItem(
    documentData: WorldHelperItemCreationArgs
  ): Promise<DocumentRef> {
    return await this.page.evaluate(
      async ({ documentData }): Promise<DocumentRef> => {
        const item = await dnd5e.documents.Item5e.create(documentData);
        return {
          id: item.id,
          uuid: item.uuid,
          name: item.name,
        };
      },
      { documentData }
    );
  }
}
