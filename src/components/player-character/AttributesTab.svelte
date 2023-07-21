<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e, ActorSkill, ActorSkills } from 'src/types/actor';
  import type {
    ActorContextSkill,
    ActorContextSkills,
    ActorSheetContext,
    SheetFunctions,
  } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';

  export let context: ActorSheetContext;
  export let sheetFunctions: SheetFunctions;

  const skillRefs = Array.from(Object.entries(context.config.skills)).map(
    (s: [key: string, value: any]) => ({
      key: s[0],
      label: s[1]['label'],
      ability: s[1]['ability'],
      skill: getSkill(s[0]),
    })
  );
  const localize = FoundryAdapter.localize;

  function getSkill(key: string): ActorContextSkill | null {
    if (key in context.actor.system.skills) {
      return context.skills[key as keyof ActorContextSkills];
    }

    return null;
  }
</script>

<section class="side-panel">
  <ul class="skills-list">
    {#each skillRefs as skillRef}
      {#if skillRef.skill}
        <li class="proficiency-row skill">
          <a
            class="config-button"
            data-action="skill"
            data-tooltip={localize('DND5E.SkillConfigure')}
          >
            <i class="fas fa-cog" />
          </a>
          <input
            type="hidden"
            name="system.skills.{skillRef.key}.value"
            value={skillRef.skill.baseValue}
            data-dtype="Number"
          />
          <input
            type="hidden"
            name="system.skills.{skillRef.key}.ability"
            value={skillRef.skill.ability}
          />
          <a
            class="proficiency-toggle skill-proficiency"
            title={skillRef.skill.hover}>{@html skillRef.skill.icon}</a
          >
          <h4 class="skill-name rollable">{skillRef.skill.label}</h4>
          <span class="skill-ability">{skillRef.skill.abbreviation}</span>
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
</section>
<section class="main-panel">Main panel</section>

<style lang="scss">
  .side-panel {
    display: flex;
    flex-wrap: wrap;
    width: 15rem;
  }

  .main-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: initial;
    padding: 0;
    margin-left: 1rem;
    height: auto;
    overflow-x: inherit;
  }
</style>
