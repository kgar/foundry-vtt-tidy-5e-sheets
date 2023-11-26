<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import type { ItemCardStore } from 'src/types/types';
  import { getContext, onDestroy, onMount } from 'svelte';
  import type { Writable } from 'svelte/store';
  import HorizontalLineSeparator from '../layout/HorizontalLineSeparator.svelte';
  import { warn } from 'src/utils/logging';
  import { settingStore } from 'src/settings/settings';
  import { getItemCardContentTemplate } from './item-info-card';

  // Fix Key
  let frozen: boolean = false;
  $: fixKey = $settingStore.itemCardsFixKey?.toUpperCase();

  function detectFixStart(ev: KeyboardEvent) {
    if (frozen) {
      return;
    }

    frozen = ev.key?.toUpperCase() === fixKey;
  }

  function detectFixStop(ev: KeyboardEvent) {
    if (ev.key?.toUpperCase() === fixKey) {
      frozen = false;
    }
  }

  // Floating
  let lastMouseEvent: { clientX: number; clientY: number } | null = null;
  let floatingTop: string | null = null;
  let floatingLeft: string | null = null;
  let sheetBorderRight: number = 0;
  let sheetBorderBottom: number = 0;
  let itemCardNode: HTMLElement;
  let sheet: HTMLElement | null = null;

  function onMouseMove(args: { clientX: number; clientY: number }) {
    lastMouseEvent = args;

    if (!$settingStore.itemCardsAreFloating || !open || frozen) {
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
  $: {
    const body = itemCardNode?.ownerDocument?.body;
    if (body && open) {
      listenForBodyEvents(body);
    } else if (body && !open) {
      stopListeningForBodyEvents(body);
    }
  }
  function listenForBodyEvents(body: HTMLElement) {
    body.addEventListener('keydown', detectFixStart);
    body.addEventListener('keyup', detectFixStop);
    body.addEventListener('mousemove', onMouseMove);
  }
  function stopListeningForBodyEvents(body: HTMLElement) {
    body.addEventListener('keydown', detectFixStart);
    body.addEventListener('keyup', detectFixStop);
    body.addEventListener('mousemove', onMouseMove);
  }
  let debug = false;
  let timer: any;
  let infoContentTemplate: ItemCardContentComponent | null;
  $: delayMs = $settingStore.itemCardsDelay ?? 0;

  async function showCard() {
    if (!$card.item) {
      return;
    }

    chatData = await $card.item.getChatData({
      secrets: $card.item.actor?.isOwner,
    });

    /* 
      now that time has passed, 
      check the most current version of the card item, 
      in case the user has moused away. 
    */
    if ($card.item) {
      infoContentTemplate = $card.itemCardContentTemplate;
      item = $card.item;

      if ($settingStore.itemCardsAreFloating) {
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
        'Item Card parent sheet not found. Unable to support floating item card.',
      );
    }
  });

  onDestroy(() => {
    const body = itemCardNode.ownerDocument.body;
    body && stopListeningForBodyEvents(body);
  });

  function getRootFontSizePx(): number {
    return document.documentElement.style.fontSize !== ''
      ? parseFloat(document.documentElement.style.fontSize)
      : parseFloat(getComputedStyle(document.documentElement).fontSize);
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
          .replace(' - ', '-'),
      );
    }
    if (item?.labels?.save) {
      props.push(item.labels.save);
    }

    return props;
  }

  const localize = FoundryAdapter.localize;
</script>

<section
  bind:this={itemCardNode}
  class="item-info-container"
  class:open={debug || open}
  class:floating={$settingStore.itemCardsAreFloating}
  style:top={$settingStore.itemCardsAreFloating ? floatingTop : undefined}
  style:left={$settingStore.itemCardsAreFloating ? floatingLeft : undefined}
  style:--card-width="{cardWidthRem}rem"
  style:--card-height="{cardHeightRem}rem"
>
  <div class="info-wrap">
    <article class="item-info-container-content">
      {#if !!item && !!chatData}
        <svelte:component
          this={infoContentTemplate ?? getItemCardContentTemplate(item)}
          {item}
          {chatData}
        >
          {#if specialProps.length || itemProps.length}
            <HorizontalLineSeparator />
            {#if specialProps.length}
              <div class="item-properties">
                {#each specialProps as prop}
                  <span class="tag">{prop}</span>
                {/each}
              </div>
              <HorizontalLineSeparator cssClass="prop-separator" />
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

    <article class="item-info-card-hints">
      <p class:frozen>
        <span class="key">{fixKey}</span>
        {localize('T5EK.ItemCardsKeyHint')}
      </p>
      <p><i class="fas fa-mouse" /> {localize('T5EK.ItemCardsMouseHint')}</p>
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
    background: var(--t5ek-item-info-card-background);
    border-radius: 0.3125rem 0 0 0.3125rem;
    z-index: -10;
    box-shadow: 0 0 0.3125rem var(--t5ek-item-info-card-box-shadow-color);
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
      border-right: 0.0625rem solid var(--t5ek-faint-color);
    }

    .item-info-card-hints {
      width: var(--card-width);
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
