import { FoundryAdapter } from '../foundry/foundry-adapter';
import CharacterSheet from './character.svelte';

const ActorSheet5eCharacter = FoundryAdapter.getActorSheetClass();

export class Tidy5eSheetKgar extends ActorSheet5eCharacter {
  get template() {
    return FoundryAdapter.getTemplate('tidy5e-sheet-kgar.html');
  }

  activateListeners(html: { get: (index: number) => HTMLElement }) {
    super.activateListeners(html);

    const node = html.get(0);
    new CharacterSheet({
      target: node,
    });
  }
}
