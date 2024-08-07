import { isNil } from 'src/utils/data';
import type { GamePage } from './poms/GamePage';

export class TestDataProvider<T> {
  /**
   * The property to use when storing and retrieving test data for this particular setup.
   */
  envProp: string;

  /**
   *
   * @param envProp an env property dedicated specifically to this test data.
   * @param initTestData a function for establishing test data; it receives a page that is logged into the game world and ready for data insertion.
   */
  constructor(envProp: string, initTestData: (page: GamePage) => Promise<T>) {
    this.envProp = envProp;
    this.initTestData = initTestData;
  }

  /**
   * Initializes test data of the relevant type and provides it to the caller.
   * Intended to be used by the global setup handler.
   */
  initTestData: (page: GamePage) => Promise<T>;

  /**
   * Attempts to pull test data from the env variable map.
   * @returns initialized test data, if available, else undefined
   */
  tryGet(): T | undefined {
    const serializedData = process.env[this.envProp];
    if (isNil(serializedData)) {
      return undefined;
    }
    return JSON.parse(serializedData);
  }

  /**
   * Pulls test data from the env variable map or dies trying.
   * @returns initialized test data, else a thrown error
   */
  get(): T {
    const data = this.tryGet();

    if (isNil(data)) {
      throw new Error('Unable to fetch test data.');
    }

    return data;
  }
}
