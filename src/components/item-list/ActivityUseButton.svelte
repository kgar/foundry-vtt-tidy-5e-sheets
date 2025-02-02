<script lang="ts">
  import { CONSTANTS } from 'src/constants';

  interface Props {
    activity: any;
    disabled?: boolean;
    showDiceIconOnHover?: boolean;
  }

  let {
    activity,
    disabled = false,
    showDiceIconOnHover = true,
  }: Props = $props();
</script>

<a
  class="item-use-button"
  onclick={(event) => !disabled && activity.use({ event })}
>
  <img
    class="item-image"
    alt={activity.name}
    src={activity.img}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.GROUP_MEMBER_PORTRAIT}
  />

  {#if showDiceIconOnHover}
    <i class="roll-indicator fa fa-dice-d20"></i>
  {/if}
</a>
