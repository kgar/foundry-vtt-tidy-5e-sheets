<script lang="ts">
  import InlineTextDropdownList from 'src/components/inputs/InlineTextDropdownList.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type { Actor5e, DropdownListOption } from 'src/types/types';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { ActiveEffectsHelper } from 'src/utils/active-effect';
  import { formatAsModifier } from 'src/utils/formatting';
  import { warn } from 'src/utils/logging';

  interface Props {
    toggleable?: boolean;
    actor: Actor5e;
    expanded?: boolean;
    toggleField?: string | null;
    defaultSkills?: Set<string>;
  }

  let {
    toggleable = false,
    actor,
    expanded = true,
    toggleField = null,
    defaultSkills = new Set<string>(),
  }: Props = $props();

  let context =
    $derived(getSheetContext<CharacterSheetContext | NpcSheetContext>());

  type SkillRef = {
    key: string;
    label: string;
    ability: string;
    skill: any | null;
  };

  let skillRefs: SkillRef[] = $derived(
    Array.from(Object.entries(context.config.skills)).reduce<SkillRef[]>(
      (prev, [key, configSkill]: [string, any]) => {
        const skill = getSkill(key);

        if (!skill) {
          warn(
            'Unable to find skill. Ensure custom skills are added at "init" time.',
            false,
            { key, configSkill },
          );
          return prev;
        }

        prev.push({
          key: key,
          label: configSkill.label,
          ability: skill.ability,
          skill: skill,
        });

        return prev;
      },
      [],
    ),
  );

  const localize = FoundryAdapter.localize;

  function getSkill(key: string): any | null {
    if (key in context.actor.system.skills) {
      return context.skills[key];
    }

    return null;
  }

  function toggleShowAllSkills() {
    if (toggleField === null) {
      return;
    }

    actor.update({ [toggleField]: !expanded });
  }

  function onSkillAbilityChange(
    option: DropdownListOption,
    skillRef: {
      key: string;
      label: string;
      ability: string;
      skill: any | null;
    },
  ): void {
    context.actor.update({
      system: {
        skills: {
          [skillRef.key]: {
            ability: option.value,
          },
        },
      },
    });
  }
  let showAllSkills = $derived(!toggleable || expanded);

  let abilities = $derived(
    FoundryAdapter.getAbilitiesAsDropdownOptions(context.abilities),
  );
</script>

