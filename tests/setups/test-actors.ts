import type { Page } from '@playwright/test';
import type { TestActors } from '../test-types.ts';
import { loadText } from 'tests/utils/io.js';

export async function initializeTestActors(page: Page): Promise<TestActors> {
  const akraJson = loadText('../data/actor-akra.json');
  const ancientRedDragonJson = loadText(
    '../data/actor-ancient-red-dragon.json'
  );

  const data = {
    akraJson,
    ancientRedDragonJson,
  };

  return await page.evaluate(async ({ akraJson, ancientRedDragonJson }) => {
    const akra = await dnd5e.documents.Actor5e.create(
      {
        name: 'Test Akra',
        type: 'character',
      },
      { renderSheet: false }
    );
    await akra.importFromJSON(akraJson);

    const ancientRedDragon = await dnd5e.documents.Actor5e.create(
      {
        name: 'Test Ancient Red Dragon',
        type: 'npc',
      },
      { renderSheet: false }
    );
    await ancientRedDragon.importFromJSON(ancientRedDragonJson);

    const wagon = await dnd5e.documents.Actor5e.create(
      {
        name: 'Test Wagon',
        type: 'vehicle',
      },
      { renderSheet: false }
    );
    // TODO: import some wagon data when it is relevant

    return {
      akraId: akra.id,
      ancientRedDragonId: ancientRedDragon.id,
      wagonId: wagon.id,
    };
  }, data);
}

export async function initializeTestItems() {}
