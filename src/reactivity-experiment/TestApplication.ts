import { FoundryAdapter } from '../foundry/foundry-adapter';
import Experiment from './Experiment.svelte';
import type { Actor5e } from '../types/actor';
import type { ActorSheet5eCharacter } from '../types/actor5e-sheet';
import { CONSTANTS } from '../constants';
import type { ActorSheetContext } from '../types/types';
import { writable, type Readable } from 'svelte/store';
import { info } from '../utils/logging';

declare var Application: any;

const Actor5eCharacterSheet = FoundryAdapter.getActorSheetClass();

export class TestApplication extends Application {
  _actorSheet: ActorSheet5eCharacter;
  _store = writable<ActorSheetContext>();

  constructor(actor: Actor5e, options: { editable: boolean }) {
    super(options);
    // 🤔
    this._actorSheet = new Actor5eCharacterSheet(actor, options);
    console.warn(
      'Listening to update actor on behalf of ' +
        actor.name +
        ' with id ' +
        actor.id
    );
    Hooks.on('updateActor', (actor: Actor5e) => {
      if (actor.id === this._actorSheet.actor.id) {
        this._actorSheet.getData().then((context: ActorSheetContext) => {
          this._store.set(context);
        });
      }
    });
  }

  get template() {
    return FoundryAdapter.getTemplate('empty-div-template.hbs');
  }

  async activateListeners(html: { get: (index: 0) => HTMLElement }) {
    const node = html.get(0);
    this._store.set(await this._actorSheet.getData());
    new Experiment({
      target: node,
      props: {
        store: this._store,
      },
    });
    this._actorSheet.activateListeners(html);
  }

  static get defaultOptions() {
    // return {
    //     width: '700px',
    //     height: '400px',
    //     popOut: true,
    //     minimizable: true,
    //     resizable: true,
    //     classes: [CONSTANTS.MODULE_ID]
    // }
    return Actor5eCharacterSheet.defaultOptions;
  }
}
