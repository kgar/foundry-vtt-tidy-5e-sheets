type PositionStylesArgs = {
  anchor: HTMLElement;
  positioned: HTMLElement;
  direction?: 'up' | 'down';
  side?: 'left' | 'right';
};

export function getPositioningStyles(args: PositionStylesArgs) {
  let { anchor, positioned, direction = 'down', side = 'right' } = args;

  const { clientWidth, clientHeight } = document.documentElement;

  const {
    top: anchorTop,
    left: anchorLeft,
    height: anchorHeight,
    width: anchorWidth,
  } = anchor.getBoundingClientRect();

  const { width: positionedWidth, height: positionedHeight } =
    positioned.getBoundingClientRect();

  let top = 0;

  if (direction === 'down') {
    top =
      anchorTop + anchorHeight + positionedHeight > clientHeight
        ? clientHeight - positionedHeight
        : anchorTop + anchorHeight;
  } else if (direction === 'up') {
    top = anchorTop - positionedHeight < 0 ? 0 : anchorTop - positionedHeight;
  }

  anchorTop + anchorHeight + positionedHeight < clientHeight
    ? anchorTop + anchorHeight
    : anchorTop - positionedHeight;

  let left = 0;

  if (side === 'left') {
    left =
      anchorLeft + positionedWidth > clientWidth
        ? clientWidth - positionedWidth
        : anchorLeft;
  } else if (side === 'right') {
    left =
      anchorLeft + anchorWidth - positionedWidth < 0
        ? 0
        : anchorLeft + anchorWidth - positionedWidth;
  }

  return {
    top: `${top}px`,
    left: `${left}px`,
  };
}
