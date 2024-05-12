import { CONSTANTS } from 'src/constants';
import { TestDataProvider } from 'tests/TestDataProvider';
import type { GamePage } from 'tests/poms/GamePage';
import type { DocumentRef } from 'tests/tests.types';

export type SectionsTestData = {
  sectionConfigTestCharacter: DocumentRef;
  sectionConfigTestNpc: DocumentRef;
  sectionConfigTestVehicle: DocumentRef;
  sectionTestCharacter: DocumentRef;
  sectionTestNpc: DocumentRef;
  sectionTestVehicle: DocumentRef;
  sectionTestOwnedContainer: DocumentRef;
};

export const sectionTestDataProvider = new TestDataProvider<SectionsTestData>(
  'SectionsTestData',
  initSectionsData
);

export async function initSectionsData(
  gamePage: GamePage
): Promise<SectionsTestData> {
  const sectionTestCharacter = await gamePage.importStarterHero('Akra', {
    name: 'Sections Test Character',
    flags: {
      ['tidy5e-sheet.selected-tabs']: [
        CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
        CONSTANTS.TAB_CHARACTER_INVENTORY,
        CONSTANTS.TAB_CHARACTER_SPELLBOOK,
        CONSTANTS.TAB_CHARACTER_FEATURES,
        CONSTANTS.TAB_ACTOR_ACTIONS,
      ],
    },
  });

  const characterBackpack = await gamePage.page.evaluate(
    async ({ sectionTestCharacter }): Promise<DocumentRef> => {
      const character = await fromUuid(sectionTestCharacter.uuid);

      const backpack: any = Array.from(character.items).find(
        (i: any) => i.name === 'Backpack'
      );

      // TODO: Put a brand new instance of each item type in the backpack

      // const backpackId = backpack.id;

      // const itemUpdates: Record<string, any>[] = [];
      // character.items.forEach((item: any) => {
      //   if (item.type === 'loot') {
      //     itemUpdates.push({
      //       _id: item.id,
      //       system: {
      //         container: backpackId,
      //       },
      //     });
      //   }
      // });
      // await character.updateEmbeddedDocuments('Item', itemUpdates);

      return {
        id: backpack.id,
        uuid: backpack.uuid,
        name: backpack.name,
      };
    },
    { sectionTestCharacter }
  );

  const sectionTestVehicle = await gamePage.page.evaluate(
    async ({ constants }): Promise<DocumentRef> => {
      const vehicle = await dnd5e.documents.Actor5e.create({
        name: 'Sections Test Vehicle',
        type: 'vehicle',
        flags: {
          ['tidy5e-sheet.selected-tabs']: [constants.TAB_ACTOR_ACTIONS],
        },
      });

      return {
        id: vehicle.id,
        uuid: vehicle.uuid,
        name: vehicle.name,
      };
    },
    { constants: CONSTANTS }
  );

  const sectionConfigTestCharacter = await gamePage.page.evaluate(
    async ({ constants }): Promise<DocumentRef> => {
      const actor = await dnd5e.documents.Actor5e.create({
        name: 'Section Config Test Character',
        type: constants.SHEET_TYPE_CHARACTER,
        flags: {
          ['tidy5e-sheet.selected-tabs']: [
            constants.TAB_CHARACTER_ATTRIBUTES,
            constants.TAB_CHARACTER_INVENTORY,
            constants.TAB_CHARACTER_SPELLBOOK,
            constants.TAB_CHARACTER_FEATURES,
            constants.TAB_ACTOR_ACTIONS,
          ],
        },
      });

      return {
        id: actor.id,
        uuid: actor.uuid,
        name: actor.name,
      };
    },
    { constants: CONSTANTS }
  );

  const sectionConfigTestNpc = await gamePage.page.evaluate(
    async ({ constants }): Promise<DocumentRef> => {
      const actor = await dnd5e.documents.Actor5e.create({
        name: 'Section Config Test NPC',
        type: constants.SHEET_TYPE_NPC,
        flags: {
          ['tidy5e-sheet.selected-tabs']: [
            constants.TAB_NPC_ABILITIES,
            constants.TAB_NPC_SPELLBOOK,
            constants.TAB_ACTOR_ACTIONS,
          ],
        },
      });

      return {
        id: actor.id,
        uuid: actor.uuid,
        name: actor.name,
      };
    },
    { constants: CONSTANTS }
  );

  const sectionConfigTestVehicle = await gamePage.page.evaluate(
    async ({ constants }): Promise<DocumentRef> => {
      const actor = await dnd5e.documents.Actor5e.create({
        name: 'Section Config Test Vehicle',
        type: constants.SHEET_TYPE_VEHICLE,
        flags: {
          ['tidy5e-sheet.selected-tabs']: [
            constants.TAB_NPC_ABILITIES,
            constants.TAB_NPC_SPELLBOOK,
            constants.TAB_ACTOR_ACTIONS,
          ],
        },
      });

      return {
        id: actor.id,
        uuid: actor.uuid,
        name: actor.name,
      };
    },
    { constants: CONSTANTS }
  );

  return {
    sectionConfigTestCharacter,
    sectionConfigTestNpc,
    sectionConfigTestVehicle,
    sectionTestCharacter: sectionTestCharacter,
    sectionTestNpc: await gamePage.importMonster('Lich', {
      name: 'Sections Test NPC',
      flags: {
        ['tidy5e-sheet.selected-tabs']: [
          CONSTANTS.TAB_NPC_ABILITIES,
          CONSTANTS.TAB_NPC_SPELLBOOK,
          CONSTANTS.TAB_ACTOR_ACTIONS,
        ],
      },
    }),
    sectionTestVehicle: sectionTestVehicle,
    sectionTestOwnedContainer: characterBackpack,
  };
}
