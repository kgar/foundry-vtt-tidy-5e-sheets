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

    _onDragStart(event: DragEvent) {}

    _onDragOver(event: DragEvent) {}

    _onDrop(event: DragEvent): Promise<any> | undefined {
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
  }

  return DragAndDrop;
}
