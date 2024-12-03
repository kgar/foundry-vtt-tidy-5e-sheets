import type { Component, ComponentProps } from 'svelte';
import { warn } from 'src/utils/logging';

export type InfoCardState<T extends Component<any>> = {
  component: T;
  props: ComponentProps<T>;
};

type InfoCardWatcherArgs = {
  hoverOn: (event: MouseEvent, target: HTMLElement) => void;
  hoverOff: (event: MouseEvent) => void;
  dragStart: (event: DragEvent, isWatchedElement: boolean) => void;
  inspectKeyUp: (event: KeyboardEvent) => void;
  inspectKey: string;
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
  sheet: any;
};

const mouseCursorCardGapRem = 1.5;

export function getInfoCardFloatingPosition(params: FloatingPositionParams) {
  const { clientX: x, clientY: y } = params.event;
  const { rootFontSize, widthAbsolute, heightAbsolute } = params.dimensions;
  const sheetEl = params.sheet.element.get?.(0) ?? params.sheet.element;

  let sheetBorderRight: number = params.sheet.position.right;
  let sheetBorderBottom: number = params.sheet.position.bottom;
  let sheetBorderLeft: number = params.sheet.position.left;
  let sheetBorderTop: number = params.sheet.position.top;

  const cardHalfHeightPx = heightAbsolute / 2;
  const mouseCursorCardGapPx = rootFontSize * mouseCursorCardGapRem;

  const relativeY = y - sheetBorderTop;
  const relativeX = x - sheetBorderLeft;

  let top = `${relativeY - sheetEl.offsetTop - cardHalfHeightPx}px`;
  let left = `${relativeX + mouseCursorCardGapPx}px`;

  if (relativeX + widthAbsolute > sheetBorderRight) {
    left = `${relativeX - widthAbsolute - mouseCursorCardGapPx}px`;
  }

  if (relativeY + cardHalfHeightPx > sheetBorderBottom) {
    let diff = sheetBorderBottom - (relativeY + cardHalfHeightPx);
    top = `${relativeY - cardHalfHeightPx + diff}px`;
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
export function infoCardEventWatcher(
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

    sheetNode?.addEventListener(
      'dragstart',
      (ev) => {
        const target = (
          ev.target as HTMLElement | undefined
        )?.closest<HTMLElement>(args.selector);

        args.dragStart(ev, !!target);
      },
      { signal: controller.signal }
    );

    document?.addEventListener(
      'keyup',
      (ev) => {
        if (ev.key.toUpperCase() === args.inspectKey.toUpperCase()) {
          args.inspectKeyUp(ev);
        }
      },
      { passive: true, signal: controller.signal }
    );

    return () => {
      controller.abort();
    };
  });
}
