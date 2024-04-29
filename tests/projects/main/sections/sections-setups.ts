import { CONSTANTS } from 'src/constants';
import type { GamePage } from 'tests/poms/GamePage';
import type { DocumentRef } from 'tests/tests.types';

type SectionsRefs = {
  sectionTestCharacter: DocumentRef;
  sectionTestNpc: DocumentRef;
  sectionTestVehicle: DocumentRef;
  sectionTestOwnedContainer: DocumentRef;
};

export let sectionTestDataRefs: SectionsRefs;

export async function applySectionsSetups(gamePage: GamePage) {
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

  // Put the character's loot into their backpack
  const characterBackpack = await gamePage.page.evaluate(
    async (): Promise<DocumentRef> => {
      const character = await fromUuid(sectionTestCharacter.uuid);

      const backpack: any = Array.from(character.items).find(
        (i: any) => i.name === 'Backpack'
      );

      const backpackId = backpack.id;

      let itemUpdates: Record<string, any>[] = [];
      character.items.forEach((item: any) => {
        if (item.type === 'loot') {
          itemUpdates.push({
            _id: item.id,
            system: {
              container: backpackId,
            },
          });
        }
      });
      await character.updateEmbeddedDocuments('Item', itemUpdates);

      return {
        id: backpack.id,
        uuid: backpack.uuid,
        name: backpack.name,
      };
    }
  );

  const sectionTestVehicle = await gamePage.page.evaluate(
    async (): Promise<DocumentRef> => {
      const vehicle = await dnd5e.documents.Actor5e.create({
        name: 'Sections Test Vehicle',
        flags: {
          ['tidy5e-sheet.selected-tabs']: [CONSTANTS.TAB_ACTOR_ACTIONS],
        },
      });

      return {
        id: vehicle.id,
        uuid: vehicle.uuid,
        name: vehicle.name,
      };
    }
  );

  sectionTestDataRefs = {
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
