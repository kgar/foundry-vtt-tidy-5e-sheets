<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { Actor5e } from 'src/types/actor';
  import type {
    ActorContextSkill,
    ActorContextSkills,
    CharacterSheetContext,
    NpcSheetContext,
  } from 'src/types/types';
  import { formatAsModifier } from 'src/utils/formatting';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';

  export let toggleable: boolean = false;
  export let actor: Actor5e;

  $: showAllSkills =
    !toggleable || FoundryAdapter.tryGetFlag(actor, 'npcSkillsExpanded');

  let store =
    getContext<Readable<CharacterSheetContext | NpcSheetContext>>('store');

  type SkillRef = {
    key: string;
    label: string;
    ability: string;
    skill: ActorContextSkill | null;
  };

  let skillRefs: SkillRef[];
  $: skillRefs = Array.from(Object.entries($store.config.skills)).map(
    (s: [key: string, value: any]) => ({
      key: s[0],
      label: s[1]['label'],
      ability: s[1]['ability'],
      skill: getSkill(s[0]),
    })
  );
  const localize = FoundryAdapter.localize;

  function getSkill(key: string): ActorContextSkill | null {
    if (key in $store.actor.system.skills) {
      return $store.skills[key as keyof ActorContextSkills];
    }

    return null;
  }

  function toggleShowAllSkills() {
    const npcSkillsExpanded = FoundryAdapter.tryGetFlag(
      actor,
      'npcSkillsExpanded'
    );
    FoundryAdapter.setFlag(actor, 'npcSkillsExpanded', !npcSkillsExpanded);
  }
</script>

<div class="skills-list-container">
  <ul class="skills-list">
    {#each skillRefs as skillRef (skillRef.key)}
      {#if skillRef.skill && (showAllSkills || skillRef.skill.value > 0)}
        <li
          class="proficiency-row skill"
          class:proficient={skillRef.skill.value}
        >
          {#if $store.owner && !$store.lockSensitiveFields}
            <button
              type="button"
              class="configure-proficiency inline-icon-button"
              on:click={() =>
                new dnd5e.applications.actor.ProficiencyConfig($store.actor, {
                  property: 'skills',
                  key: skillRef.key,
                }).render(true)}
              title={localize('DND5E.SkillConfigure')}
            >
              <i class="fas fa-cog" />
            </button>
            <button
              type="button"
              class="skill-proficiency-toggle inline-icon-button"
              on:click={() =>
                FoundryAdapter.cycleProficiency(
                  $store.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills'
                )}
              on:contextmenu={() =>
                FoundryAdapter.cycleProficiency(
                  $store.actor,
                  skillRef.key,
                  skillRef.skill?.value,
                  'skills',
                  true
                )}
              title={skillRef.skill.hover}>{@html skillRef.skill.icon}</button
            >
          {:else}
            <span class="skill-proficiency" title={skillRef.skill.hover}
              >{@html skillRef.skill.icon}</span
            >
          {/if}
          {#if $store.owner}
            <button
              type="button"
              class="tidy5e-skill-name transparent-button rollable"
              on:click={(event) =>
                $store.actor.rollSkill(skillRef.key, { event })}
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
      >
        {#if showAllSkills}
          {localize('T5EK.Hide')}
        {:else}
          {localize('T5EK.Show')}
        {/if}
        {localize('DND5E.NotProficient')}</button
      >
    </div>
  {/if}
</div>

<style lang="scss">
  .skills-list {
    border: 0.0625rem solid var(--t5ek-faint-color);
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
        background: var(--t5ek-faint-color);
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
        color: var(--t5ek-tertiary-color);
        &:hover {
          color: var(--t5ek-primary-color);
        }
      }

      &.proficient .tidy5e-skill-name {
        font-weight: 700;
      }

      .skill-proficiency {
        font-size: 0.625rem;
        color: var(--t5ek-tertiary-color);
      }

      .skill-proficiency-toggle {
        font-size: 0.625rem;
        color: var(--t5ek-tertiary-color);

        &:hover {
          color: var(--t5ek-primary-font-color);
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
        color: var(--t5ek-tertiary-color);
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
    border: 0.0625rem solid var(--t5ek-faint-color);
    border-top: none;
    padding: 0.125rem 0.5rem;
    border-radius: 0 0 0.3125rem 0.3125rem;
    cursor: pointer;
    color: var(--t5ek-secondary-color);
    white-space: nowrap;

    &:hover {
      color: var(--t5ek-primary-font-color);
    }
  }
</style>
