import { firstOfSet } from 'src/utils/set';

export type DropEffectValue = 'copy' | 'move' | 'link' | 'none';

export function DragAndDropMixin(BaseApplication: any) {
  class DragAndDrop extends BaseApplication {
    #dragDrop;

    constructor(...args: any[]) {
      super(...args);

      this.#dragDrop = this.#createDragDropHandlers();
    }

    /**
     * Create drag-and-drop workflow handlers for this Application
     * @returns {DragDrop[]}     An array of DragDrop handlers
     * @private
     */
    #createDragDropHandlers(): DragDrop[] {
      const dragDrop = this.options.dragDrop;

      if (!dragDrop || !Array.isArray(dragDrop)) {
        return [];
      }

      return Array.isArray(dragDrop)
        ? dragDrop.map((d) => {
            d.permissions = {
              dragstart: this._canDragStart.bind(this),
              drop: this._canDragDrop.bind(this),
            };
            d.callbacks = {
              dragstart: this._onDragStart.bind(this),
              dragover: this._onDragOver.bind(this),
              drop: this._onDrop.bind(this),
            };
            return new DragDrop(d);
          })
        : [];
    }

    /** @inheritdoc */
    _canDragStart(selector: string) {
      return this.isEditable;
    }

    /* -------------------------------------------- */

    /** @inheritdoc */
    _canDragDrop(selector: string) {
      return this.isEditable;
    }

    _onDragStart(event: DragEvent & { currentTarget: HTMLElement }) {}

    _onDragOver(event: DragEvent & { currentTarget: HTMLElement }) {
      const data = DragDrop.getPayload(event);

      if (event.dataTransfer == null) {
        return;
      }

      DragDrop.dropEffect = event.dataTransfer.dropEffect =
        foundry.utils.getType(data) === 'Object'
          ? this._dropBehavior(event, data)
          : 'copy';

      console.info('dropEffect: ' + DragDrop.dropEffect);
    }

    _onDrop(
      event: DragEvent & { currentTarget: HTMLElement }
    ): Promise<any> | undefined {
      return undefined;
    }

    /**
     * Returns an array of DragDrop instances
     * @type {DragDrop[]}
     */
    get dragDrop() {
      return this.#dragDrop;
    }

    _onRender(...args: any[]) {
      this.#dragDrop.forEach((d: DragDrop) => d.bind(this.element));
      super._onRender(...args);
    }

    /**
     * The behavior for the dropped data. When called during the drop event, ensure this is called before awaiting
     * anything or the drop behavior will be lost.
     */
    _dropBehavior(event: DragEvent, data: {}): DropEffectValue {
      const allowed = this._allowedDropBehaviors(event, data);
      console.info('allowed drop behaviors: ' + Array.from(allowed).join(', '));

      let behavior = DragDrop.dropEffect ?? event.dataTransfer?.dropEffect;

      if (event.type === 'dragover') {
        if (dnd5e.utils.areKeysPressed(event, 'dragMove')) behavior = 'move';
        else if (dnd5e.utils.areKeysPressed(event, 'dragCopy')) {
          behavior = 'copy';
        } else {
          behavior = this._defaultDropBehavior(event, data);
        }
      }

      if (behavior !== 'none' && !allowed.has(behavior)) {
        return firstOfSet(allowed) ?? 'none';
      }

      return behavior || 'copy';
    }

    /* -------------------------------------------- */

    /**
     * Types of allowed drop behaviors based on the origin & target of a drag event.
     */
    _allowedDropBehaviors(event: DragEvent, data: any): Set<DropEffectValue> {
      if (!data.uuid) return new Set<DropEffectValue>(['copy']);
      const allowed = new Set<DropEffectValue>(['copy', 'move']);
      const s = foundry.utils.parseUuid(data.uuid);
      const t = foundry.utils.parseUuid(this.document.uuid);
      const sCompendium = s.collection instanceof CompendiumCollection;
      const tCompendium = t.collection instanceof CompendiumCollection;

      // If either source or target are within a compendium, but not inside the same compendium, move not allowed
      if ((sCompendium || tCompendium) && s.collection !== t.collection)
        allowed.delete('move');

      return allowed;
    }

    /* -------------------------------------------- */

    /**
     * Determine the default drop behavior for the provided operation.
     */
    _defaultDropBehavior(event: DragEvent, data: object): DropEffectValue {
      console.info('getting default drop behavior');
      return 'copy';
    }
  }

  return DragAndDrop;
}
