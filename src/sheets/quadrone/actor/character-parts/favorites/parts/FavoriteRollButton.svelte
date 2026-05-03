<script lang="ts" module>
  const PSEUDO_BTN_CLICK_KEYS = new Set([' ', 'Enter']);
</script>

<script lang="ts" generics="TFavorite extends FavoriteContextEntry">
  import { getCharacterSheetQuadroneContext } from 'src/sheets/sheet-context.svelte';
  import type { FavoriteContextEntry } from 'src/types/types';
  import { isNil } from 'src/utils/data';
  import type { HTMLAttributes } from 'svelte/elements';

  type Props = {
    img: string | undefined;
    title: string;
    name: string;
    subtitle: string;
    useTooltip?: boolean;
  } & HTMLAttributes<HTMLElement>;

  let {
    img,
    title,
    name,
    subtitle,
    useTooltip = true,
    class: cssClass,
    ...attributes
  }: Props = $props();

  let context = $derived(getCharacterSheetQuadroneContext());

  let theSubtitle = $state<HTMLElement>();
  let showSubtitle = $derived(!isNil(subtitle, ''));

  let tooltip = $derived(
    useTooltip
      ? `${name} <br /> ${theSubtitle?.innerText.replaceAll('\n', ' • ') ?? ''}`
      : undefined,
  );

  function handleKeyDown(
    e: KeyboardEvent & { currentTarget: EventTarget & HTMLDivElement },
  ) {
    if (!context.editable) {
      return;
    }

    if (!PSEUDO_BTN_CLICK_KEYS.has(e.key)) return;

    e.preventDefault();
    e.currentTarget?.click();
  }
</script>

<!-- We're not using a button here as firefox has a bug with dragging buttons -->
<div
  role="button"
  class={['button button-borderless favorite-button', cssClass]}
  {...attributes}
  onkeydown={handleKeyDown}
  tabindex="0"
  data-tooltip={tooltip}
  aria-disabled={!context.editable}
  data-keyboard-focus
  data-has-roll-modes
>
  <span
    class={[
      'tidy-table-row-use-button item-use-button',
      { disabled: !context.editable },
    ]}
  >
    <img src={img} alt={title} class="item-image" />
    <span class="roll-prompt">
      {#if attributes['data-action']}
        <i class="fa fa-dice-d20"></i>
      {/if}
    </span>
  </span>

  <div class="item-name-container">
    <div class="item-name stacked">
      <span class="title">
        {name}
      </span>
      <span
        class={[
          'subtitle flexrow color-text-lighter font-default-medium',
          { hidden: !showSubtitle },
        ]}
        bind:this={theSubtitle}
      >
        {@html subtitle}
      </span>
    </div>
  </div>
</div>
