<script lang="ts">
  import { TidyFlags } from 'src/api';
  import SkillsCardHeader from '../../parts/skills/SkillsCardHeader.svelte';
  import { getGroupSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  let context = $derived(getGroupSheetQuadroneContext());

  let expanded = $derived(TidyFlags.skillsExpanded.get(context.actor) ?? false);

  const localize = FoundryAdapter.localize;
</script>

<div class="skills">
  <SkillsCardHeader {expanded}>
    {#snippet legend()}
      <span class="skill-measure-header">
        {localize('TIDY5E.AggregateSkill.HighMeasure')}
      </span>
      <span class="skill-measure-header">
        {localize('TIDY5E.AggregateSkill.LowMeasure')}
      </span>
    {/snippet}
  </SkillsCardHeader>
  <ul
    class="skill-list unlist use-ability-list"
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILLS_LIST}
  >
    <!-- TODO: Prepare data and iterate! -->
    <li
      class="skill-list-item"
      data-reference-tooltip="TODO: Awesome tooltip with aggregate info!"
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_CONTAINER}
      data-key="TODO"
    >
      <span class="skill-ability font-label-medium color-text-gold-emphasis">
        DEX
      </span>
      <button
        type="button"
        class="button button-borderless use-ability-roll-button"
        onclick={(event) => context.actor.rollSkill({ skill: 'acr', event })}
        data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.SKILL_ROLLER}
        data-tidy-draggable
        data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_KEYED_FAVORITE}
        disabled={!context.owner}
      >
        Acrobatics
      </button>
      <!-- High -->
      <span class="skill-measure">
        <span class="color-text-lightest font-label-medium">+</span>
        <span class="font-data-medium">20</span>
      </span>
      <!-- Low -->
      <span class="skill-measure">
        <span class="color-text-lightest font-label-medium">+</span>
        <span class="font-data-medium">5</span>
      </span>
    </li>
  </ul>
</div>
