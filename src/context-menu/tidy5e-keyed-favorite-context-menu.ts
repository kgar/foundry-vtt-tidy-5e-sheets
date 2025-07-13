import type {
  CharacterFavorite,
  CharacterFavoriteType,
} from 'src/foundry/dnd5e.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import type { Tidy5eCharacterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eCharacterSheetQuadrone.svelte';
import { isNil } from 'src/utils/data';

export function configureKeyedFavoriteContextMenu(
  element: HTMLElement,
  app: Tidy5eCharacterSheetQuadrone
) {
  const { key } = element.closest<HTMLElement>('[data-key]')?.dataset ?? {};
  const isSlots = !!element.closest('[data-slots]');

  let type: CharacterFavoriteType | undefined;

  let onEdit = (_app: any) => {};

  if (!isNil(key) && key in CONFIG.DND5E.skills) {
    type = 'skill';
    onEdit = (app) =>
      FoundryAdapter.renderSkillToolConfig(app.document, 'skills', key);
  } else if (!isNil(key) && key in CONFIG.DND5E.tools) {
    type = 'tool';
    onEdit = (app) =>
      FoundryAdapter.renderSkillToolConfig(app.document, 'tool', key);
  } else if (isSlots) {
    type = 'slots';
    onEdit = (app) => FoundryAdapter.openSpellSlotsConfig(app.document);
  }

  if (!type) {
    ui.context.menuItems = [];
    return;
  }

  let favorite = {
    id: key,
    type,
  };

  let hasFavorite = app.actor.system.hasFavorite(favorite.id);

  ui.context.menuItems = [
    {
      name: 'TIDY5E.ContextMenuActionEdit',
      icon: '<i class="fa-solid fa-pen-to-square fa-fw"></i>',
      condition: () => app.isEditable,
      group: 'common',
      callback: () => onEdit(app),
    },
    {
      name: hasFavorite ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: hasFavorite
        ? `<i class='fa-regular fa-star fa-fw'></i>`
        : `<i class='fa-solid fa-star fa-fw inactive'></i>`,
      callback: () => {
        hasFavorite
          ? app.actor.system.removeFavorite(favorite.id)
          : app.actor.system.addFavorite(favorite);
      },
      condition: () => !FoundryAdapter.isLockedInCompendium(app.actor),
    },
  ];
}
