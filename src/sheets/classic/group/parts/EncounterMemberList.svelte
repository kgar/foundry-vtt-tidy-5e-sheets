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
  import { settingStore } from 'src/settings/settings';

  interface Props {
    section: GroupMemberSection;
  }

  let { section }: Props = $props();

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

  let useClassicControls = $derived(
    FoundryAdapter.useClassicControls($context.actor),
  );

  let classicControlsWidth = $derived(
    useClassicControls
      ? `/* Controls */ ${classicControlWidthRems * classicControls.length}rem`
      : '',
  );

  const crColumnDef = section.showCrColumn ? '/* CR */ 7rem' : '';
  let gridTemplateColumns = $derived(`
    /* Image and name */ 1fr 
    /* Quantity */ 5rem 
    /* Formula */ 7rem 
    ${crColumnDef} 
    ${classicControlsWidth}`);

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
    {#snippet header()}
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
            onclick={() => $context.actor.system.rollQuantities()}
            tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
          >
            <i class="fas fa-dice"></i>
          </button>
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
    {/snippet}
    {#snippet body()}
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
                <button
                  type="button"
                  class="inline-transparent-button"
                  disabled={!ctx.canObserve}
                  onclick={() =>
                    FoundryAdapter.renderImagePopout(member.img, {
                      title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
                        subject: member.name,
                      }),
                      shareable: true,
                      uuid: member.uuid,
                    })}
                  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
                  onclick={() => member.sheet.render(true)}
                  tabindex={$settingStore.useAccessibleKeyboardSupport ? 0 : -1}
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
    {/snippet}
  </TidyTable>
</section>
