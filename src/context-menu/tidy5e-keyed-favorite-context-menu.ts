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

  if (!isNil(key) && key in CONFIG.DND5E.skills) {
    type = 'skill';
  } else if (!isNil(key) && key in CONFIG.DND5E.tools) {
    type = 'tool';
  } else if (isSlots) {
    type = 'slots';
  }

  if (!type || !key) {
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
      name: hasFavorite ? 'TIDY5E.RemoveFavorite' : 'TIDY5E.AddFavorite',
      icon: hasFavorite
        ? `<i class='fas fa-bookmark fa-fw' style='color: var(--t5e-warning-accent-color)'></i>`
        : `<i class='fas fa-bookmark fa-fw inactive'></i>`,
      callback: () => {
        hasFavorite
          ? app.actor.system.removeFavorite(favorite.id)
          : app.actor.system.addFavorite(favorite);
      },
      condition: () => !FoundryAdapter.isLockedInCompendium(app.actor),
    },
  ];
}
