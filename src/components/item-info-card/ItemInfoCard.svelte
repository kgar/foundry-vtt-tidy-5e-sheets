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
      // TODO: Pull this from $card and coalesce to default then not available
      infoContentTemplate = defaultContentTemplate;
      item = $card.item;
      open = true;
    }
  }

  const freezeKey = SettingsProvider.settings.itemCardsFixKey
    .get()
    ?.toUpperCase();

  const localize = FoundryAdapter.localize;
</script>

<section class="item-info-container" class:open>
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

    .info-card {
      padding: 0.375rem 0.5rem 0.25rem 0.5rem;
      border-radius: 0.3125rem 0 0 0;
      overflow: hidden;
      height: 100%;
      width: 17.4375rem;
      display: flex;
      flex-direction: column;

      &.equipped {
        background: var(--t5e-equipped);
        background: linear-gradient(
          180deg,
          var(--t5e-equipped) 0rem,
          var(--t5e-equipped) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.prepared {
        background: var(--t5e-prepared);
        background: linear-gradient(
          180deg,
          var(--t5e-prepared) 0rem,
          var(--t5e-prepared) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.pact {
        background: var(--t5e-pact);
        background: linear-gradient(
          180deg,
          var(--t5e-pact) 0rem,
          var(--t5e-pact) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.atwill {
        background: var(--t5e-atwill);
        background: linear-gradient(
          180deg,
          var(--t5e-atwill) 0rem,
          var(--t5e-atwill) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.innate {
        background: var(--t5e-innate);
        background: linear-gradient(
          180deg,
          var(--t5e-innate) 0rem,
          var(--t5e-innate) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.alwaysprepared {
        background: var(--t5e-alwaysprepared);
        background: linear-gradient(
          180deg,
          var(--t5e-alwaysprepared) 0rem,
          var(--t5e-alwaysprepared) 1.625rem,
          rgba(0, 0, 0, 0) 2.25rem
        );
      }

      &.magic-item {
        box-shadow: 0 0 0.375rem 0.125rem var(--t5e-magic-accent) inset;
      }

      .info-card-name {
        font-family: var(--t5e-modesto);
        font-size: 1.5rem;
        margin: 0 0 0.25rem 0;
        line-height: 1;
      }

      .ammo-switch {
        height: unset;
        margin-left: 0;
        margin-bottom: 0.25rem;
        font-size: 0.75rem;
        font-family: 'Signika';
      }

      .info-card-states,
      .info-card-trade,
      .info-card-amount,
      .info-card-properties {
        font-size: 0.75rem;
        display: flex;
        justify-content: space-between;
        border-top: 0.0625rem solid var(--t5e-faint-color);

        span {
          padding: 0.25rem 0;
        }

        i {
          width: 0.8125rem;
          text-align: center;
          margin-right: 0.25rem;
          vertical-align: middle;
        }

        .info-attuned,
        .info-quantity {
          margin-left: auto;
        }
      }

      .description-wrap {
        flex: 1;
        overflow: hidden;
        padding: 0.375rem 0;
        border-top: 0.125rem solid var(--t5e-light-color);
        border-bottom: 0.125rem solid var(--t5e-light-color);
      }

      .info-card-description {
        height: 100%;
        overflow-y: auto;
        line-height: 1.3;

        &.overflowing {
          padding-right: 0.5rem;
        }

        ul,
        ol {
          list-style: disc;
          margin: 0.5rem 0;
          padding: 0 0 0 1rem;

          li {
            margin: 0.25rem 0 0 0;

            &:first-child {
              margin: 0;
            }
          }
        }

        ol {
          list-style: decimal;
        }

        & > *:first-child {
          margin-top: 0;
        }

        & > *:last-child {
          margin-bottom: 0;
        }
      }

      .item-properties {
        margin: 0.25rem 0 0 0;

        .tag {
          white-space: pre-wrap;
        }
      }

      .mod-roll-buttons {
        .item-buttons {
          display: flex;
          white-space: nowrap;
          flex-wrap: wrap;
          gap: 0.125rem;
          margin-top: 0.25rem;
          padding-top: 0.25rem;
          border-top: 0.0625rem solid var(--t5e-light-color);

          .button {
            background: var(--t5e-secondary-color);
            font-size: 0.75rem;
            padding: 0.125rem 0.25rem 0.0625rem 0.25rem;
            border-radius: 0.1875rem;
            color: var(--t5e-background);
          }
        }
      }
    }
  }
</style>
