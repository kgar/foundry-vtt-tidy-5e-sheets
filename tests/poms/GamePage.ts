import type { Page } from '@playwright/test';
import { JoinPage } from './JoinPage';
import { SetupPage } from './SetupPage';
import { CONSTANTS } from 'src/constants';
import type { DocumentRef } from '../tests.types';

export class GamePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async isReady() {
    await this.page.waitForFunction(() => !!window['game']?.ready);
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
    await this.page.evaluate(
      async ({ constants }) => {
        // Make all supported sheets Tidy
        await game.settings.set('core', 'sheetClasses', {
          Actor: {
            character: `${constants.DND5E_SYSTEM_ID}.Tidy5eCharacterSheet`,
            npc: `${constants.DND5E_SYSTEM_ID}.Tidy5eNpcSheet`,
            vehicle: `${constants.DND5E_SYSTEM_ID}.Tidy5eVehicleSheet`,
          },
          Item: {
            weapon: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            equipment: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            consumable: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            container: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarContainerSheet`,
            tool: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            loot: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            race: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            background: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            class: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            subclass: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            spell: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            feat: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
            backpack: `${constants.DND5E_SYSTEM_ID}.Tidy5eKgarItemSheet`,
          },
        });

        // Ensure Tidy is activated
        const settings = game.settings.get('core', 'moduleConfiguration');
        settings[constants.MODULE_ID] = true;
        await game.settings.set('core', 'moduleConfiguration', { ...settings });

        // Unless expressly testing migrations, keep the migration tally maxed out
        await game.settings.set(
          constants.MODULE_ID,
          'migrationsConfirmationTally',
          Number.MAX_SAFE_INTEGER
        );
      },
      { constants: CONSTANTS }
    );
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
    return await this.page.evaluate(
      async ({ packId, startsWithName, overrides }): Promise<DocumentRef> => {
        const compendiumDocument = await game.packs.get(packId).getDocuments();
        const compendiumDocumentData = compendiumDocument
          .find((d: any) => d.name.startsWith(startsWithName))
          .toObject();
        const result = await dnd5e.documents.Actor5e.create(
          foundry.utils.mergeObject(compendiumDocumentData, overrides)
        );

        return {
          id: result.id,
          uuid: result.uuid,
          name: result.name,
        };
      },
      { packId, startsWithName, overrides }
    );
  }

  async importItemFromCompendium(
    packId: string,
    startsWithName: string,
    overrides: Record<string, any> = {}
  ) {
    return await this.page.evaluate(
      async ({ packId, startsWithName, overrides }): Promise<DocumentRef> => {
        const compendiumDocument = await game.packs.get(packId).getDocuments();
        const compendiumDocumentData = compendiumDocument
          .find((d: any) => d.name.startsWith(startsWithName))
          .toObject();
        const result = await dnd5e.documents.Item5e.create(
          foundry.utils.mergeObject(compendiumDocumentData, overrides)
        );

        return {
          id: result.id,
          uuid: result.uuid,
          name: result.name,
        };
      },
      { packId, startsWithName, overrides }
    );
  }
}
