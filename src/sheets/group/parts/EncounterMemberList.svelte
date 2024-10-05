<script lang="ts">
  import TidyTable from 'src/components/table/TidyTable.svelte';
  import TidyTableHeaderCell from 'src/components/table/TidyTableHeaderCell.svelte';
  import TidyTableHeaderRow from 'src/components/table/TidyTableHeaderRow.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import {
    type GroupSheetClassicContext,
    type Group5eMember,
    type GroupMemberSection,
  } from 'src/types/group.types';
  import { getContext } from 'svelte';
  import type { Readable } from 'svelte/store';
  import RemoveMemberControl from './RemoveMemberControl.svelte';
  import TidyTableCell from 'src/components/table/TidyTableCell.svelte';
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

  const crColumnDef = section.showCrColumn ? '/* CR */ 7rem' : '';
  $: gridTemplateColumns = `
    /* Image and name */ 1fr 
    /* Quantity */ 5rem 
    /* Formula */ 7rem 
    ${crColumnDef} 
    ${classicControlsWidth}`;

  function saveQuantityChange(
    $context: GroupSheetClassicContext,
    ev: Event & { currentTarget: HTMLInputElement },
    memberActorId: string,
  ) {
    $context.actor.sheet.updateMemberQuantity(memberActorId, ev);
    return false;
  }

  function saveFormulaChange(
    $context: GroupSheetClassicContext,
    ev: Event & { currentTarget: HTMLInputElement },
    memberActorId: string,
  ) {
    $context.actor.sheet.updateMemberFormula(memberActorId, ev);
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
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class="inline-icon-button"
            title={localize('DND5E.QuantityRoll')}
            on:click={() => $context.actor.system.rollQuantities()}
          >
            <i class="fas fa-dice"></i>
          </a>
        </TidyTableHeaderCell>
        <TidyTableHeaderCell>
          <!-- Formula -->
        </TidyTableHeaderCell>
        {#if section.showCrColumn}
          <TidyTableHeaderCell>
            {localize('DND5E.Group.Challenge')}
          </TidyTableHeaderCell>
        {/if}
        <TidyTableHeaderCell>
          <!-- Controls -->
        </TidyTableHeaderCell>
      </TidyTableHeaderRow>
    </svelte:fragment>
    <svelte:fragment slot="body">
      <div class="flex-column no-gap">
        {#each section.members as member, index (member.uuid)}
          {@const ctx = $context.memberContext[member.id]}
          {#if $memberActorIdsToShow === undefined || $memberActorIdsToShow.has(member.id)}
            <TidyTableRow
              rowContainerAttributes={{
                ['data-member-drag']: '',
                ['data-context-menu']: CONSTANTS.CONTEXT_MENU_TYPE_GROUP_MEMBER,
                ['data-member-id']: member.id,
                ['data-context-menu-document-uuid']: member.uuid,
              }}
            >
              <TidyTableCell class="flex-row small-gap" primary={true}>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-missing-attribute -->

                <a
                  class="inline-transparent-button"
                  on:click={() =>
                    ctx.canObserve && FoundryAdapter.renderImagePopout(member.img, {
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
                </a>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <!-- svelte-ignore a11y-missing-attribute -->

                <a
                  class="encounter-member-name transparent-button highlight-on-hover"
                  on:click={() => member.sheet.render(true)}
                >
                  {member.name}
                </a>
              </TidyTableCell>
              <TidyTableCell>
                <TextInput
                  document={$context.actor}
                  field="system.members.{ctx.index}.quantity.value"
                  value={$context.system.members[ctx.index].quantity.value}
                  allowDeltaChanges={true}
                  selectOnFocus={true}
                  onSaveChange={(ev) =>
                    saveQuantityChange($context, ev, member.id)}
                  placeholder="1"
                />
              </TidyTableCell>
              <TidyTableCell>
                <TextInput
                  document={$context.actor}
                  field="system.members.{ctx.index}.quantity.formula"
                  value={$context.system.members[ctx.index].quantity.formula}
                  allowDeltaChanges={true}
                  selectOnFocus={true}
                  onSaveChange={(ev) =>
                    saveFormulaChange($context, ev, member.id)}
                  placeholder={localize('DND5E.Formula')}
                />
              </TidyTableCell>
              {#if section.showCrColumn}
                <TidyTableCell>
                  {#if member.type === CONSTANTS.SHEET_TYPE_NPC}
                    <abbr class="text-body-secondary"
                      >{localize('DND5E.AbbreviationCR')}</abbr
                    >&nbsp;
                    <span class="text-body semibold"
                      >{FoundryAdapter.formatCr(member.system.details.cr)}</span
                    >
                    {#if !$context.disableExperience}
                      &nbsp;—&nbsp;
                      <span class="text-body semibold">
                        {FoundryAdapter.formatNumber(
                          member.system.details.xp.value *
                            (ctx.quantity?.value ?? 1),
                        )}
                      </span>&nbsp;
                      <abbr>{localize('DND5E.ExperiencePointsAbbr')}</abbr>
                    {/if}
                  {/if}
                </TidyTableCell>
              {/if}
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
