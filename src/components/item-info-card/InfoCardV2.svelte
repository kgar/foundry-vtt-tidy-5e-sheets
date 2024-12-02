<script lang="ts">
  import { warn } from 'src/utils/logging';
  import {
    getInfoCardDimensions,
    getInfoCardFloatingPosition,
    infoCardHoverWatcher,
    type InfoCardDimensions,
    type InfoCardState,
  } from './item-info-card.svelte';
  import ActivityInfoCardV2 from './ActivityInfoCardV2.svelte';
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import DefaultItemCardV2 from './DefaultItemCardV2.svelte';
  import InventoryItemCardV2 from './InventoryItemCardV2.svelte';
  import SpellItemCardV2 from './SpellItemCardV2.svelte';
  import { Inventory } from 'src/features/sections/Inventory';
  import { CONSTANTS } from 'src/constants';
  import type { Component, ComponentProps } from 'svelte';

  interface Props {
    sheet: any;
    floating: boolean;
    fixKey: string;
    delay: number;
  }

  let { sheet, floating, fixKey, delay }: Props = $props();

  const localize = FoundryAdapter.localize;

  const infoCardAttributeKey = 'data-info-card';
  const selector = `[${infoCardAttributeKey}]`;
  const uuidAttribute = 'data-info-card-entity-uuid';

  let show = $state(false);
  // TODO: Support card on right side when no room on left
  let position: 'left' | 'right' | 'floating' = $state(
    floating ? 'floating' : 'left',
  );
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
      case 'activity': {
        card = {
          component: ActivityInfoCardV2,
          props: { activity: entity },
        };
        break;
      }

      case 'item': {
        // TODO: Distinguish the item card component based on the item type.
        // Inventory
        card = Inventory.isInventoryType(entity)
          ? withProps(InventoryItemCardV2, { item: entity })
          : entity?.type === CONSTANTS.ITEM_TYPE_SPELL
            ? withProps(SpellItemCardV2, { item: entity })
            : withProps(DefaultItemCardV2, { item: entity });
        break;
      }
      default: {
        show = false;
        return;
      }
    }

    // Position the card
    if (floating) {
      let { top, left } = getInfoCardFloatingPosition({
        event,
        sheet: sheet,
        dimensions,
      });
      floatingLeft = left;
      floatingTop = top;
    } else {
    }

    // if everything is good, show it
    show = true;
  }

  function hoverOff() {
    show = false;
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
  class="tidy-info-card {position}"
  class:show
  style:top={floating ? floatingTop : undefined}
  style:left={floating ? floatingLeft : undefined}
  style:--card-width={dimensions.widthRem}
  style:--card-height={dimensions.heightRem}
  style:--transition-show-delay="{delay}ms"
  use:infoCardHoverWatcher={{ hoverOn, hoverOff, selector: selector }}
>
  {#if card?.component}
    <section class="info-card-body">
      <svelte:boundary onerror={onError}>
        <card.component {...card.props} />
      </svelte:boundary>
    </section>
    <footer>
      <span>
        <span class="key">{fixKey}</span>
        {localize('TIDY5E.ItemCardsKeyHint')}
      </span>
      <span>
        <i class="fas fa-mouse"></i>
        {localize('TIDY5E.ItemCardsMouseHint')}
      </span>
    </footer>
  {/if}
</section>
