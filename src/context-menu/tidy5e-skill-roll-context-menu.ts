import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { TidyHooks } from 'src/api';

export function configureSkillRollContextMenu(
  element: HTMLElement,
  app: { document: any },
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
 * @param aoo         The calling application.
 * @param skillKey    The skill key that corresponds to CONFIG.DND5E.skills.
 * @returns           Context menu options.
 */
export function getSkillRollContextOptions(
  app: { document: any },
  skillKey: string,
): ContextMenuEntry[] {
  const skill = CONFIG.DND5E.skills[skillKey ?? ''];

  const options: ContextMenuEntry[] = Object.entries(CONFIG.DND5E.abilities)
    .map(
      ([abilityKey, ability]) =>
        ({
          name: FoundryAdapter.localize('DND5E.SkillRoll', {
            ability: ability.label,
            skill: skill.label,
          }),
          callback: (_target, event) =>
            app.document.rollSkill({
              skill: skillKey,
              ability: abilityKey,
              event: event,
            }),
          classes: skill.ability === abilityKey ? undefined : 'color-text-lighter',
          group: skill.ability === abilityKey ? 'primary' : 'secondary',
        }) satisfies ContextMenuEntry,
    )
    .sort((a, b) => a.group.localeCompare(b.group));

  return options;
}
