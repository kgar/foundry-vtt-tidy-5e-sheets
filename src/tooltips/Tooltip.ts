export class Tooltip {
  static show(target: HTMLElement, markup: string, theme: string) {
    game.tooltip.activate(target, {
      html: markup,
      cssClass: `tidy5e-sheet application app-v2 quadrone themed theme-${theme}`,
    });
  }
}
