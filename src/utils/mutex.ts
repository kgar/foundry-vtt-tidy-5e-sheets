/**
 * A utility for guaranteeing mutually exclusive execution of asynchronous code.
 * This is useful for cases when async code is being called
 * by synchronous code which doesn't account for the asynchrony.
 */
export class AsyncMutex {
  private _mutex: Promise<void>;

  constructor() {
    this._mutex = Promise.resolve();
  }

  /**
   * Perform an action with guaranteed mutual exclusion.
   * @param action the action to take
   * @returns a promise representing the entirety of the operation
   */
  lock(action: () => Promise<any>) {
    let currentMutex = this._mutex;
    // take a place in line
    this._mutex = new Promise(async (resolve) => {
      try {
        // await release of the existing lock
        await currentMutex;
        // execute mutually exclusive action
        await action();
      } finally {
        // release the lock, allowing others to pass through
        resolve();
      }
    });
    // allow this whole process to be awaited
    return this._mutex;
  }
}
