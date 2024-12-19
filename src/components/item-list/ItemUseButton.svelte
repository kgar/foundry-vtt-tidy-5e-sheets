<script lang="ts">
  import { CONSTANTS } from 'src/constants';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let item: any;
  export let imgUrlOverride: string | undefined = undefined;
  export let disabled: boolean = false;
  export let showDiceIconOnHover: boolean = true;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="item-use-button"
  on:click={(event) =>
    !disabled && FoundryAdapter.actorTryUseItem(item, {}, { event })}
  on:contextmenu={(event) =>
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

  <slot name="after-roll-button" />
</a>
