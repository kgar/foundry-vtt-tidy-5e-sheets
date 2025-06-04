import type { Component, ComponentProps } from 'svelte';
import { warn } from 'src/utils/logging';
import { clamp } from 'src/utils/numbers';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export type InfoCardState<T extends Component<any>> = {
  component: T;
  props: ComponentProps<T>;
  title: string;
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
  cardWidthAbsolute: number;
  cardHeightAbsolute: number;
  widthPx: string;
  heightPx: string;
};

export function getInfoCardDimensions(): InfoCardDimensions {
  const rootFontSize = getRootFontSizePx();

  return {
    widthRem: `${cardWidthRem}rem`,
    heightRem: `${cardHeightRem}rem`,
    rootFontSize: rootFontSize,
    cardWidthAbsolute: cardWidthRem * rootFontSize,
    cardHeightAbsolute: cardHeightRem * rootFontSize,
    widthPx: `${cardWidthRem * rootFontSize}px`,
    heightPx: `${cardHeightRem * rootFontSize}px`,
  };
}

type FloatingPositionParams = {
  event: MouseEvent;
  dimensions: InfoCardDimensions;
  sheet: any;
};

type StaticCardPositionParams = {
  dimensions: InfoCardDimensions;
  sheetEl: HTMLElement;
};

const mouseCursorCardGapRem = 1.5;

export function getStaticCardPosition({
  sheetEl,
  dimensions,
}: StaticCardPositionParams): 'left' | 'right' {
  return sheetEl.offsetLeft >
    dimensions.cardWidthAbsolute +
      mouseCursorCardGapRem * dimensions.rootFontSize
    ? 'left'
    : 'right';
}

export function getInfoCardFloatingPosition(params: FloatingPositionParams) {
  const { clientX: x, clientY: y } = params.event;
  const { rootFontSize, cardWidthAbsolute, cardHeightAbsolute } =
    params.dimensions;
  const sheetEl = params.sheet.element;

  const cardHalfHeightPx = cardHeightAbsolute / 2;
  const mouseCursorCardGapPx = rootFontSize * mouseCursorCardGapRem;

  const relativeY = y - params.sheet.position.top;
  const relativeX = x - params.sheet.position.left;

  const putCardOnLeftSide =
    x + mouseCursorCardGapPx + cardWidthAbsolute > window.innerWidth;

  const minTop = sheetEl.offsetTop * -1 + mouseCursorCardGapPx;
  const verticallyCenteredCardTop = relativeY - cardHalfHeightPx;
  const maxTop =
    window.innerHeight -
    sheetEl.offsetTop -
    cardHeightAbsolute -
    mouseCursorCardGapPx;

  let top = clamp(verticallyCenteredCardTop, minTop, maxTop);
  let left = putCardOnLeftSide
    ? relativeX - mouseCursorCardGapPx - cardWidthAbsolute
    : relativeX + mouseCursorCardGapPx;

  if (relativeY + cardHalfHeightPx > params.sheet.position.bottom) {
    let diff = window.innerHeight - (relativeY + cardHalfHeightPx);
    top = relativeY - cardHalfHeightPx + diff;
  }

  return { top: `${top}px`, left: `${left}px` };
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
      'mouseleave',
      (ev) => {
        args.hoverOff(ev);
      },
      { passive: true, signal: controller.signal }
    );

    sheetNode?.addEventListener(
      'dragstart',
      (ev) => {
        if (ev.target === null) {
          return;
        }

        const target = (ev.target as HTMLElement | undefined)?.closest?.(
          args.selector
        );

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
