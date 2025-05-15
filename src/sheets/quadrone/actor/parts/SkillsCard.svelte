<script lang="ts">
  import { TidyFlags } from 'src/api';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import ProficiencyCycle from './ProficiencyCycle.svelte';
  import { CONSTANTS } from 'src/constants';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { tick } from 'svelte';

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let expanded = $derived(TidyFlags.skillsExpanded.get(context.actor) ?? true);

  let skills = $derived(
    expanded
      ? context.skills
      : context.skills.filter((s) => s.proficient !== 0),
  );
</script>

<div class="skills">
  <h3>
    <i class="fa-solid fa-briefcase color-text-lightest"></i>
    <button
      type="button"
      class={['button button-borderless skill-expand-button']}
      onclick={async () => {
        const newValue = !expanded;
        expanded = newValue;
        await tick();

        await TidyFlags.skillsExpanded.set(context.actor, newValue);
      }}
    >
      {localize('DND5E.Skills')}
      <i class={['fa-solid', 'fa-angle-right', { expanded }]}></i>
    </button>
  </h3>
  <span class="modifier-passive-label color-text-lightest">
    {localize('DND5E.Modifier')} /
    {localize('DND5E.Passive')}
  </span>
  {#if skills.length}
    <ul>
      {#each skills as skill (skill.key)}
        {@const modifier = getModifierData(skill.total)}
        <li>
          <ProficiencyCycle
            actor={context.actor}
            aria-label={localize(skill.hover)}
            data-tooltip={skill.hover}
            disabled={!context.unlocked}
            path="system.skills.{skill.key}.value"
            type="skill"
            value={context.unlocked ? skill.source.value : skill.value}
          />
          {#if context.unlocked}
            <SelectQuadrone
              document={context.actor}
              field="system.skills.{skill.key}.ability"
              value={skill.source.ability}
              class="skill-ability"
            >
              <SelectOptions
                data={context.config.abilities}
                labelProp="abbreviation"
              />
            </SelectQuadrone>
          {:else}
            <span class="skill-ability tranform-uppercase color-text-gold">
              {skill.abbreviation}
            </span>
          {/if}
          <button
            type="button"
            class="button button-borderless skill-roll-button"
            onclick={(event) =>
              context.actor.rollSkill({ skill: skill.key, event })}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
          >
            {skill.label}
          </button>
          <span class="modifier">
            <span class="color-text-lightest">
              {modifier.sign}
            </span>
            <span>
              {modifier.value}
            </span>
          </span>
          {#if context.unlocked}
            <button
              type="button"
              class="button button-borderless button-icon-only"
              onclick={(ev) =>
                FoundryAdapter.renderSkillToolConfig(
                  context.actor,
                  'skills',
                  skill.key,
                )}
            >
              <i class="fa-solid fa-cog"></i>
            </button>
          {:else}
            <span class="passive color-text-lighter">
              {skill.passive}
            </span>
          {/if}
        </li>
      {/each}
    </ul>
  {:else}
    <!-- Do we want any kind of content for when there are no proficient skills? -->
  {/if}
</div>
