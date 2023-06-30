import { FoundryAdapter } from '../foundry/foundry-adapter';
import Tidy5eSheet from './tidy5e-sheet.svelte';

const ActorSheet5eCharacter = FoundryAdapter.getActorSheetClass();

export class Tidy5eSheetKgar extends ActorSheet5eCharacter {
  get template() {
    return FoundryAdapter.getTemplate('tidy5e-sheet-kgar.html');
  }

  activateListeners(html: { get: (index: number) => HTMLElement }) {
    const node = html.get(0);
    new Tidy5eSheet({
      target: node,
      props: {
        actor: this.actor,
        sheetFunctions: {
          activateListeners: () => super.activateListeners(html),
          submit: this.submit.bind(this),
          // TODO: Apply types ✅
          render: this.render.bind(this),
          onShortRest: this._onShortRest.bind(this),
          onLongRest: this._onLongRest.bind(this),
        },
      },
    });
  }
}