<div class="skills-list-container">
  <ul
    class="skills-list"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILLS_LIST}
  >
    {#each skillRefs as skillRef (skillRef.key)}
      {@const showSkill =
        skillRef.skill &&
        (defaultSkills.has(skillRef.key) ||
          showAllSkills ||
          skillRef.skill.prof.hasProficiency > 0)}

      {#if showSkill}
        <li
          class="proficiency-row skill"
          class:proficient={skillRef.skill.prof.hasProficiency}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_CONTAINER}
          data-key={skillRef.key}
        >
          {#if context.editable && context.unlocked}
            {@const activeEffectApplied =
              ActiveEffectsHelper.isActiveEffectAppliedToField(
                context.actor,
                `system.skills.${skillRef.key}.value`,
              )}
            <button
              type="button"
              class="configure-proficiency inline-icon-button"
              onclick={() =>
                FoundryAdapter.renderSkillToolConfig(
                  context.actor,
                  'skills',
                  skillRef.key,
                )}
              title={localize('DND5E.SkillConfigure')}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .SKILL_CONFIGURATION_CONTROL}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
            >
              <i class="fas fa-cog"></i>
            </button>
            <button
              type="button"
              class="skill-proficiency-toggle inline-icon-button"
              onclick={() =>
                FoundryAdapter.cycleProficiency(
                  context.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills',
                )}
              oncontextmenu={() =>
                FoundryAdapter.cycleProficiency(
                  context.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills',
                  true,
                )}
              title={skillRef.skill.hover}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .SKILL_PROFICIENCY_TOGGLE}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              disabled={activeEffectApplied}
              data-tooltip={activeEffectApplied
                ? localize('DND5E.ActiveEffectOverrideWarning')
                : null}>{@html skillRef.skill.icon}</button
            >
          {:else}
            <span class="skill-proficiency" title={skillRef.skill.hover}
              >{@html skillRef.skill.icon}</span
            >
          {/if}
          {#if context.editable}
            <button
              type="button"
              class="tidy5e-skill-name transparent-button rollable"
              onclick={(event) =>
                context.actor.rollSkill({ skill: skillRef.key, event })}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
              tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
              title={skillRef.skill.label}
            >
              {skillRef.skill.label}
            </button>
          {:else}
            <span class="tidy5e-skill-name" title={skillRef.skill.label}>
              {skillRef.skill.label}
            </span>
          {/if}
          {#if context.unlocked && context.editable}
            <InlineTextDropdownList
              options={abilities}
              selected={{
                text: skillRef.skill.abbreviation,
                value: skillRef.skill.abbreviation,
              }}
              buttonClass="skill-ability"
              title={context.abilities?.[skillRef.ability]?.label}
              onOptionClicked={(option) =>
                onSkillAbilityChange(option, skillRef)}
            />
          {:else}
            <span class="skill-ability">{skillRef.skill.abbreviation}</span>
          {/if}

          <span class="skill-mod">{formatAsModifier(skillRef.skill.total)}</span
          >
          <span
            class="skill-passive"
            title="{skillRef.skill.label} ({localize('DND5E.Passive')})"
            >({skillRef.skill.passive})</span
          >
        </li>
      {/if}
    {/each}
  </ul>
  {#if toggleable && context.editable}
    <div style="text-align:center;">
      <a
        class="toggle-proficient"
        onclick={toggleShowAllSkills}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
          .SKILLS_SHOW_PROFICIENT_TOGGLE}
        tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
      >
        {#if showAllSkills}
          {localize('TIDY5E.HideNotProficientSkills')}
        {:else}
          {localize('TIDY5E.ShowNotProficientSkills')}
        {/if}
      </a>
    </div>
  {/if}
</div>

<style lang="less">
  .skills-list {
    border: 0.0625rem solid var(--t5e-faint-color);
    border-radius: 0.3125rem;
    overflow: visible;
    padding: 0;
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;

    .skill {
      flex: 0 0 1.125rem;
      display: flex;
      gap: 0.25rem;
      font-size: 0.75rem;
      line-height: 0.875rem;
      align-items: center;
      padding: 0.1875rem 0.25rem 0.0625rem 0.25rem;
      height: 1.125rem;
      flex-wrap: nowrap;

      &:nth-child(even) {
        background: var(--t5e-faint-color);
      }

      .tidy5e-skill-name {
        font-size: 0.75rem;
        line-height: 0.875rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        text-align: left;
        font-weight: 400;
      }

      .configure-proficiency {
        margin: 0;
        padding: 0;
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);
        &:hover {
          color: var(--t5e-primary-color);
        }
      }

      &.proficient .tidy5e-skill-name {
        font-weight: 700;
      }

      .skill-proficiency {
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);
      }

      .skill-proficiency-toggle {
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);

        &:hover {
          color: var(--t5e-primary-font-color);
        }

        i {
          vertical-align: baseline;
        }
      }

      .skill-mod,
      .skill-passive {
        text-align: right;
        flex: 0 0 1.5rem;
      }

      .skill-passive {
        color: var(--t5e-tertiary-color);
      }

      :global(.skill-ability) {
        flex: 0 0 1.875rem;
        font-size: 0.75rem;
        text-transform: capitalize;
        text-align: left;
      }
    }
  }

  .skills-list-container .toggle-proficient {
    font-size: 0.625rem;
    text-transform: capitalize;
    border: 0.0625rem solid var(--t5e-faint-color);
    border-top: none;
    padding: 0.125rem 0.5rem;
    border-radius: 0 0 0.3125rem 0.3125rem;
    cursor: pointer;
    color: var(--t5e-secondary-color);
    white-space: nowrap;

    &:hover {
      color: var(--t5e-primary-font-color);
    }
  }
</style>
