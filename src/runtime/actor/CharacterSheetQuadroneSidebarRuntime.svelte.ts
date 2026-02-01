import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';
import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
import SidebarTabTraits from 'src/sheets/quadrone/actor/tabs/SidebarTabTraits.svelte';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';

export const CharacterSheetQuadroneSidebarRuntime =
  new ActorSheetQuadroneRuntime<CharacterSheetQuadroneContext>(
    [
      {
        id: CONSTANTS.TAB_FAVORITES,
        title: 'DND5E.Favorites',
        content: {
          type: 'svelte',
          component: SidebarTabFavorites,
          cssClass: 'favorites',
        },
        iconClass: 'fa-solid fa-star',
        layout: 'quadrone',
      },
      {
        id: CONSTANTS.TAB_TRAITS,
        title: 'DND5E.Traits',
        content: {
          type: 'svelte',
          component: SidebarTabTraits,
        },
        iconClass: 'fa-solid fa-briefcase',
        layout: 'quadrone',
      },
    ],
    [CONSTANTS.TAB_FAVORITES, CONSTANTS.TAB_TRAITS],
    {
      getTabConfig: TidyFlags.sidebarTabConfiguration.get,
      docTypeKeyOverride: CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    }
  );
