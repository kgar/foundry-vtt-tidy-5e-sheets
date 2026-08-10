import type { CharacterSheetQuadroneContext } from 'src/types/types';
import { ActorSheetQuadroneRuntime } from '../ActorSheetQuadroneRuntime.svelte';
import SidebarTabFavorites from 'src/sheets/quadrone/actor/tabs/SidebarTabFavorites.svelte';
import SidebarTabSkillsTraits from 'src/sheets/quadrone/actor/tabs/SidebarTabSkillsTraits.svelte';
import { CONSTANTS } from 'src/constants';
import { TidyFlags } from 'src/foundry/TidyFlags';
import {
  getSkillsTraitsCombined,
  isCharacterSidebarTabValid,
} from 'src/settings/character-sidebar-tab-configuration';

function isSidebarTabEnabled(
  context: CharacterSheetQuadroneContext,
  tabId: string,
) {
  const skillsTraitsCombined = getSkillsTraitsCombined(
    TidyFlags.sidebarTabConfiguration.get(context.actor),
  );

  return isCharacterSidebarTabValid(tabId, skillsTraitsCombined);
}

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
        id: CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS_TRAITS,
        title: 'TIDY5E.Character.Sidebar.SkillsAndTraits',
        content: {
          type: 'svelte',
          component: SidebarTabSkillsTraits,
          getProps: () => ({ showSkills: true, showTraits: true }),
        },
        iconClass: 'fa-solid fa-briefcase',
        layout: 'quadrone',
        enabled: (context) =>
          isSidebarTabEnabled(
            context,
            CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS_TRAITS,
          ),
      },
      {
        id: CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS,
        title: 'DND5E.Skills',
        content: {
          type: 'svelte',
          component: SidebarTabSkillsTraits,
          getProps: () => ({ showSkills: true, showTraits: false }),
        },
        iconClass: 'fa-solid fa-hammer',
        layout: 'quadrone',
        enabled: (context) =>
          isSidebarTabEnabled(context, CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS),
      },
      {
        id: CONSTANTS.TAB_TRAITS,
        title: 'DND5E.Traits',
        content: {
          type: 'svelte',
          component: SidebarTabSkillsTraits,
          getProps: () => ({ showSkills: false, showTraits: true }),
        },
        iconClass: 'fa-solid fa-user-tag',
        layout: 'quadrone',
        enabled: (context) =>
          isSidebarTabEnabled(context, CONSTANTS.TAB_TRAITS),
      },
    ],
    [
      CONSTANTS.TAB_FAVORITES,
      CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS_TRAITS,
      CONSTANTS.TAB_CHARACTER_SIDEBAR_SKILLS,
      CONSTANTS.TAB_TRAITS,
    ],
    {
      getTabConfig: TidyFlags.sidebarTabConfiguration.get,
      docTypeKeyOverride: CONSTANTS.WORLD_TAB_CONFIG_KEY_CHARACTER_SIDEBAR,
    },
  );
