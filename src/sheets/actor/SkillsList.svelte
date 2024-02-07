<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settingStore } from 'src/settings/settings';
  import type { Actor5e } from 'src/types/types';
  import type { CharacterSheetContext, NpcSheetContext } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let toggleable: boolean = false;
  export let actor: Actor5e;
  export let expanded: boolean = true;
  export let toggleField: string | null = null;

  $: showAllSkills = !toggleable || expanded;

  let context =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('context');

  type SkillRef = {
    key: string;
    label: string;
    ability: string;
    skill: any | null;
  };

  let skillRefs: SkillRef[];
  $: skillRefs = Array.from(Object.entries($context.config.skills)).map(
    (s: [key: string, value: any]) => ({
      key: s[0],
      label: s[1]['label'],
      ability: s[1]['ability'],
      skill: getSkill(s[0]),
    }),
  );
  const localize = FoundryAdapter.localize;

  function getSkill(key: string): any | null {
    if (key in $context.actor.system.skills) {
      return $context.skills[key];
    }

    return null;
  }

  function toggleShowAllSkills() {
    if (toggleField === null) {
      return;
    }

    actor.update({ [toggleField]: !expanded });
  }
</script>

<div class="skills-list-container">
  <ul
    class="skills-list"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILLS_LIST}
  >
    {#each skillRefs as skillRef (skillRef.key)}
      {@const showSkill =
        skillRef.skill && (showAllSkills || skillRef.skill.value > 0)}

      {#if showSkill}
        <li
          class="proficiency-row skill"
          class:proficient={skillRef.skill.value}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_CONTAINER}
          data-key={skillRef.key}
        >
          {#if $context.editable && !$context.lockSensitiveFields}
            <button
              type="button"
              class="configure-proficiency inline-icon-button"
              on:click={() =>
                FoundryAdapter.renderProficiencyConfig(
                  $context.actor,
                  'skills',
                  skillRef.key,
                )}
              title={localize('DND5E.SkillConfigure')}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .SKILL_CONFIGURATION_CONTROL}
              tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            >
              <i class="fas fa-cog" />
            </button>
            <button
              type="button"
              class="skill-proficiency-toggle inline-icon-button"
              on:click={() =>
                FoundryAdapter.cycleProficiency(
                  $context.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills',
                )}
              on:contextmenu={() =>
                FoundryAdapter.cycleProficiency(
                  $context.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills',
                  true,
                )}
              title={skillRef.skill.hover}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                .SKILL_PROFICIENCY_TOGGLE}
              tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
              >{@html skillRef.skill.icon}</button
            >
          {:else}
            <span class="skill-proficiency" title={skillRef.skill.hover}
              >{@html skillRef.skill.icon}</span
            >
          {/if}
          {#if $context.editable}
            <button
              type="button"
              class="tidy5e-skill-name transparent-button rollable"
              on:click={(event) =>
                $context.actor.rollSkill(skillRef.key, { event })}
              data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
              tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
            >
              {skillRef.skill.label}
            </button>
          {:else}
            <span class="tidy5e-skill-name">
              {skillRef.skill.label}
            </span>
          {/if}
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
  {#if toggleable}
    <div style="text-align:center;">
      <button
        type="button"
        class="toggle-proficient inline-transparent-button"
        on:click={toggleShowAllSkills}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
          .SKILLS_SHOW_PROFICIENT_TOGGLE}
        tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
      >
        {#if showAllSkills}
          {localize('TIDY5E.HideNotProficientSkills')}
        {:else}
          {localize('TIDY5E.ShowNotProficientSkills')}
        {/if}</button
      >
    </div>
  {/if}
</div>

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

      .skill-ability {
        flex: 0 0 1.5rem;
        text-transform: capitalize;
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
