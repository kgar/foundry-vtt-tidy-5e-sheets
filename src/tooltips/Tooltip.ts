export class Tooltip {
  static show(target: HTMLElement, markup: string) {
    if (game.release.generation < 13) {
      game.tooltip.activate(target, {
        text: markup,
        cssClass: 'tidy5e-sheet app-v1 app-v2 classic',
      });
    } else {
      game.tooltip.activate(target, {
        html: markup,
        cssClass: 'tidy5e-sheet app-v1 app-v2 classic',
      });
    }
  }
}
