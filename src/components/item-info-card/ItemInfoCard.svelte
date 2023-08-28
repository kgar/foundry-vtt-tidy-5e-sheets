<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { SettingsProvider } from 'src/settings/settings';
  import type {
    Item5e,
    ItemCardContentComponent,
    ItemChatData,
  } from 'src/types/item';
  import type { ItemCardStore } from 'src/types/types';
  import { getContext } from 'svelte';
  import type { Writable } from 'svelte/store';
  import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';

  const card = getContext<Writable<ItemCardStore>>('card');
  $: delayMs = SettingsProvider.settings.itemCardsDelay.get() ?? 0;
  let open = false;
  let debug = true;
  let timer: any;
  const defaultContentTemplate: ItemCardContentComponent =
    DefaultItemCardContentTemplate;
  let infoContentTemplate: ItemCardContentComponent | undefined;
  let item: Item5e | undefined;
  let chatData: ItemChatData | undefined;

  $: $card,
    (async () => {
      open = false;
      clearTimeout(timer);

      const item = $card.item;

      if (!item) {
        return;
      }

      timer = setTimeout(() => showCard(), delayMs);
    })();

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
      open = true;
    }
  }

  const freezeKey = SettingsProvider.settings.itemCardsFixKey
    .get()
    ?.toUpperCase();

  const localize = FoundryAdapter.localize;
</script>

<section class="item-info-container" class:open={debug || open}>
  <div class="info-wrap">
    <article class="item-info-container-content">
      {#if !!infoContentTemplate && !!item && !!chatData}
        <svelte:component this={infoContentTemplate} {item} {chatData} />
      {:else}
        <h2>😢 Unable to show item card contents</h2>
      {/if}
    </article>

    <article class="info-card-hint">
      <p>
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
      border-top: 0.0625rem solid var(--t5e-faint-color);
      padding: 0.25rem 0.5rem 0 0.5rem;
      font-style: italic;

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
