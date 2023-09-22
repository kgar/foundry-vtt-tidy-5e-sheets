import type {
  ButtonMenuAnchor,
  ButtonMenuPosition,
  ButtonMenuPositionStyleInPixels,
} from './button-menu-types';

export function getPositionStyles(
  openerEl: HTMLElement,
  menuEl: HTMLElement,
  position: ButtonMenuPosition,
  anchor: ButtonMenuAnchor,
  gap: string | false
): string {
  let styleObj =
    position === 'bottom'
      ? getBottomPositionStyles(openerEl, menuEl)
      : position === 'left'
      ? getLeftPositionStyles(openerEl, menuEl)
      : position === 'top'
      ? getTopPositionStyles(openerEl, menuEl)
      : position === 'right'
      ? getRightPositionStyles(openerEl, menuEl)
      : null;

  if (!styleObj) {
    return '';
  }

  if (anchor !== 'center') {
    styleObj = anchorMenu(styleObj, anchor, openerEl, menuEl);
  }

  let styleString = Object.entries({ ...styleObj })
    .map((x) => `${x[0]}: ${x[1]}px`)
    .join('; ');

  const gapTransform = getGapTransform(position, gap);

  if (gapTransform) {
    styleString += `; transform: ${gapTransform}`;
  }

  return styleString;
}

function getBottomPositionStyles(
  openerEl: HTMLElement,
  menuEl: HTMLElement
): ButtonMenuPositionStyleInPixels {
  const openerCenterX = Math.ceil(
    openerEl.offsetLeft + Math.max(openerEl.offsetWidth, 1) / 2
  );

  return {
    left: Math.ceil(openerCenterX - menuEl.offsetWidth / 2),
    top: Math.ceil(openerEl.offsetTop + openerEl.offsetHeight),
  };
}

function getLeftPositionStyles(
  openerEl: HTMLElement,
  menuEl: HTMLElement
): ButtonMenuPositionStyleInPixels {
  const openerCenterY = Math.ceil(
    openerEl.offsetTop + Math.max(openerEl.offsetHeight, 1) / 2
  );

  return {
    left: Math.ceil(openerEl.offsetLeft - menuEl.offsetWidth),
    top: Math.ceil(openerCenterY - menuEl.offsetHeight / 2),
  };
}

function getRightPositionStyles(
  openerEl: HTMLElement,
  menuEl: HTMLElement
): ButtonMenuPositionStyleInPixels {
  const openerCenterY = Math.ceil(
    openerEl.offsetTop + Math.max(openerEl.offsetHeight, 1) / 2
  );

  return {
    left: Math.ceil(openerEl.offsetLeft + openerEl.offsetWidth),
    top: Math.ceil(openerCenterY - menuEl.offsetHeight / 2),
  };
}

function getTopPositionStyles(
  openerEl: HTMLElement,
  menuEl: HTMLElement
): ButtonMenuPositionStyleInPixels {
  const openerCenterX = Math.ceil(
    openerEl.offsetLeft + Math.max(openerEl.offsetWidth, 1) / 2
  );

  return {
    left: Math.ceil(openerCenterX - menuEl.offsetWidth / 2),
    top: Math.ceil(openerEl.offsetTop - menuEl.offsetHeight),
  };
}

function anchorMenu(
  styleObj: ButtonMenuPositionStyleInPixels,
  anchor: ButtonMenuAnchor,
  openerEl: HTMLElement,
  menuEl: HTMLElement
): ButtonMenuPositionStyleInPixels {
  switch (anchor) {
    case 'top':
      styleObj.top = openerEl.offsetTop;
      break;
    case 'right':
      const anchoredMenuLeftPixels =
        openerEl.offsetLeft + openerEl.offsetWidth - menuEl.offsetWidth;
      styleObj.left = anchoredMenuLeftPixels;
      break;
    case 'bottom':
      const anchoredMenuTopPixels =
        openerEl.offsetTop + openerEl.offsetHeight - menuEl.offsetHeight;
      styleObj.top = anchoredMenuTopPixels;
      break;
    case 'left':
      styleObj.left = openerEl.offsetLeft;
      break;
  }

  return styleObj;
}

function getGapTransform(position: ButtonMenuPosition, gap: string | false) {
  const translation =
    position === 'top'
      ? `translateY(-${gap})`
      : position === 'right'
      ? `translateX(${gap})`
      : position === 'bottom'
      ? `translateY(${gap})`
      : position === 'left'
      ? `translateX(-${gap})`
      : null;

  if (translation && gap) {
    return translation;
  }

  return null;
}
