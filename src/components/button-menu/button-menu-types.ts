export type ButtonMenuContext = {
  close(): void;
};

export type ButtonMenuPositionStyleInPixels = { left: number, top: number };

export type ButtonMenuPosition = 'top' | 'right' | 'bottom' | 'left';

export type ButtonMenuAnchor = ButtonMenuPosition | 'center';
