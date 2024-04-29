import { test, expect, type Page } from '@playwright/test';
import type { TestData } from './test-types';
//import { applyFoundryTestConfig } from './projects/setup/world-config';
// import { initializeTestActors } from './setups/test-actors';
import { ChatMessageHelpers } from './helpers/chat-message';

let page: Page;
let testData: TestData;



// test.beforeAll(async ({ browser }) => {
//   const context = await browser.newContext({
//     viewport: {
//       width: 1920,
//       height: 1080,
//     },
//   });

//   test.setTimeout(1000 * 60 * 10);

//   page = await context.newPage();
//   await page.goto(process.env.BASE_URL ?? '');

//   if (page.url().endsWith('join')) {
//     await page.locator('button[name="shutdown"]').waitFor({ state: 'visible' });

//     if (await page.isVisible('[name="adminPassword"]')) {
//       await page.fill(
//         '[name="adminPassword"]',
//         process.env.ADMIN_PASSWORD ?? ''
//       );
//     }

//     await page.click('button[name="shutdown"]');

//     await page.goto(`${process.env.BASE_URL}/auth` ?? '');
//   }

//   await page.fill('[name="adminPassword"]', process.env.ADMIN_PASSWORD ?? '');
//   await page.click('button[value="adminAuth"]');

//   await page.click('.tour-center-step [data-action="exit"]');

//   await page.getByText('Game Worlds').click();

//   // Delete test world if it exists
//   const worldExists = await page.isVisible(
//     '[data-package-id="automated-testing"]'
//   );
//   if (worldExists) {
//     await page.click('[data-package-id="automated-testing"]', {
//       button: 'right',
//     });
//     await page.getByText('Delete World').click();

//     const deleteWorldRef =
//       (await page.evaluate(() => {
//         return document
//           .querySelector('[id="delete-confirm"]')
//           ?.getAttribute('placeholder');
//       })) ?? '';

//     await page.fill('[id="delete-confirm"]', deleteWorldRef);

//     await page.click('[data-button="yes"]');
//   }

//   // Create test world
//   await page.getByText('Create World').click();
//   await page.fill('form [name="title"]', 'Automated Testing');
//   await page.selectOption('form [name="system"]', { value: 'dnd5e' });
//   await page.click('#world-config [type="submit"]');
//   await page
//     .locator('[data-package-id="automated-testing"]')
//     .waitFor({ state: 'visible' });
//   await page.hover('[data-package-id="automated-testing"]');
//   await page.click(
//     '[data-package-id="automated-testing"] [data-action="worldLaunch"]'
//   );

//   // Log in as gamemaster
//   await page.locator('[name="userid"]').waitFor({ state: 'visible' });
//   const userIdSelect = page.locator('[name="userid"]');
//   await userIdSelect.selectOption({ label: 'Gamemaster' });
//   // Trigger the needed change detection in Foundry so we can log in.
//   await userIdSelect.click({ delay: 100 });
//   await userIdSelect.click({ delay: 100 });
//   await page.locator('[name="join"]').click({ delay: 150 });

//   // Ensure Tidy is active
//   await page.locator('[id="chat-message"]').waitFor({ state: 'visible' });

//   try {
//     const inGameTourCloseAction = page.locator(
//       '.tour-center-step [data-action="exit"]'
//     );
//     await inGameTourCloseAction.click({ timeout: 2500 });
//   } catch (e) {
//     // ignore, because it may not be here.
//   }

//   await applyFoundryTestConfig(page);
//   await page.reload();

//   await page.locator('[id="chat-message"]').waitFor({ state: 'visible' });
//   await ChatMessageHelpers.clearChatMessages(page);

//   const testActorData = await initializeTestActors(page);
//   testData = { ...testActorData };

//   expect(await isTidyActive(page)).toBeTruthy();
// });

// test.beforeEach(async () => {
//   await ChatMessageHelpers.clearChatMessages(page);
// });

// test('smoke test: roll strength check', async () => {
//   await page.evaluate((testData) => {
//     game.actors.get(testData.akraId).sheet.render(true);
//   }, testData);

//   await page
//     .locator('[data-ability="str"] [data-tidy-sheet-part="ability-roller"]')
//     .click();

//   await page.locator('[data-button="test"]').click();

//   const testRollId = crypto.randomUUID();
//   await page.fill('[name="bonus"]', `0[${testRollId}]`);
//   await page.locator('[data-button="advantage"]').click();

//   await page.locator('a[data-tab="chat"]').click();

//   const testRoll = page.locator(
//     `[id="chat-log"] [data-message-id]:has-text("${testRollId}")`
//   );

//   expect(await testRoll.count()).toBe(1);
//   expect(await testRoll.innerText()).toContain('Strength Ability Check');
// });

// async function isTidyActive(page: Page) {
//   return await page.evaluate(() => {
//     return game.modules.get('tidy5e-sheet')?.active === true;
//   });
// }


