export type Disposable = () => void;
export type DisposableLifetimeEvent = 'close' | 'render';

const disposablesOnClose: Map<string, Disposable[]> = new Map();
const disposablesOnRender: Map<string, Disposable[]> = new Map();

function getMap(event: DisposableLifetimeEvent) {
  return event === 'render'
    ? disposablesOnRender
    : event === 'close'
      ? disposablesOnClose
      : undefined;
}

export const DisposablesRegistry = {
  register(id: string, event: DisposableLifetimeEvent, disposable: Disposable) {
    getMap(event)
      ?.getOrInsertComputed(id, () => [])
      .push(disposable);
  },

  dispose(id: string, event: DisposableLifetimeEvent) {
    const disposables = getMap(event)?.getOrInsertComputed(id, () => []) ?? [];

    for (const disposable of disposables) {
      disposable();
    }

    disposables.length = 0;
  },

  disposeAll(id: string) {
    this.dispose(id, 'close');
    this.dispose(id, 'render');
  },

  registerHook(
    id: string,
    hookName: string,
    hookId: string,
    event: DisposableLifetimeEvent,
  ) {
    getMap(event)
      ?.getOrInsertComputed(id, () => [])
      .push(() => {
        Hooks.off(hookName, hookId);
      });
  },
};
