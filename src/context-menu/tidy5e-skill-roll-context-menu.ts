import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Tidy5eGroupSheetQuadrone } from 'src/sheets/quadrone/Tidy5eGroupSheetQuadrone.svelte';
import type { Tidy5eEncounterSheetQuadrone } from 'src/sheets/quadrone/Tidy5eEncounterSheetQuadrone.svelte';
import { TidyHooks } from 'src/api';

export function configureSkillRollContextMenu(
  element: HTMLElement,
  app: Tidy5eGroupSheetQuadrone | Tidy5eEncounterSheetQuadrone,
) {
  const skillKey = element.closest<HTMLElement>('[data-key]')?.dataset.key;

  if (!skillKey) {
    return;
  }

  ui.context.menuItems = getSkillRollContextOptions(app, skillKey);

  TidyHooks.tidy5eSheetsGetSkillRollContextOptions(
    app.document,
    skillKey,
    ui.context.menuItems,
  );
}

/**
 * Prepare an array of context menu options which are available for a member of a group.
 * @param group       The group for which the context menu is activated.
 * @param skillKey    The skill key that corresponds to CONFIG.DND5E.skills.
 * @returns           Context menu options.
 */
export function getSkillRollContextOptions(
  app: Tidy5eGroupSheetQuadrone | Tidy5eEncounterSheetQuadrone,
  skillKey: string,
): ContextMenuEntry[] {
  const skill = CONFIG.DND5E.skills[skillKey ?? ''];

  const defaultIconHtml = `<i class="fa-solid fa-chess-queen color-text-gold-emphasis" aria-label=${FoundryAdapter.localize('DND5E.Default')} data-tooltip=""></i>`;

  const options: ContextMenuEntry[] = Object.entries(CONFIG.DND5E.abilities)
    .map(
      ([abilityKey, ability]) =>
        ({
          name: FoundryAdapter.localize('DND5E.SkillRoll', {
            ability: ability.label,
            skill: skill.label,
          }),
          icon: skill.ability === abilityKey ? defaultIconHtml : undefined,
          callback: (args) =>
            app.document.rollSkill({
              skill: skillKey,
              ability: abilityKey,
              event: args?.event,
            }),
          group: skill.ability === abilityKey ? 'primary' : 'secondary',
        }) satisfies ContextMenuEntry,
    )
    .sort((a, b) => a.group.localeCompare(b.group));

  return options;
}
