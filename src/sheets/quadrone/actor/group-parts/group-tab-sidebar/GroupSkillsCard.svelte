<script lang="ts">
  import { TidyFlags } from 'src/api';
  import SkillsCardHeader from '../../parts/skills/SkillsCardHeader.svelte';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { getContext } from 'svelte';
  import type { GroupMemberQuadroneContext } from 'src/types/types';
  import type { Ref } from 'src/features/reactivity/reactivity.types';

  let context = $derived(getGroupSheetQuadroneContext());

  let expanded = $derived(TidyFlags.skillsExpanded.get(context.actor) ?? false);

  let emphasizedActorRef = getContext<
    Ref<GroupMemberQuadroneContext | undefined>
  >(CONSTANTS.SVELTE_CONTEXT.EMPHASIZED_MEMBER_REF);

  let emphasizedMember = $derived(emphasizedActorRef.value);

  const localize = FoundryAdapter.localize;
</script>

<div class="skills card">
  <SkillsCardHeader {expanded}>
    {#snippet legend()}
      {#if emphasizedMember}
        <span class="skill-measure-header">
          {localize('DND5E.Modifier')} /
          {localize('DND5E.Passive')}
        </span>
      {:else}
        <span class="skill-measure-header">
          {localize('TIDY5E.AggregateSkill.HighMeasure')} /
          {localize('TIDY5E.AggregateSkill.LowMeasure')}
        </span>
      {/if}
    {/snippet}
  </SkillsCardHeader>
  <ul
    class="skill-list unlist use-ability-list"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILLS_LIST}
  >
    <!-- TODO: Prepare data and iterate! -->
    {#each context.skills as skill}
      {#if expanded || skill.proficient}
        {@const memberSkill = skill.identifiers.get(
          emphasizedMember?.actor.uuid ?? '',
        )}
        {@const memberProficient = (memberSkill?.proficient ?? 0) > 0}

        <li
          class={[
            'skill-list-item',
            {
              'member-proficient': memberProficient,
              'member-unproficient': memberSkill && !memberProficient,
            },
          ]}
          data-reference-tooltip={skill.reference}
          data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_CONTAINER}
          data-key={skill.key}
        >
          <span
            class="skill-ability font-label-medium color-text-gold-emphasis"
          >
            {skill.ability}
          </span>
          <button
            type="button"
            class="button button-borderless use-ability-roll-button skill"
            onclick={(event) =>
              context.actor.rollSkill({ skill: skill.key, event })}
            data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
            data-tidy-draggable
            data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
            disabled={!context.owner}
          >
            {skill.name}
          </button>
          {#if memberSkill}
            <span class="skill-measure">
              <span class="color-text-lightest font-label-medium"
                >{memberSkill.sign}</span
              >
              <span class="font-data-medium">{memberSkill.value}</span>
            </span>
            <span class="skill-measure">
              <span class="color-text-lightest font-label-medium"
                >{memberSkill.passive}</span
              >
            </span>
          {:else}
            <span class="skill-measure">
              <span class="color-text-lightest font-label-medium"
                >{skill.high.sign}</span
              >
              <span class="font-data-medium">{skill.high.value}</span>
            </span>
            <span class="skill-measure">
              <span class="color-text-lightest font-label-medium"
                >{skill.low.sign}</span
              >
              <span class="font-data-medium">{skill.low.value}</span>
            </span>
          {/if}
        </li>
      {/if}
    {/each}
  </ul>
</div>
