import type { Item5e } from 'src/types/item.types';
import DefaultItemCardContentTemplate from './DefaultItemCardContentTemplate.svelte';
import SpellbookItemCardContent from './SpellbookItemCardContent.svelte';
import InventoryItemCardContent from './InventoryItemCardContent.svelte';
import { Inventory } from 'src/features/sections/Inventory';
import type { Component, ComponentProps } from 'svelte';
import { warn } from 'src/utils/logging';

export type InfoCardState<T extends Component<any>> = {
  component: T;
  props: ComponentProps<T>;
};

export function getItemCardContentTemplate(item: Item5e) {
  // TODO: Make item type to Card Content Template mod-able via the API.
  const inventoryTypes = Inventory.getDefaultInventoryTypes();
  const intentoryItems = new Set(inventoryTypes);

  if (intentoryItems.has(item?.type)) {
    return InventoryItemCardContent;
  }

  switch (item?.type) {
    case 'spell':
      return SpellbookItemCardContent;
    case 'race':
    case 'background':
    case 'class':
    case 'subclass':
    case 'feat':
    default:
      return DefaultItemCardContentTemplate;
  }
}

type InfoCardWatcherArgs = {
  hoverOn: (event: MouseEvent, target: HTMLElement) => void;
  hoverOff: (event: MouseEvent) => void;
  selector: string;
};

const cardWidthRem: number = 17.5;
const cardHeightRem: number = 28.75;

export type InfoCardDimensions = {
  widthRem: string;
  heightRem: string;
  rootFontSize: number;
  widthRelative: number;
  heightRelative: number;
  widthAbsolute: number;
  heightAbsolute: number;
  widthPx: string;
  heightPx: string;
};

export function getInfoCardDimensions(): InfoCardDimensions {
  const rootFontSize = getRootFontSizePx();

  return {
    widthRem: `${cardWidthRem}rem`,
    heightRem: `${cardHeightRem}rem`,
    rootFontSize: rootFontSize,
    widthRelative: cardWidthRem,
    heightRelative: cardHeightRem,
    widthAbsolute: cardWidthRem * rootFontSize,
    heightAbsolute: cardHeightRem * rootFontSize,
    widthPx: `${cardWidthRem * rootFontSize}px`,
    heightPx: `${cardHeightRem * rootFontSize}px`,
  };
}

type FloatingPositionParams = {
  event: MouseEvent;
  dimensions: InfoCardDimensions;
  sheet: HTMLElement;
};

const mouseCursorCardGapRem = 1.5;

export function getInfoCardFloatingPosition(params: FloatingPositionParams) {
  const { clientX, clientY } = params.event;
  const { rootFontSize, widthAbsolute, heightAbsolute } = params.dimensions;

  const cardHalfHeightPx = heightAbsolute / 2;
  const mouseCursorCardGapPx = rootFontSize * mouseCursorCardGapRem;

  let mousePos = { x: clientX, y: clientY };
  let top = `${mousePos.y - cardHalfHeightPx}px`;
  let left = `${mousePos.x + mouseCursorCardGapPx}px`;

  let sheetBorderRight: number = 0;
  let sheetBorderBottom: number = 0;

  const boundingClientRect = params.sheet.getBoundingClientRect();
  if (boundingClientRect) {
    sheetBorderRight = boundingClientRect.right;
    sheetBorderBottom = boundingClientRect.bottom;
  }

  if (mousePos.x + widthAbsolute > sheetBorderRight) {
    left = `${mousePos.x - widthAbsolute - mouseCursorCardGapPx}px`;
  }

  if (mousePos.y + cardHalfHeightPx > sheetBorderBottom) {
    let diff = sheetBorderBottom - (mousePos.y + cardHalfHeightPx);
    top = `${mousePos.y - cardHalfHeightPx + diff}px`;
  }

  return { top, left };
}

function getRootFontSizePx(): number {
  return document.documentElement.style.fontSize !== ''
    ? parseFloat(document.documentElement.style.fontSize)
    : parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * Monitors the sheet for hover events of interest and triggers a callback for hovering on and off.
 * This is designed to work in concert with the Info Card to determine what content to show, if any.
 * @param node the info card
 * @param args parameters for wiring up info card hover watch behavior
 */
export function infoCardHoverWatcher(
  node: HTMLElement,
  args: InfoCardWatcherArgs
) {
  $effect(() => {
    const sheetNode = node.closest<HTMLElement>(`.tidy5e-sheet`);

    if (!sheetNode) {
      warn('Unable to wire up info card watcher. Sheet element not found.');
      return;
    }

    const controller = new AbortController();

    sheetNode?.addEventListener(
      'mouseenter',
      (ev) => {
        const target = (
          ev.target as HTMLElement | undefined
        )?.closest<HTMLElement>(args.selector);

        if (target) {
          args.hoverOn(ev, target);
        }
      },
      { passive: true, signal: controller.signal }
    );

    sheetNode?.addEventListener(
      'mouseover',
      (ev) => {
        const target = (
          ev.target as HTMLElement | undefined
        )?.closest<HTMLElement>(args.selector);

        if (target) {
          args.hoverOn(ev, target);
        } else {
          args.hoverOff(ev);
        }
      },
      { passive: true, signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  });
}
