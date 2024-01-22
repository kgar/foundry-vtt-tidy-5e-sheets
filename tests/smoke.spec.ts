import { test, expect, type Page } from '@playwright/test';

test.beforeAll(async ({ browser }) => {
  let page = await browser.newPage();
  await page.goto('http://localhost:30001/');

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
  if (page.url().endsWith('setup')) {
    await page.getByText('Create World').click();
    await page.fill('form [name="title"]', 'Automated Testing');
    await page.selectOption('form [name="system"]', { value: 'dnd5e' });
    await page.getByText('Create World').click();
    await page.waitForSelector('[data-package-id="automated-testing"]');
    await page.click(
      '[data-package-id="automated-testing"] [data-action="worldLaunch"]'
    );
  }

  // Log in as gamemaster
  await page.selectOption('[name="userid"]', { label: 'Gamemaster' });
  await page.click('[type="submit"]');

  // Ensure Tidy is active
  const tidyIsActive = await isTidyActive(page);
  if (!tidyIsActive) {
    await page.evaluate(() => {
      new ModuleManagement().render(true);
    });
    await page.setChecked(
      '[id="module-list"] [name="tidy5e-sheet-kgar"]',
      true
    );
    await page.click('[id="module-list"] [type="submit"]');
    await page.click('[data-button="yes"]');
  }

  await page.waitForSelector('.vtt.game.system-dnd5e');
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

test('tidy 5e sheets are active', async ({ page }) => {
  expect(await isTidyActive(page)).toBeTruthy();
});

async function isTidyActive(page: Page) {
  return await page.evaluate(() => {
    return game.modules.get('tidy5e-sheet-kgar')?.active === true;
  });
}
