import test, { type Page } from '@playwright/test';
import {
  sectionTestDataProvider,
  type SectionsTestData,
} from './sections-test-data';
import { PageHelper } from 'tests/utils/PageHelper';

export const sectionsTest = test.extend<
  object,
  { data: SectionsTestData; sectionPage: Page }
>({
  data: [
    async ({}, use) => {
      const data = sectionTestDataProvider.get();
      await use(data);
    },
    { scope: 'worker' },
  ],
  sectionPage: [
    async ({ browser }, use) => {
      let page = await browser.newPage();
      await PageHelper.routeToTestGame(page);
      await use(page);
      await page.close();
    },
    { scope: 'worker' },
  ],
});
