<script lang="ts">
  import HpBar from 'src/components/bar/HpBar.svelte';
  import ResourceWithBar from 'src/components/bar/ResourceWithBar.svelte';
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { settings } from 'src/settings/settings.svelte';
  import type { Actor5e } from 'src/types/types';
  import { getPercentage } from 'src/utils/numbers';

  interface Props {
    member: Actor5e;
    showHp: boolean;
  }

  let { member, showHp }: Props = $props();

  const localize = FoundryAdapter.localize;
</script>

<div role="presentation" class="member-list-item-image-wrapper">
  <button
    class="unbutton"
    type="button"
    onclick={() =>
      FoundryAdapter.renderImagePopout(member.img, {
        title: FoundryAdapter.localize('TIDY5E.PortraitTitle', {
          subject: member.name,
        }),
        shareable: true,
        uuid: member.uuid,
      })}
    tabindex={settings.value.useAccessibleKeyboardSupport ? 0 : -1}
  >
    <img
      class="member-list-item-image"
      src={member.img}
      alt={member.name}
      data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.GROUP_MEMBER_PORTRAIT}
    />
  </button>

  {#if showHp}
    <div class="member-list-item-hp-bar">
      <ResourceWithBar
        document={member}
        value={member.system.attributes.hp.value}
        valueField="system.attributes.hp.value"
        valueTitle={localize('DND5E.HitPointsCurrent')}
        valueDisabled={true}
        max={member.system.attributes.hp.max}
        maxField="system.attributes.hp.max"
        maxTitle={localize('DND5E.HitPointsMax')}
        maxDisabled={true}
        percentage={getPercentage(
          member.system.attributes.hp.value,
          member.system.attributes.hp.max,
        )}
        Bar={HpBar}
      />
    </div>
  {/if}
</div>
