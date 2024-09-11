export class Tooltip {
  static show(target: HTMLElement, markup: string) {
    game.tooltip.activate(target, {
      text: markup,
      cssClass: 'tidy5e-sheet app-v1 app-v2 classic',
    });
  }
}
