import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from '../foundry/foundry-adapter';
import Tidy5eSheet from './tidy5e-sheet.svelte';
import { log } from 'src/utils/logging';

const ActorSheet5eCharacter = FoundryAdapter.getActorSheetClass();

export class Tidy5eSheetKgar extends ActorSheet5eCharacter {
  sheet?: Tidy5eSheet;

  get template() {
    return FoundryAdapter.getTemplate('tidy5e-sheet-kgar-template.hbs');
  }

  static get defaultOptions() {
    // TODO: Figure out what this module is and why it is here...
    // if (
    //   !game.modules.get('character-actions-list-5e')?.active &&
    //   SettingsProvider.settings.defaultActionsTab.get() == 'actions'
    // ) {
    //   defaultTab = 'attributes';
    // }

    return FoundryAdapter.mergeObject(super.defaultOptions, {
      classes: ['tidy5e-kgar', 'sheet', 'actor', 'character'],
      height: 840,
    });
  }

  async activateListeners(html: { get: (index: number) => HTMLElement }) {
    const node = html.get(0);
    this.sheet = new Tidy5eSheet({
      target: node,
      props: {
        sheetFunctions: {
          activateListeners: () => super.activateListeners(html),
          submit: this.submit.bind(this),
          render: this.render.bind(this),
          onShortRest: this._onShortRest.bind(this),
          onLongRest: this._onLongRest.bind(this),
          onEditImage: this._onEditImage.bind(this),
          onToggleAbilityProficiency:
            this._onToggleAbilityProficiency.bind(this),
        },
        scrollTop: this.actor.flags[CONSTANTS.MODULE_ID]?.scrollTop ?? 0,
        isEditable: this.isEditable,
        context: await super.getData(this.options),
      },
    });
  }

  close(options: unknown = {}) {
    log('closing the sheet; wanna do something here?', this.sheet);
    this.#trySaveScrollTop();
    return super.close(options);
  }

  override submit(): void {
    this.#trySaveScrollTop();
    super.submit();
  }

  #trySaveScrollTop() {
    if (this.sheet) {
      const scrollViewIndex = this.sheet.$$.props.scrollView;
      if (typeof scrollViewIndex === 'number') {
        const scrollView = this.sheet.$$.ctx[scrollViewIndex] as HTMLElement;
        FoundryAdapter.setFlag(this.actor, 'scrollTop', scrollView.scrollTop);
      }
    }
  }
}
