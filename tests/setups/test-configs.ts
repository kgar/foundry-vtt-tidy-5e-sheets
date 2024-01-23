import type { Page } from '@playwright/test';

export async function applyFoundryTestConfig(page: Page) {
  await page.evaluate(async () => {
    // Make all supported sheets Tidy
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

    // Disable canvas
    await game.settings.set('core', 'noCanvas', true);

    // Ensure Tidy is activated
    const settings = game.settings.get('core', 'moduleConfiguration');
    settings['tidy5e-sheet-kgar'] = true;
    await game.settings.set('core', 'moduleConfiguration', { ...settings });
  });
}
