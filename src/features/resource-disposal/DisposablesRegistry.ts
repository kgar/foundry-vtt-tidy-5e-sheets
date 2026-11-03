import { error } from 'src/utils/logging';

export type Disposable = () => void;
export type DisposableLifetimeEvent = 'close' | 'render';

const disposables: Record<
  DisposableLifetimeEvent,
  Map<string, Disposable[]>
> = {
  close: new Map(),
  render: new Map(),
};

function getMap(event: DisposableLifetimeEvent) {
  return disposables[event];
}

/**
 * Tidy application disposables registry, designed to cache disposal functions
 * to be executed at the appropriate application lifecycle times.
 * This external registry helps with keeping track of disposables
 * even when applications are forcibly re-rendered without any proper teardown occurring,
 * so that they can be disposed on next application construction.
 */
export const DisposablesRegistry = {
  /**
   * Registers a dispose function with a particular lifecycle event.
   * @param id          the unique identifier of the target application. Usually `this.id`.
   * @param event       the lifetime event where this resource should be disposed.
   * @param disposable  the dispose function to be executed at disposal time.
   */
  register(id: string, event: DisposableLifetimeEvent, disposable: Disposable) {
    getMap(event)
      ?.getOrInsertComputed(id, () => [])
      .push(disposable);
  },

  /**
   * Executes all registered dispose functions and clears the registry for the target ID.
   * @param id      the unique identifier of the target application. Usually `this.id`.
   * @param event   the lifetime event which represents the collection of dispose functions.
   */
  dispose(id: string, event: DisposableLifetimeEvent) {
    const map = getMap(event);
    const disposables = map?.get(id);

    if (!disposables) {
      return;
    }

    for (const disposable of disposables) {
      try {
        disposable();
      } catch (e) {
        error('An error occurred while disposing of a resource', false, {
          id,
          event,
          error: e,
        });
      }
    }

    map.delete(id);
  },

  /**
   * Disposes all resources from all collections for the target ID.
   * @param id    the unique identifier of the target application. Usually `this.id`.
   */
  disposeAll(id: string) {
    (Object.keys(disposables) as DisposableLifetimeEvent[]).forEach((key) =>
      this.dispose(id, key),
    );
  },

  /**
   * Registers a `Hooks.off(hookName, hookId)` function call to the appropriate collection by ID,
   * for the indicated lifetime event.
   * @param id          the unique identifier of the target application. Usually `this.id`.
   * @param hookName    the hook name.
   * @param hookId      the hook ID that was created when `Hooks.on()` was called.
   * @param event       the lifetime event where this hook unsubscription is relevant.
   */
  registerHook(
    id: string,
    hookName: string,
    hookId: string,
    event: DisposableLifetimeEvent,
  ) {
    this.register(id, event, () => {
      Hooks.off(hookName, hookId);
    });
  },
};
