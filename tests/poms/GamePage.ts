import type { Page } from '@playwright/test';
import { JoinPage } from './JoinPage';
import { SetupPage } from './SetupPage';
import { CONSTANTS } from 'src/constants';
import { Tidy5eCharacterSheet } from 'src/sheets/Tidy5eCharacterSheet';
import { Tidy5eKgarContainerSheet } from 'src/sheets/Tidy5eContainerSheet';
import { Tidy5eKgarItemSheet } from 'src/sheets/Tidy5eItemSheet';
import { Tidy5eVehicleSheet } from 'src/sheets/Tidy5eKgarVehicleSheet';
import { Tidy5eNpcSheet } from 'src/sheets/Tidy5eNpcSheet';
import type { DocumentRef } from '../tests.types';
import type { Actor5e } from 'src/types/types';
import type { Item5e } from 'src/types/item.types';

export class GamePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async isReady() {
    await this.page.waitForFunction(() => !!game?.ready);
  }

  async logOut() {
    await this.page.evaluate(() => game.logOut());
    const joinPage = new JoinPage(this.page);
    await joinPage.isReady();
    return joinPage;
  }

  async returnToSetup() {
    await this.page.evaluate(() => game.shutDown());
    const setupPage = new SetupPage(this.page);
    await setupPage.isReady();
    return setupPage;
  }

  async applyTestConfiguration() {
    await this.page.evaluate(async () => {
      // Make all supported sheets Tidy
      await game.settings.set('core', 'sheetClasses', {
        Actor: {
          character: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eCharacterSheet.name}`,
          npc: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eNpcSheet.name}`,
          vehicle: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eVehicleSheet.name}`,
        },
        Item: {
          weapon: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          equipment: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          consumable: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          container: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarContainerSheet.name}`,
          tool: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          loot: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          race: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          background: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          class: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          subclass: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          spell: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          feat: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
          backpack: `${CONSTANTS.DND5E_SYSTEM_ID}.${Tidy5eKgarItemSheet.name}`,
        },
      });

      // Disable canvas
      await game.settings.set('core', 'noCanvas', true);

      // Ensure Tidy is activated
      const settings = game.settings.get('core', 'moduleConfiguration');
      settings['tidy5e-sheet'] = true;
      await game.settings.set('core', 'moduleConfiguration', { ...settings });
    });
  }

  async importStarterHero(
    startsWithName: string,
    overrides: Record<string, any> = {}
  ): Promise<DocumentRef> {
    return this.importActorFromCompendium(
      `${CONSTANTS.DND5E_SYSTEM_ID}.heroes`,
      startsWithName,
      overrides
    );
  }

  async importMonster(
    startsWithName: string,
    overrides: Record<string, any> = {}
  ): Promise<DocumentRef> {
    return this.importActorFromCompendium(
      `${CONSTANTS.DND5E_SYSTEM_ID}.monsters`,
      startsWithName,
      overrides
    );
  }

  async importItem(
    startsWithName: string,
    overrides: Record<string, any> = {}
  ): Promise<DocumentRef> {
    return this.importActorFromCompendium(
      `${CONSTANTS.DND5E_SYSTEM_ID}.items`,
      startsWithName,
      overrides
    );
  }

  async importSpell(
    startsWithName: string,
    overrides: Record<string, any> = {}
  ): Promise<DocumentRef> {
    return this.importActorFromCompendium(
      `${CONSTANTS.DND5E_SYSTEM_ID}.spells`,
      startsWithName,
      overrides
    );
  }

  async importActorFromCompendium(
    packId: string,
    startsWithName: string,
    overrides: Record<string, any> = {}
  ) {
    return await this.page.evaluate(async (): Promise<DocumentRef> => {
      const compendiumDocument = await game.packs.get(packId).getDocuments();
      const compendiumDocumentData = compendiumDocument
        .find((d: any) => d.name.startsWith(startsWithName))
        .toObject();
      const result = await dnd5e.documents.Actor5e.create(
        foundry.utils.mergObject(compendiumDocumentData, overrides)
      );

      return {
        id: result.id,
        uuid: result.uuid,
        name: result.name,
      };
    });
  }

  async importItemFromCompendium(
    packId: string,
    startsWithName: string,
    overrides: Record<string, any> = {}
  ) {
    return await this.page.evaluate(async (): Promise<DocumentRef> => {
      const compendiumDocument = await game.packs.get(packId).getDocuments();
      const compendiumDocumentData = compendiumDocument
        .find((d: any) => d.name.startsWith(startsWithName))
        .toObject();
      const result = await dnd5e.documents.Item5e.create(
        foundry.utils.mergObject(compendiumDocumentData, overrides)
      );

      return {
        id: result.id,
        uuid: result.uuid,
        name: result.name,
      };
    });
  }
}
