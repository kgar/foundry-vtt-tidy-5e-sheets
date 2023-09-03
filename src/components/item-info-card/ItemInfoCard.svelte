<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import type { ItemCardStore } from 'src/types/types';
  import { getContext, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { warn } from 'src/utils/logging';

  // Freeze
  let frozen: boolean = false;
  $: freezeKey = SettingsProvider.settings.itemCardsFixKey.get()?.toUpperCase();

  function detectFreezeStart(ev: KeyboardEvent) {
    if (frozen) {
      return;
    }

    frozen = ev.key?.toUpperCase() === freezeKey;
  }

  function detectFreezeStop(ev: KeyboardEvent) {
    if (ev.key?.toUpperCase() === freezeKey) {
      frozen = false;
    }
  }

  // Floating
  $: floating = SettingsProvider.settings.itemCardsAreFloating.get();
  let lastMouseEvent: { clientX: number; clientY: number } | null = null;
  let floatingTop: string | null = null;
  let floatingLeft: string | null = null;
  let sheetBorderRight: number = 0;
  let sheetBorderBottom: number = 0;
  let itemCardNode: HTMLElement;
  let sheet: HTMLElement | null = null;

  function onMouseMove(args: { clientX: number; clientY: number }) {
    lastMouseEvent = args;

    if (!floating || !open || frozen) {
      return;
    }

    positionFloatingCard();
  }

  function positionFloatingCard() {
    if (!lastMouseEvent) {
      return;
    }

    const cardWidthPx = rootFontSizePx * cardWidthRem;
    const cardHeightPx = rootFontSizePx * cardHeightRem;
    const cardHalfHeightPx = cardHeightPx / 2;
    const mouseCursorCardGapPx = rootFontSizePx * mouseCursorCardGapRem;

    let mousePos = { x: lastMouseEvent.clientX, y: lastMouseEvent.clientY };
    let top = `${mousePos.y - cardHalfHeightPx}px`;
    let left = `${mousePos.x + mouseCursorCardGapPx}px`;

    if (mousePos.x + cardWidthPx > sheetBorderRight) {
      left = `${mousePos.x - cardWidthPx - mouseCursorCardGapPx}px`;
    }

    if (mousePos.y + cardHalfHeightPx > sheetBorderBottom) {
      let diff = sheetBorderBottom - (mousePos.y + cardHalfHeightPx);
      top = `${mousePos.y - cardHalfHeightPx + diff}px`;
    }

    floatingTop = top;
    floatingLeft = left;
  }

  // Show/Hide
  let open = false;
  let debug = false;
  let timer: any;
  const defaultContentTemplate: ItemCardContentComponent =
    DefaultItemCardContentTemplate;
  let infoContentTemplate: ItemCardContentComponent | undefined;
  $: delayMs = SettingsProvider.settings.itemCardsDelay.get() ?? 0;

  async function showCard() {
    if (!$card.item) {
      return;
    }

    chatData = await $card.item.getChatData({
      secrets: $card.item.actor?.isOwner,
    });

    // console.log({ chatData, item: $card.item });

    /* 
      now that time has passed, 
      check the most current version of the card item, 
      in case the user has moused away. 
    */
    if ($card.item) {
      infoContentTemplate =
        $card.itemCardContentTemplate ?? defaultContentTemplate;
      item = $card.item;

      if (floating) {
        rootFontSizePx = getRootFontSizePx();

        const boundingClientRect = sheet?.getBoundingClientRect();
        if (boundingClientRect) {
          sheetBorderRight = boundingClientRect.right;
          sheetBorderBottom = boundingClientRect.bottom;
        }

        positionFloatingCard();
      }

      open = true;
    }
  }

  // Content
  const card = getContext<Writable<ItemCardStore>>('card');
  const cardWidthRem: number = 17.5;
  const cardHeightRem: number = 28.75;
  const mouseCursorCardGapRem = 1.5;
  let rootFontSizePx = getRootFontSizePx();
  let item: Item5e | undefined;
  let chatData: ItemChatData | undefined;
  $: specialProps = getSpecialProperties(item);
  $: itemProps = chatData?.properties ?? [];
  $: $card,
    (async () => {
      if (frozen) {
        return;
      }

      if ($card.item?.id === item?.id && open) {
        return;
      }

      open = false;
      clearTimeout(timer);

      const newItem = $card.item;

      if (!newItem) {
        return;
      }

      timer = setTimeout(() => showCard(), delayMs);
    })();

  // Lifecycle
  onMount(() => {
    sheet = $card.sheet;
    if (sheet) {
      sheet.addEventListener('mousemove', onMouseMove);
    } else {
      warn(
        'Item Card parent sheet not found. Unable to support floating item card.'
      );
    }
  });

  function getRootFontSizePx(): number {
    return document.documentElement.style.fontSize !== ''
      ? parseFloat(document.documentElement.style.fontSize)
      : parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  function getAllProperties(
    item: Item5e | undefined,
    chatProps: string[] | undefined
  ) {
    chatProps ??= [];

    return [...getSpecialProperties(item), ...chatProps];
  }

  function getSpecialProperties(item: Item5e | undefined): string[] {
    const props: string[] = [];

    if (item?.labels?.toHit) {
      props.push(item.labels.toHit.replace('+ ', '+').replace('- ', '-'));
    }
    if (item?.labels?.damage && item.labels?.derivedDamage?.length > 0) {
      props.push(
        item.labels.derivedDamage[0].label
          .replace(' + ', '+')
          .replace(' - ', '-')
      );
    }
    if (item?.labels?.save) {
      props.push(item.labels.save);
    }

    return props;
  }

  const localize = FoundryAdapter.localize;
</script>

<svelte:window
  on:keydown={detectFreezeStart}
  on:keyup={detectFreezeStop}
  on:mousemove={onMouseMove}
  on:blur={() => (frozen = false)}
/>

<section
  bind:this={itemCardNode}
  class="item-info-container"
  class:open={debug || open}
  class:floating
  style:top={floatingTop}
  style:left={floatingLeft}
  style:--card-width="{cardWidthRem}rem"
  style:--card-height="{cardHeightRem}rem"
>
  <div class="info-wrap">
    <article class="item-info-container-content">
      {#if !!infoContentTemplate && !!item && !!chatData}
        <svelte:component this={infoContentTemplate} {item} {chatData}>
          {#if specialProps.length || itemProps.length}
            <HorizontalLineSeparator />
            {#if specialProps.length}
              <div class="item-properties">
                {#each specialProps as prop}
                  <span class="tag">{prop}</span>
                {/each}
              </div>
            {/if}
            {#if itemProps.length}
              <div class="item-properties">
                {#each itemProps as prop}
                  <span class="tag">{prop}</span>
                {/each}
              </div>
            {/if}
          {/if}
        </svelte:component>
      {:else}
        <h2>😢 Unable to show item card contents</h2>
      {/if}
    </article>
    <HorizontalLineSeparator />

    <article class="info-card-hint">
      <p class:frozen>
        <span class="key">{freezeKey}</span>
        {localize('TIDY5E.ItemCardsKeyHint')}
      </p>
      <p><i class="fas fa-mouse" /> {localize('TIDY5E.ItemCardsMouseHint')}</p>
    </article>
  </div>
</section>

<style lang="scss">
  .item-info-container {
    position: absolute;
    top: 50%;
    right: calc(100%);
    transform: translateY(-50%);
    width: 0;
    height: var(--card-height);
    background: var(--t5ek-item-info-card-bg);
    border-radius: 0.3125rem 0 0 0.3125rem;
    z-index: -10;
    box-shadow: 0 0 0.3125rem rgba(0, 0, 0, 0.5);
    transition: width 0.2s ease;
    overflow: hidden;

    &.open {
      width: var(--card-width);
    }

    &.floating {
      position: fixed;
      z-index: 100;
      border-radius: 0.3125rem;
      right: auto;
      transform: translateY(0);
      transition: none;

      &.open {
        transition: width 0.2s ease;
      }

      .info-wrap {
        border: none;
      }
    }

    .info-wrap {
      display: flex;
      height: 100%;
      flex-direction: column;
      border-right: 0.0625rem solid var(--t5ek-light-color);
    }

    .info-card-hint {
      width: 17.4375rem;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem 0 0.5rem;
      font-style: italic;

      .frozen .key {
        background: var(--t5ek-primary-accent-color);
      }

      .key {
        display: inline-block;
        background: var(--t5ek-primary-font-color);
        color: var(--t5ek-background);
        border-radius: 0.1875rem;
        font-style: normal;
        padding: 0 0.25rem;
        text-transform: uppercase;
      }
      p {
        margin: 0 0 0.25rem 0;
      }
    }
  }

  .item-info-container-content {
    flex: 1;
    overflow: hidden;
  }
</style>
