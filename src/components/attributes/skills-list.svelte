<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    ActorContextSkill,
    ActorContextSkills,
    ActorSheetContext,
  } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';

  export let context: ActorSheetContext;

  type SkillRef = {
    key: string;
    label: string;
    ability: string;
    skill: ActorContextSkill | null;
  };

  const skillRefs: SkillRef[] = Array.from(
    Object.entries(context.config.skills)
  ).map((s: [key: string, value: any]) => ({
    key: s[0],
    label: s[1]['label'],
    ability: s[1]['ability'],
    skill: getSkill(s[0]),
  }));
  const localize = FoundryAdapter.localize;

  function getSkill(key: string): ActorContextSkill | null {
    if (key in context.actor.system.skills) {
      return context.skills[key as keyof ActorContextSkills];
    }

    return null;
  }

  function cycleProficiency(
    event: MouseEvent,
    skillRef: SkillRef,
    reverse: boolean = false
  ) {
    // TODO: Check for active effects and prevent if applicable.
    const value = skillRef.skill?.value;

    if (value === null || value === undefined) {
      return;
    }

    const levels = [0, 1, 0.5, 2];
    const idx = levels.indexOf(value);
    const next = idx + (reverse ? 3 : 1);
    context.actor.update({
      [`system.skills.${skillRef.key}.value`]: levels[next % levels.length],
    });
  }
</script>

<ul class="skills-list">
  {#each skillRefs as skillRef}
    {#if skillRef.skill}
      <li class="proficiency-row skill" class:proficient={skillRef.skill.value}>
        <a
          class="configure-proficiency"
          on:click|stopPropagation|preventDefault={() =>
            new dnd5e.applications.actor.ProficiencyConfig(context.actor, {
              property: 'skills',
              key: skillRef.key,
            }).render(true)}
          data-tooltip={localize('DND5E.SkillConfigure')}
        >
          <i class="fas fa-cog" />
        </a>
        <a
          class="skill-proficiency-toggle"
          on:click|stopPropagation|preventDefault={(event) =>
            cycleProficiency(event, skillRef)}
          on:contextmenu|stopPropagation|preventDefault={(event) =>
            cycleProficiency(event, skillRef, true)}
          title={skillRef.skill.hover}>{@html skillRef.skill.icon}</a
        >
        <h4
          role="button"
          class="tidy5e-skill-name"
          on:click|stopPropagation={(event) =>
            context.actor.rollSkill(skillRef.key, { event })}
        >
          {skillRef.skill.label}
        </h4>
        <span class="skill-ability">{skillRef.skill.abbreviation}</span>
        <span class="skill-mod">{formatAsModifier(skillRef.skill.total)}</span>
        <span
          class="skill-passive"
          title="{skillRef.skill.label} ({localize('DND5E.Passive')})"
          >({skillRef.skill.passive})</span
        >
      </li>
    {/if}
  {/each}
</ul>

<style lang="scss">
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
      //   justify-content: space-between;
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
        white-space: nowrap;
        text-overflow: ellipsis;
        flex: 1;
        margin: 0 0.25rem;
        font-weight: 400;
      }

      .configure-proficiency {
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);
        &:hover {
          color: var(--t5e-primary-color);
        }
      }

      &.proficient .tidy5e-skill-name {
        font-weight: 700;
      }

      .skill-proficiency-toggle {
        font-size: 0.625rem;
        color: var(--t5e-tertiary-color);

        &:hover {
          color: var(--t5e-primary-font);
        }

        i {
          vertical-align: baseline;
        }

        // TODO: Is this for when the skill is unable to be toggled? Like when active effects are preventing?
        // &:not(.proficiency-toggle) {
        //   cursor: default;
        //   &:hover {
        //     color: var(--t5e-tertiary-color);
        //   }
        // }
      }

      .skill-mod,
      .skill-passive {
        text-align: right;
        flex: 0 0 1.5rem;
      }

      .skill-passive {
        color: var(--t5e-tertiary-color);
      }

      .skill-ability {
        flex: 0 0 1.5rem;
        text-transform: capitalize;
      }
      ///
    }
  }
</style>
