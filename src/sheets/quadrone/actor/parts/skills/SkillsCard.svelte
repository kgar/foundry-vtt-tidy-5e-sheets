<script lang="ts">
  import { TidyFlags } from 'src/foundry/TidyFlags';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getSheetContext } from 'src/sheets/sheet-context.svelte';
  import type {
    CharacterSheetQuadroneContext,
    NpcSheetQuadroneContext,
  } from 'src/types/types';
  import ProficiencyCycle from '../ProficiencyCycle.svelte';
  import { CONSTANTS } from 'src/constants';
  import SelectQuadrone from 'src/components/inputs/SelectQuadrone.svelte';
  import SelectOptions from 'src/components/inputs/SelectOptions.svelte';
  import FiligreeCard from 'src/components/filigree-card/FiligreeCard.svelte';
  import { getModifierData } from 'src/utils/formatting';
  import { isNil } from 'src/utils/data';
  import SkillsCardHeader from './SkillsCardHeader.svelte';

  type Props = {
    defaultExpansionState?: boolean;
    showProficiency?: boolean;
    showFiligree?: boolean;
  };

  let { 
    defaultExpansionState = true, 
    showFiligree = true, 
    showProficiency = true 
  }: Props = $props();

  const localize = FoundryAdapter.localize;

  let context =
    $derived(
      getSheetContext<
        CharacterSheetQuadroneContext | NpcSheetQuadroneContext
      >(),
    );

  let expanded = $derived(
    TidyFlags.skillsExpanded.get(context.actor) ?? defaultExpansionState,
  );

  let skills = $derived(
    expanded
      ? context.skills
      : context.skills.filter((s) => s.proficient !== 0),
  );

  let references = $derived(
    context.skills.reduce<Record<string, string>>((prev, skill) => {
      const ref = CONFIG.DND5E.skills[skill.key]?.reference;
      if (!isNil(ref, '')) {
        prev[skill.key] = ref;
      }
      return prev;
    }, {}),
  );
</script>

{#snippet skillsContent()}
  <SkillsCardHeader {expanded} inCard={showFiligree}>
    {#snippet legend()}
      {localize('DND5E.Modifier')} /
      {localize('DND5E.Passive')}
    {/snippet}
  </SkillsCardHeader>
  {#if skills.length}
    <ul
      class="skill-list unlist use-ability-list"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILLS_LIST}
    >
      {#each skills as skill (skill.key)}
        {@const modifier = getModifierData(skill.total)}
        <li
          class="skill-list-item"
          data-reference-tooltip={references[skill.key]}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_CONTAINER}
          data-key={skill.key}
        >
          {#if showProficiency}
            <ProficiencyCycle
              actor={context.actor}
              aria-label={localize(skill.hover)}
              data-tooltip
              disabled={!context.unlocked}
              path="system.skills.{skill.key}.value"
              type="skill"
              value={context.unlocked
                ? (skill.source?.value ?? 0)
                : skill.value}
            />
          {/if}
          {#if context.unlocked}
            <SelectQuadrone
              document={context.actor}
              field="system.skills.{skill.key}.ability"
              value={skill.baseAbility}
              class="skill-ability"
            >
              <SelectOptions
                data={context.config.abilities}
                labelProp="abbreviation"
              />
            </SelectQuadrone>
          {:else}
            <span
              class="skill-ability font-label-medium color-text-gold-emphasis"
            >
              {skill.abbreviation}
            </span>
          {/if}
          <button
            type="button"
            class="button button-borderless use-ability-roll-button"
            onclick={(event) =>
              context.actor.rollSkill({ skill: skill.key, event })}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
            data-tidy-draggable
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
            data-has-roll-modes
            disabled={!context.owner}
          >
            {skill.label}
          </button>
          <span class="modifier">
            <span class="color-text-lightest font-label-medium">
              {modifier.sign}
            </span>
            <span class="font-data-medium">
              {modifier.value}
            </span>
          </span>
          {#if context.unlocked}
            <button
              aria-label={localize('DND5E.SkillConfigure')}
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
{/snippet}

{#if showFiligree}
  <FiligreeCard class="skills card">
    {@render skillsContent()}
  </FiligreeCard>
{:else}
  <div class="skills card">
    {@render skillsContent()}
  </div>
{/if}
