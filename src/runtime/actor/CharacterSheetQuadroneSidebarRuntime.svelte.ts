import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';
import SidebarTabTraits from 'src/sheets/quadrone/actor/tabs/SidebarTabTraits.svelte';
import SidebarTabSkills from 'src/sheets/quadrone/actor/tabs/SidebarTabSkills.svelte';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import SidebarTabSkillsAndTraits from 'src/sheets/quadrone/actor/tabs/SidebarTabSkillsAndTraits.svelte';

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
        id: CONSTANTS.TAB_SIDEBAR_SKILLS_AND_TRAITS,
        title: 'TIDY5E.Character.Sidebar.SkillsAndTraits',
        content: {
          type: 'svelte',
          component: SidebarTabSkillsAndTraits,
        },
        iconClass: 'fa-solid fa-briefcase',
        layout: 'quadrone',
      },
      {
        id: CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS,
        title: 'DND5E.Skills',
        content: {
          type: 'svelte',
          component: SidebarTabSkills,
        },
        iconClass: 'fa-solid fa-briefcase',
        layout: 'quadrone',
      },
      {
        id: CONSTANTS.TAB_SIDEBAR_TRAITS,
        title: 'DND5E.Traits',
        content: {
          type: 'svelte',
          component: SidebarTabTraits,
        },
        iconClass: 'fa-solid fa-user-tag',
        layout: 'quadrone',
      },
    ],
    [CONSTANTS.TAB_FAVORITES, CONSTANTS.TAB_SIDEBAR_SKILLS_AND_TRAITS],
    {
      getTabConfig: TidyFlags.sidebarTabConfiguration.get,
      docTypeKeyOverride: CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    },
  );
