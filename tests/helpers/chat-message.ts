import type { Page } from '@playwright/test';

export class ChatMessageHelpers {
  static async clearChatMessages(page: Page) {
    await page.evaluate(() => {
      CONFIG.ChatMessage.documentClass.deleteDocuments([], { deleteAll: true });
    });
  }
}
