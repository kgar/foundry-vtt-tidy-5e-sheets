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
  import ActivityInfoCardV2 from './Cards/ActivityInfoCard.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DefaultItemCardV2 from './Cards/DefaultItemCard.svelte';
  import InventoryItemCardV2 from './Cards/InventoryItemCard.svelte';
  import SpellItemCardV2 from './Cards/SpellItemCard.svelte';
  import { Inventory } from 'src/features/sections/Inventory';
  import { CONSTANTS } from 'src/constants';
  import type { Component, ComponentProps } from 'svelte';
  import { isUserInteractable } from 'src/utils/element';
  import { DetachedInfoCardApplicationV2 } from 'src/applications/info-card/DetachedInfoCardApplicationV2';

  interface Props {
    sheet: any;
    floating: boolean;
    inspectKey: string;
    delay: number;
  }

  let { sheet, floating, inspectKey, delay }: Props = $props();

  const localize = FoundryAdapter.localize;

  const infoCardAttributeKey = 'data-info-card';
  const selector = `[${infoCardAttributeKey}], .tidy-info-card`;
  const uuidAttribute = 'data-info-card-entity-uuid';
  const sheetEl = $derived<HTMLElement>(
    FoundryAdapter.getElementFromAppV1OrV2(sheet.element)
  );

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

  // TODO: Find much better home
  function withProps<TComponent extends Component<any>>(
    component: TComponent,
    props: ComponentProps<TComponent>,
  ) {
    return {
      component: component,
      props: props,
    };
  }

  function hoverOn(event: MouseEvent, target: HTMLElement) {
    // Get the card state
    const cardType = target.getAttribute('data-info-card');
    const uuid = target.getAttribute(uuidAttribute);

    const entity = fromUuidSync(uuid);

    if (!uuid || !cardType) {
      show = false;
      return;
    }

    switch (cardType) {
      // case 'activity': {
      //   card = {
      //     component: ActivityInfoCardV2,
      //     props: { activity: entity },
      //     title: entity.name,
      //   };
      //   break;
      // }
      // TODO: Uncomment the above case when it's time to implement it

      case 'item': {
        if (Inventory.isInventoryType(entity)) {
          card = {
            ...withProps(InventoryItemCardV2, { item: entity }),
            title: entity.name,
          };
        } else if (entity?.type === CONSTANTS.ITEM_TYPE_SPELL) {
          card = {
            ...withProps(SpellItemCardV2, { item: entity }),
            title: entity.name,
          };
        } else {
          card = {
            ...withProps(DefaultItemCardV2, { item: entity }),
            title: entity.name,
          };
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
      console.warn('a user interactable detected');
      return;
    }

    new DetachedInfoCardApplicationV2(
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
