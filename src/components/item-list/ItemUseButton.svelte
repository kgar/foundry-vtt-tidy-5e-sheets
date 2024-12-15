<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Snippet } from 'svelte';

  interface Props {
    item: any;
    imgUrlOverride?: string | undefined;
    disabled?: boolean;
    showDiceIconOnHover?: boolean;
    afterRollButton?: Snippet;
  }

  let {
    item,
    imgUrlOverride = undefined,
    disabled = false,
    showDiceIconOnHover = true,
    afterRollButton,
  }: Props = $props();
</script>

<a
  class="item-use-button"
  onclick={(event) => !disabled && FoundryAdapter.actorTryUseItem(item, event)}
  oncontextmenu={(event) =>
    FoundryAdapter.onActorItemButtonContextMenu(item, { event })}
>
  <img
    class="item-image"
    class:conceal={item.system.identified === false}
    alt={item.name}
    src={imgUrlOverride ?? item.img}
    data-tidy-sheet-part={CONSTANTS.SHEET_PARTS.GROUP_MEMBER_PORTRAIT}
  />

  <div
    role="presentation"
    aria-hidden="true"
    class="unidentified-glyph no-transition"
    class:conceal={item.system.identified === false}
  >
    <i class="fas fa-question"></i>
  </div>

  {#if showDiceIconOnHover}
    <i class="roll-indicator fa fa-dice-d20"></i>
  {/if}

  {@render afterRollButton?.()}
</a>
