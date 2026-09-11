import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';
import { configureItemContextMenu } from './tidy5e-item-context-menu';
import { configureActiveEffectsContextMenu } from './tidy5e-active-effect-context-menu';
import { configureGroupContextMenu } from './tidy5e-group-context-menu';
import {
  configureGroupBastionFacilityContextMenu,
  configureGroupBastionMemberContextMenu,
} from './tidy5e-group-bastion-context-menu';
import { configureFacilityContextMenu } from './tidy5e-facility-context-menu';
import { configureActivitiesContextMenu } from './tidy5e-activities-context-menu';
import FloatingContextMenu from './FloatingContextMenu';
import { configureKeyedFavoriteContextMenu } from './tidy5e-keyed-favorite-context-menu';
import { configureActorJournalContextMenu } from './tidy5e-journal-context-menu';
import { configureEncounterContextMenu } from './tidy5e-encounter-context.menu';
import { configureEncounterPlaceholderContextMenu } from './tidy5e-encounter-placeholder-context-menu';
import { configureSectionContextMenu as configureSectionContextMenu } from './tidy5e-section-context-menu';
import { configureVehicleMemberContextMenu } from './tidy5e-vehicle-member-context-menu';
import { configureGroupSkillRollContextMenu } from './tidy5e-group-skill-roll-context-menu';
import { configureSkillRollContextMenu } from './tidy5e-skill-roll-context-menu';

export function initTidy5eContextMenu(
  sheet: any,
  html: HTMLElement,
  contextMenuSelector: string = '[data-context-menu]',
) {
  new FloatingContextMenu(html, contextMenuSelector, [], {
    onOpen: onDocumentContextOpened.bind(sheet),
    jQuery: false,
  });
}

/**
 * Handle activation of a context menu for an embedded Item or ActiveEffect document.
 * Dynamically populate the array of context menu options.
 * @param {HTMLElement} target       The HTML element for which the context menu is activated
 * @protected
 */
function onDocumentContextOpened(this: any, target: HTMLElement) {
  const contextMenuType = target.getAttribute('data-context-menu');

  const app = this;

  ui.context.menuItems = [];

  switch (contextMenuType) {
    case CONSTANTS.CONTEXT_MENU_TYPE_ACTIVITIES:
      configureActivitiesContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_EFFECTS:
      configureActiveEffectsContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_ENCOUNTER_MEMBER:
      configureEncounterContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_ENCOUNTER_PLACEHOLDER:
      configureEncounterPlaceholderContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_FACILITY_OCCUPANTS:
      configureFacilityContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_VEHICLE_MEMBER:
      configureVehicleMemberContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_GROUP_BASTION_FACILITY:
      configureGroupBastionFacilityContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_GROUP_BASTION_MEMBER:
      configureGroupBastionMemberContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER:
      configureGroupContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_ITEMS:
      configureItemContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE:
      configureKeyedFavoriteContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_ACTOR_JOURNAL:
      configureActorJournalContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_SECTION:
      configureSectionContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_SKILL_ROLL:
      configureSkillRollContextMenu(target, app);
      break;
    case CONSTANTS.CONTEXT_MENU_TYPE_GROUP_SKILL_ROLL:
      configureGroupSkillRollContextMenu(target, app);
      break;
    default:
      warn(
        `Unable to show context menu. The menu type ${contextMenuType} is not supported. Put a [data-context-menu] attribute on the target entity and implement the handler where this warning appears.`,
      );
      break;
  }
}
