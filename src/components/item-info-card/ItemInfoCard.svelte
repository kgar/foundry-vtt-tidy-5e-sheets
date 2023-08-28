<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import type { ItemCardStore } from 'src/types/types';
  import { getContext, onDestroy, onMount } from 'svelte';
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
  let sheetObserver: IntersectionObserver = new IntersectionObserver(
    ([sheet]) => {
      sheetBorderRight = sheet.boundingClientRect.right;
      sheetBorderBottom = sheet.boundingClientRect.bottom;
    }
  );

  // TODO: Replace pixel perfection with more relative measurements
  function onMouseMove(args: { clientX: number; clientY: number }) {
    lastMouseEvent = args;

    if (!floating || !open || frozen) {
      return;
    }

    positionFloatingCard();
  }

  function positionFloatingCard() {
    console.log(lastMouseEvent);

    if (!lastMouseEvent) {
      return;
    }

    let mousePos = { x: lastMouseEvent.clientX, y: lastMouseEvent.clientY };
    let top = `${mousePos.y - 230}px`;
    let left = `${mousePos.x + 24}px`;

    if (mousePos.x + 304 > sheetBorderRight) {
      left = `${mousePos.x - 304}px`;
    }

    if (mousePos.y + 230 > sheetBorderBottom) {
      let diff = sheetBorderBottom - (mousePos.y + 230);
      top = `${mousePos.y - 230 + diff}px`;
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
        positionFloatingCard();
      }

      open = true;
    }
  }

  // Content
  const card = getContext<Writable<ItemCardStore>>('card');
  let item: Item5e | undefined;
  let chatData: ItemChatData | undefined;
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
    console.warn('mounting');
    let sheet = itemCardNode.closest('.sheet');
    if (sheet) {
      sheetObserver.observe(sheet);
    } else {
      warn(
        'Item Card parent sheet not found. Unable to support floating item card.'
      );
    }
  });

  onDestroy(() => {
    sheetObserver.disconnect();
  });

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
>
  <div class="info-wrap">
    <article class="item-info-container-content">
      {#if !!infoContentTemplate && !!item && !!chatData}
        <svelte:component this={infoContentTemplate} {item} {chatData}>
          {#if itemProps.length}
            <HorizontalLineSeparator cssClass="margin-to-edge" />
            <div class="item-properties">
              {#each itemProps as prop}
                <span class="tag">{prop}</span>
              {/each}
            </div>
          {/if}

          <article class="mod-roll-buttons" />
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
    height: 28.75rem;
    background: url('../../../ui/parchment.jpg');
    border-radius: 0.3125rem 0 0 0.3125rem;
    z-index: -10;
    box-shadow: 0 0 0.3125rem rgba(0, 0, 0, 0.5);
    transition: width 0.2s ease;
    overflow: hidden;

    &.open {
      width: 17.5rem;
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

    a.entity-link,
    a.inline-roll {
      font-size: 0.8125rem;
      border-radius: 0.3125rem;
      padding: 0 0.25rem;
    }

    .info-wrap {
      display: flex;
      height: 100%;
      flex-direction: column;
      border-right: 0.0625rem solid var(--t5e-light-color);
    }

    .info-card-hint {
      width: 17.4375rem;
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem 0 0.5rem;
      font-style: italic;

      .frozen .key {
        background: var(--t5e-primary-accent);
      }

      .key {
        display: inline-block;
        background: var(--t5e-primary-font);
        color: var(--t5e-background);
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
