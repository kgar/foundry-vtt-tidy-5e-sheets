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
  import DelimitedTruncatedContent from 'src/components/layout/DelimitedTruncatedContent.svelte';

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  export let member: Actor5e;

  $: classAndSubclassSummaries = [
    CONSTANTS.SHEET_TYPE_CHARACTER,
    CONSTANTS.SHEET_TYPE_NPC,
  ].includes(member.type)
    ? Array.from(
        FoundryAdapter.getClassAndSubclassSummaries(member).values(),
      ).filter((s) => !isNil(s.class?.trim(), ''))
    : [];
</script>

<div class="group-member-list-item flex-row small-gap">
  <GroupMemberListItemProfile {member} />
  <div>
    <div class="flex-row small-gap align-items-center">
      <button
        type="button"
        class="inline-transparent-button highlight-on-hover ff-title fs-lg"
        on:click={() => member.sheet.render(true)}>{member.name}</button
      >
      {#if $context.unlocked}
        <RemoveMemberControl {member} />
      {/if}
    </div>

    {#if classAndSubclassSummaries.length}
      <DelimitedTruncatedContent delimiter="<span>|</span>">
        {#each classAndSubclassSummaries as summary (summary.class)}
          <span>
            <span class="text-body-secondary">
              {summary.subclass ?? ''}
              {summary.class}
            </span> <strong>{summary.level}</strong>
          </span>
        {/each}
      </DelimitedTruncatedContent>
      <div class="flex-row small-gap"></div>
    {/if}

    <!-- TODO: Extract to own part component -->
    <AcShieldBase cssClass="group-ac-shield">
      <span class="ac-value">{member.system.attributes.ac.value}</span>
    </AcShieldBase>
  </div>
</div>

<!-- TODO: To dedicated SCSS file(s) -->
<style lang="scss">
  .group-member-list-item {
    // Group Member Class Summary

    // Group AC Shield
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
  }
</style>
