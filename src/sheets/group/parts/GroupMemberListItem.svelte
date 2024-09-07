<script lang="ts">
  import type { Actor5e } from 'src/types/types';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import AcShieldBase from 'src/sheets/actor/AcShieldBase.svelte';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import type { GroupSheetClassicContext } from 'src/types/group.types';
  import { CONSTANTS } from 'src/constants';
  import GroupMemberListItemProfile from './GroupMemberListItemProfile.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { isNil } from 'src/utils/data';
  import { warn } from 'src/utils/logging';
  import { formatAsModifier } from 'src/utils/formatting';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;

  const localize = FoundryAdapter.localize;

  let memberSenses: string[];
  $: {
    // TODO: To Foundry Adapter or somewhere else shared, but make it use data instead of string array, so that it can be more elaborately rendered.
    const senses = member.system.attributes.senses ?? {};
    const tags: Record<string, string> = {};
    for (let [k, label] of Object.entries(CONFIG.DND5E.senses)) {
      const v = senses[k] ?? 0;
      if (v === 0) continue;
      tags[k] =
        `${game.i18n.localize(label)} ${v} ${senses.units ?? Object.keys(CONFIG.DND5E.movementUnits)[0]}`;
    }
    if (senses.special)
      senses.special
        .split(';')
        .forEach((c: string, i: number) => (tags[`custom${i + 1}`] = c.trim()));
    memberSenses = Object.values(tags);
  }

  let memberConditionImmunities: string[];
  $: {
    const conditionImmunities: string[] = [];
    // traits: { ci: { custom: string, value: Set<string> }}
    // value maps to CONFIG.DND5E.conditionTypes
    for (let entry of member.system.traits.ci.value) {
      conditionImmunities.push(
        $context.config.conditionTypes[entry]?.label ?? entry,
      );
    }

    const customImmunity = member.system.traits.ci.custom?.trim();
    if (!isNil(customImmunity, '')) {
      conditionImmunities.push(customImmunity);
    }

    memberConditionImmunities = conditionImmunities;
  }

  type SkillInfo = {
    key: string;
    label: string;
    total: number;
    mod: string;
    passive: number;
  };

  let skills: SkillInfo[];
  $: {
    skills = member.system.skills
      ? Array.from(Object.entries($context.config.skills)).reduce<SkillInfo[]>(
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

            const label = $context.config.skills[key]?.label ?? key;

            prev.push({
              key: key,
              label: label,
              passive: skill.passive,
              total: skill.total,
              mod: formatAsModifier(skill.total),
            });

            return prev;
          },
          [],
        )
      : [];
  }

  // TODO: 'prc' to CONSTANT
  $: top4Skills = skills
    .filter((s) => s.key !== 'prc')
    .sort((a, b) => b.total - a.total)
    .slice(0, 4);

  $: perception = skills.find((s) => s.key === 'prc');

  $: ctx = $context.memberContext[member.id];

  function getSkill(key: string): any | null {
    if (key in member.system.skills) {
      return member.system.skills[key];
    }

    return null;
  }

  function onPerceptionClicked(
    event: MouseEvent & {
      currentTarget: EventTarget & HTMLButtonElement;
    },
  ) {
    if (perception) {
      member.rollSkill(perception.key, {
        rollMode: CONST.DICE_ROLL_MODES.BLIND,
        event: event,
      });
    }
  }
</script>

<div class="group-member-list-item flex-row small-gap align-items-flex-start">
  <GroupMemberListItemProfile {member} showHp={ctx.canObserve} />
  <div class="flex-column extra-small-gap flex-1 align-self-center">
    <div
      class="flex-row small-gap align-items-center justify-content-space-between"
    >
      <button
        type="button"
        class="inline-transparent-button highlight-on-hover ff-title fs-lg"
        on:click={() => member.sheet.render(true)}
      >
        {member.name}
      </button>
      {#if $context.unlocked}
        <RemoveMemberControl {member} />
      {/if}
    </div>

    {#if ctx.canObserve}
      <div class="flex-row extra-small-gap">
        <!-- TODO: Extract to own part component -->
        <AcShieldBase cssClass="group-ac-shield">
          <span class="ac-value">{member.system.attributes.ac.value}</span>
        </AcShieldBase>
        <fieldset class="flex-1">
          <legend class="semibold">
            {localize('DND5E.Senses')}
          </legend>
          {#if memberSenses.length}
            {memberSenses.join(', ')}
          {:else}
            <i>{localize('TIDY5E.NoSpecialSenses')}</i>
          {/if}
        </fieldset>
        {#if memberConditionImmunities.length}
          <fieldset class="flex-1">
            <legend class="semibold">
              {localize('DND5E.ConImm')}
            </legend>
            {memberConditionImmunities.join(', ')}
          </fieldset>
        {/if}
      </div>

      <div class="flex-row flex-wrap skills">
        {#if perception}
          <button
            type="button"
            class="skill"
            on:click={(event) => onPerceptionClicked(event)}
            title={localize(perception?.label ?? '')}
          >
            <i class="fas fa-eye"></i>
            {perception?.mod} ({perception?.passive})
          </button>
        {/if}
        {#each top4Skills as skill (skill.key)}
          <span class="skill">
            {localize(skill?.label ?? '')}
            {skill?.mod}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- TODO: To dedicated SCSS file(s) -->
<style lang="scss">
  .group-member-list-item {
    // Group Member Class Summary

    // Group AC Shield
    :global(.ac-display) {
      align-self: flex-start;
      margin-top: 0.375rem;
    }

    :global(.group-ac-shield .ac-shield) {
      width: 2.25rem;
    }
    .ac-value {
      font-family: var(--t5e-title-font-family);
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
    }

    // Senses and Immunities
    fieldset {
      border-radius: 0.25rem;
      border-color: var(--t5e-separator-color);
    }

    // Skill Pills
    .skills {
      gap: 0.125rem;
      align-items: flex-start;
    }
    .skills .skill {
      flex: 0 0 max-content;
      line-height: 1.25rem;
      border: 0.0625rem solid var(--t5e-faint-color);
      border-radius: 0.3125rem;
      padding: 0.125rem 0.325rem;
    }
  }
</style>
