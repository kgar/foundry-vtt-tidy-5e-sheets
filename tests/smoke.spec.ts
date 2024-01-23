import { test, expect, type Page } from '@playwright/test';
import { delay } from 'src/utils/asynchrony';

let page: Page;
test.beforeAll(async ({ browser }) => {
  test.setTimeout(1000 * 60 * 10);

  page = await browser.newPage();
  await page.goto(process.env.BASE_URL ?? '');

  if (page.url().endsWith('join')) {
    await page.locator('button[name="shutdown"]').waitFor({ state: 'visible' });

    if (await page.isVisible('[name="adminPassword"]')) {
      await page.fill(
        '[name="adminPassword"]',
        process.env.ADMIN_PASSWORD ?? ''
      );
    }

    await page.click('button[name="shutdown"]');

    await page.goto(`${process.env.BASE_URL}/auth` ?? '');
  }

  await page.fill('[name="adminPassword"]', process.env.ADMIN_PASSWORD ?? '');
  await page.click('button[value="adminAuth"]');

  await page.click('.tour-center-step [data-action="exit"]');

  await page.getByText('Game Worlds').click();

  // Delete test world if it exists
  const worldExists = await page.isVisible(
    '[data-package-id="automated-testing"]'
  );
  if (worldExists) {
    await page.click('[data-package-id="automated-testing"]', {
      button: 'right',
    });
    await page.getByText('Delete World').click();

    const deleteWorldRef =
      (await page.evaluate(() => {
        return document
          .querySelector('[id="delete-confirm"]')
          ?.getAttribute('placeholder');
      })) ?? '';

    await page.fill('[id="delete-confirm"]', deleteWorldRef);

    await page.click('[data-button="yes"]');
  }

  // Create test world
  await page.getByText('Create World').click();
  await page.fill('form [name="title"]', 'Automated Testing');
  await page.selectOption('form [name="system"]', { value: 'dnd5e' });
  await page.click('#world-config [type="submit"]');
  await page
    .locator('[data-package-id="automated-testing"]')
    .waitFor({ state: 'visible' });
  await page.hover('[data-package-id="automated-testing"]');
  await page.click(
    '[data-package-id="automated-testing"] [data-action="worldLaunch"]'
  );

  // Log in as gamemaster
  await page.locator('[name="userid"]').waitFor({ state: 'visible' });
  const userIdSelect = page.locator('[name="userid"]');
  await userIdSelect.selectOption({ label: 'Gamemaster' });
  // Trigger the needed change detection in Foundry so we can log in.
  await userIdSelect.click({ delay: 100 });
  await userIdSelect.click({ delay: 100 });
  await page.locator('[name="join"]').click({ delay: 150 });

  // Ensure Tidy is active
  await page.locator('[id="chat-message"]').waitFor({ state: 'visible' });

  const inGameTourCloseAction = page.locator(
    '.tour-center-step [data-action="exit"]'
  );
  if (await inGameTourCloseAction.isVisible()) {
    await inGameTourCloseAction.click();
  }

  const tidyIsActive = await isTidyActive(page);
  if (!tidyIsActive) {
    await page.evaluate(() => {
      new ModuleManagement().render(true);
    });
    const kgarModuleCheckbox = page.locator(
      '[id="module-management"] [name="tidy5e-sheet-kgar"]'
    );
    kgarModuleCheckbox.waitFor({ state: 'visible' });
    await kgarModuleCheckbox.setChecked(true);
    await page.click('[id="module-management"] [type="submit"]');
    await page.click('[data-button="yes"]');
    await delay(3000);
  }

  await page.locator('[id="chat-message"]').waitFor({ state: 'visible' });
  await page.click('[aria-label="Clear Chat Log"]');
  await page.click('[data-button="yes"]');

  // Set default sheets to Tidy
  await page.evaluate(async () => {
    await game.settings.set('core', 'sheetClasses', {
      Actor: {
        character: 'dnd5e.Tidy5eCharacterSheet',
        npc: 'dnd5e.Tidy5eNpcSheet',
        vehicle: 'dnd5e.Tidy5eVehicleSheet',
      },
      Item: {
        weapon: 'dnd5e.Tidy5eKgarItemSheet',
        equipment: 'dnd5e.Tidy5eKgarItemSheet',
        consumable: 'dnd5e.Tidy5eKgarItemSheet',
        tool: 'dnd5e.Tidy5eKgarItemSheet',
        loot: 'dnd5e.Tidy5eKgarItemSheet',
        race: 'dnd5e.Tidy5eKgarItemSheet',
        background: 'dnd5e.Tidy5eKgarItemSheet',
        class: 'dnd5e.Tidy5eKgarItemSheet',
        subclass: 'dnd5e.Tidy5eKgarItemSheet',
        spell: 'dnd5e.Tidy5eKgarItemSheet',
        feat: 'dnd5e.Tidy5eKgarItemSheet',
        backpack: 'dnd5e.Tidy5eKgarItemSheet',
      },
    });
  });

  // TODO: Clear and set up actor/item data
});

test('tidy 5e sheets are active', async () => {
  expect(await isTidyActive(page)).toBeTruthy();
});

async function isTidyActive(page: Page) {
  return await page.evaluate(() => {
    return game.modules.get('tidy5e-sheet-kgar')?.active === true;
  });
}
