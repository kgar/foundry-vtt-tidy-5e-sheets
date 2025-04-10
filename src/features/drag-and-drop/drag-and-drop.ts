export function applyDropzoneClass(
  node: HTMLElement,
  dropzoneClass: string
): any {
  let dragCounter = 0;

  node.addEventListener('dragenter', () => {
    dragCounter++;
    node.classList.add(dropzoneClass);
  });

  node.addEventListener('dragleave', () => {
    dragCounter--;
    if (dragCounter === 0) {
      node.classList.remove(dropzoneClass);
    }
  });

  node.addEventListener('drop', () => {
    dragCounter = 0;
    node.classList.remove(dropzoneClass);
  });
}

export const DragDropConfigurations = {
  attributePins: {
    item: {
      dragSelector: '[data-tidy-attribute-pin][data-item-id]',
      dropSelector: null,
    },
    activity: {
      dragSelector: '[data-tidy-attribute-pin][data-activity-id]',
      dropSelector: null,
    },
  },
  grid: {
    item: {
      dragSelector: '[data-tidy-grid-item][data-item-id]',
      dropSelector: null,
    },
  },
  panel: {
    item: {
      dragSelector: '[data-tidy-panel-item][data-item-id]',
    },
  },
  table: {
    activity: {
      dragSelector: '[data-tidy-table-row][data-activity-id]',
      dropSelector: null,
    },
    advancement: {
      dragSelector: '[data-tidy-table-row][data-advancement]',
      dropSelector: null,
    },
    effect: {
      dragSelector: '[data-tidy-table-row][data-effect-id]',
      dropSelector: null,
    },
    item: {
      dragSelector: '[data-tidy-draggable="item-table-row"]',
      dropSelector: null,
    },
  },
};
