<script lang="ts">
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type GroupSheetClassicContext,
    type Group5e,
    type Group5eMember,
    type GroupMemberSection,
  } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import GroupEncounterMemberListItem from './GroupEncounterMemberListItem.svelte';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
  import ActorPortrait from 'src/sheets/actor/ActorPortrait.svelte';
  import TidyTableRow from 'src/components/table/TidyTableRow.svelte';
  import TextInput from 'src/components/inputs/TextInput.svelte';

  export let section: GroupMemberSection;

  const memberActorIdsToShow = getContext<Readable<Set<string> | undefined>>(
    CONSTANTS.SVELTE_CONTEXT.MEMBER_IDS_TO_SHOW,
  );

  const context = getContext<Readable<GroupSheetClassicContext>>(
    CONSTANTS.SVELTE_CONTEXT.CONTEXT,
  );

  const localize = FoundryAdapter.localize;

  const classicControlWidthRems = 1.5;

  const classicControls = [
    {
      component: RemoveMemberControl,
      getProps: (member: Group5eMember) => ({ member }),
    },
  ];

  $: useClassicControls = FoundryAdapter.useClassicControls($context.actor);

  $: classicControlsWidth = useClassicControls
    ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
    : '';

  $: gridTemplateColumns = `
    /* Image and name */ 1fr 
    /* Quantity */ 5rem 
    /* Formula */ 7rem 
    /* CR */ 7rem 
    ${classicControlsWidth}`;

  function mapChangedMember(
    $context: GroupSheetClassicContext,
    ev: Event & { currentTarget: HTMLInputElement },
    memberActorId: string,
  ) {
    $context.actor.sheet.updateMemberQuantity(
      memberActorId,
      ev,
    );
    return false;
  }
</script>

<section
  class="encounter-member-list-section"
  style="--grid-template-columns: {gridTemplateColumns}"
>
  <TidyTable
    key={section.key}
    data-custom-section={section.custom ? true : null}
  >
    <svelte:fragment slot="header">
      <TidyTableHeaderRow>
        <TidyTableHeaderCell primary={true}>
          {localize(section.label)}
        </TidyTableHeaderCell>
        <TidyTableHeaderCell>
          <span>{localize('DND5E.QuantityAbbr')}</span>&nbsp;
          <button
            type="button"
            class="inline-icon-button"
            title={localize('DND5E.QuantityRoll')}
          >
            <i class="fas fa-dice"></i>
          </button>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell>Formula</TidyTableHeaderCell>
        <TidyTableHeaderCell>CR</TidyTableHeaderCell>
        <TidyTableHeaderCell>
          <!-- Controls -->
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      <div class="flex-column mt-1 no-gap">
        {#each section.members as member, index (member.uuid)}
          {@const ctx = $context.memberContext[member.id]}
          {#if $memberActorIdsToShow === undefined || $memberActorIdsToShow.has(member.id)}
            <TidyTableRow>
              <TidyTableCell class="flex-row" primary={true}>
                <button
                  type="button"
                  class="inline-transparent-button"
                  on:click={() =>
                    FoundryAdapter.renderImagePopout(member.img, {
                      title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
                        subject: member.name,
                      }),
                      shareable: true,
                      uuid: member.uuid,
                    })}
                >
                  <img
                    class="encounter-member-list-item-image"
                    alt={member.name}
                    src={member.img}
                    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS
                      .GROUP_MEMBER_PORTRAIT}
                  />
                </button>
                <button
                  type="button"
                  class="encounter-member-name transparent-button highlight-on-hover"
                  on:click={() => member.sheet.render(true)}
                >
                  {member.name}
                </button>
              </TidyTableCell>
              <TidyTableCell>
                <TextInput
                  document={$context.actor}
                  field="system.members.{ctx.index}.quantity.value"
                  value={$context.system.members[ctx.index].quantity.value}
                  allowDeltaChanges={true}
                  selectOnFocus={true}
                  onSaveChange={(ev) =>
                    mapChangedMember($context, ev, member.id)}
                />
              </TidyTableCell>
              <TidyTableCell></TidyTableCell>
              <TidyTableCell></TidyTableCell>
              <TidyTableCell>
                {#if $context.unlocked}
                  <RemoveMemberControl {member} />
                {/if}
              </TidyTableCell>
            </TidyTableRow>
          {/if}
        {/each}
      </div>
    </svelte:fragment>
  </TidyTable>
</section>

<style lang="scss">
  .encounter-member-list-section {
    --t5e-member-list-portrait-size: 3.5rem;

    .encounter-member-list-item-image {
      width: var(--t5e-member-list-portrait-size);
      height: var(--t5e-member-list-portrait-size);
      flex-basis: var(--t5e-member-list-portrait-size);
      object-fit: contain;
      object-position: center;
    }
    .encounter-member-name {
      justify-content: flex-start;
      text-align: left;
    }
  }
</style>
