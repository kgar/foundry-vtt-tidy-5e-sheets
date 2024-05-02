import test from '@playwright/test';
import {
  sectionTestDataProvider,
  type SectionsTestData,
} from './sections-test-data';

export const sectionsTest = test.extend<object, { data: SectionsTestData }>({
  data: [
    async ({}, use) => {
      const data = sectionTestDataProvider.get();
      await use(data);
    },
    { scope: 'worker' },
  ],
});
