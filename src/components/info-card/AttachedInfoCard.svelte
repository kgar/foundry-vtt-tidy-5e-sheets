<script lang="ts">
  import { warn } from 'src/utils/logging';
  import {
    getInfoCardDimensions,
    getInfoCardFloatingPosition,
    getStaticCardPosition,
    infoCardEventWatcher,
    type InfoCardDimensions,
    type InfoCardState,
  } from './info-card.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DefaultItemCard from './Cards/DefaultItemCard.svelte';
  import InventoryItemCard from './Cards/InventoryItemCard.svelte';
  import SpellItemCard from './Cards/SpellItemCard.svelte';
  import EffectInfoCard from './Cards/EffectInfoCard.svelte';
  import { Inventory } from 'src/features/sections/Inventory';
  import { CONSTANTS } from 'src/constants';
  import { isUserInteractable } from 'src/utils/element';
  import { DetachedInfoCardApplication } from 'src/applications/info-card/DetachedInfoCardApplication';
  import { settings } from 'src/settings/settings.svelte';
  import { componentWithProps } from 'src/utils/component';

  interface Props {
    sheet: any;
  }

  let { sheet }: Props = $props();

  let floating = $derived(settings.value.itemCardsAreFloating);
  let inspectKey = $derived(settings.value.itemCardsFixKey);
  let delay = $derived(settings.value.itemCardsDelay);

  const localize = FoundryAdapter.localize;

  const infoCardAttributeKey = 'data-info-card';
  const selector = `[${infoCardAttributeKey}], .tidy-info-card`;
  const uuidAttribute = 'data-info-card-entity-uuid';
  const sheetEl = $derived<HTMLElement>(sheet.element);

  let staticCardPosition = $derived.by<'left' | 'right'>(() => {
    show;
    return getStaticCardPosition({ dimensions, sheetEl });
  });

  let show = $state(false);

  // When floating, reposition the card whenever shown and mousing over the sheet.
  $effect(() => {
    const controller = new AbortController();

    if (floating) {
      sheetEl.addEventListener(
        'mousemove',
        (event) => {
          let { top, left } = getInfoCardFloatingPosition({
            event,
            sheet,
            dimensions,
          });
          floatingLeft = left;
          floatingTop = top;
        },
        { signal: controller.signal },
      );
    }

    return () => {
      controller.abort();
    };
  });

  let card = $state<InfoCardState<any> | undefined>();
  let floatingLeft = $state<string | undefined>();
  let floatingTop = $state<string | undefined>();
  let dimensions = $state<InfoCardDimensions>(getInfoCardDimensions());

  async function hoverOn(_event: MouseEvent, target: HTMLElement) {
    // Get the card state
    const cardType = target.getAttribute('data-info-card');
    const uuid = target.getAttribute(uuidAttribute);

    if (!uuid || !cardType) {
      show = false;
      return;
    }

    switch (cardType) {
      case 'effect': {
        if (!settings.value.useEffectCards) {
          show = false;
          return;
        }

        const entity = await fromUuid(uuid);

        if (!entity) {
          show = false;
          return;
        }

        card = {
          component: EffectInfoCard,
          props: { activeEffect: entity },
          title: entity.name,
        } satisfies InfoCardState<typeof EffectInfoCard>;
        break;
      }
      // case 'activity': {
      //   card = {
      //     component: ActivityInfoCard,
      //     props: { activity: entity },
      //     title: entity.name,
      //   };
      //   break;
      // }
      // TODO: Uncomment the above case when it's time to implement it

      case 'item': {
        if (
          !settings.value.itemCardsForAllItems &&
          !target.matches('[data-tidy-grid-item]')
        ) {
          show = false;
          return;
        }

        const entity = await fromUuid(uuid);

        if (!entity) {
          show = false;
          return;
        }

        if (Inventory.isItemInventoryType(entity)) {
          card = {
            ...componentWithProps(InventoryItemCard, { item: entity }),
            title: entity.name,
          } satisfies InfoCardState<typeof InventoryItemCard>;
        } else if (entity?.type === CONSTANTS.ITEM_TYPE_SPELL) {
          card = {
            ...componentWithProps(SpellItemCard, { item: entity }),
            title: entity.name,
          } satisfies InfoCardState<typeof InventoryItemCard>;
        } else {
          card = {
            ...componentWithProps(DefaultItemCard, { item: entity }),
            title: entity.name,
          } satisfies InfoCardState<typeof InventoryItemCard>;
        }

        break;
      }
      default: {
        show = false;
        return;
      }
    }

    show = true;
  }

  function hoverOff() {
    show = false;
  }

  function dragStart() {
    show = false;
  }

  function inspectKeyUp() {
    if (!show || !card) {
      return;
    }

    const focusedElement = sheetEl.ownerDocument.activeElement;

    if (
      focusedElement instanceof HTMLElement &&
      isUserInteractable(focusedElement)
    ) {
      return;
    }

    new DetachedInfoCardApplication(
      { ...card },
      {
        window: { title: card.title },
        position: {
          width: dimensions.cardWidthAbsolute,
          height: dimensions.cardHeightAbsolute,
        },
      },
    ).render(true);

    hoverOff();
  }

  function onError(error: unknown) {
    warn('An error occurred while managing the info card', false, {
      error,
      card,
      sheet,
    });
  }
</script>

<section
  class="tidy-info-card attached {!floating ? staticCardPosition : ''}"
  class:show
  class:floating
  data-tidy-info-card
  style:top={floating ? floatingTop : undefined}
  style:left={floating ? floatingLeft : undefined}
  style:--card-width={dimensions.widthRem}
  style:--card-height={dimensions.heightRem}
  style:--transition-show-delay="{delay}ms"
  use:infoCardEventWatcher={{
    hoverOn,
    hoverOff,
    dragStart,
    inspectKeyUp,
    selector: selector,
    inspectKey: inspectKey,
  }}
>
  {#if card?.component}
    <section class="info-card-body">
      <svelte:boundary onerror={onError}>
        <card.component {...card.props} />
      </svelte:boundary>
    </section>
    <footer>
      <span>
        {@html localize('TIDY5E.InfoCardInspectHint', {
          inspectKey: `<span class="key">${inspectKey}</span>`,
        })}
      </span>
      <span>
        <i class="fas fa-mouse"></i>
        {localize('TIDY5E.ItemCardsMouseHint')}
      </span>
    </footer>
  {/if}
</section>
