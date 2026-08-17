<script lang="ts">
  import TidyTableCell from 'src/components/table-quadrone/TidyTableCell.svelte';
  import MenuButton from 'src/components/table-quadrone/table-buttons/MenuButton.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type { GroupMemberBastionQuadroneContext } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import BastionMemberHeaderCells from './BastionMemberHeaderCells.svelte';
  import ActorTableImage from 'src/sheets/quadrone/shared/ActorTableImage.svelte';

  interface Props {
    member: GroupMemberBastionQuadroneContext;
    hiddenColumns: Set<string>;
    rowActionWidthRems: number;
  }

  let { member, hiddenColumns, rowActionWidthRems }: Props = $props();

  const localize = FoundryAdapter.localize;

  let actor = $derived(member.member.actor);

  let subtitleParts = $derived(
    [
      isNil(member.name, '') ? undefined : member.name,
      `${member.facilities.special.count}/${member.facilities.special.max} ${localize(
        'DND5E.FACILITY.Types.Special.Label.other',
      )}`,
      `${member.facilities.basic.count} ${localize(
        'DND5E.FACILITY.Types.Basic.Label.other',
      )}`,
      localize('DND5E.LevelNumber', { level: member.level }),
    ].filter((part) => !!part),
  );
</script>

<div
  class="tidy-table-row bastion-member"
  style:--t5e-theme-color-default={member.member.accentColor}
  style:--t5e-theme-color-highlight={member.member.highlightColor}
  style:--t5e-member-color-hover={member.member.highlightColor}
  data-member-uuid={actor.uuid}
  data-context-menu={CONSTANTS.CONTEXT_MENU_TYPE_GROUP_BASTION_MEMBER}
>
  <div class="tidy-table-cell actor-image-container">
    <ActorTableImage member={member.member} />
  </div>

  <TidyTableCell primary={true} class="text-cell item-label flexcol">
    <div
      class="actor-name"
      role="button"
      data-keyboard-focus
      tabindex={0}
      data-action="showDocument"
      data-uuid={actor.uuid}
    >
      <h4 class="font-label-medium">{actor.name}</h4>

      <div class="separated-list">
        {#each subtitleParts as part, index}
          <span class="font-label-medium color-text-gold-emphasis">{part}</span>
          {#if index < subtitleParts.length - 1}
            <div class="divider-dot"></div>
          {/if}
        {/each}
      </div>
    </div>
  </TidyTableCell>

  <BastionMemberHeaderCells {member} {hiddenColumns} />

  <TidyTableCell
    columnWidth="{rowActionWidthRems}rem"
    class="tidy-table-actions"
    attributes={{
      ['data-tidy-column-key']: CONSTANTS.COLUMN_KEY_ROW_ACTIONS,
    }}
  >
    <MenuButton targetSelector="[data-context-menu]" />
  </TidyTableCell>
</div>
