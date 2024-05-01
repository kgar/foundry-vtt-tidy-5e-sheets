import type { Page } from '@playwright/test';

export async function establishTestLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.setItem(
      'core.tourProgress',
      JSON.stringify({ core: { backupsOverview: 0, welcome: 0 } })
    );
    localStorage.setItem('core.noCanvas', 'true');
  });
}
