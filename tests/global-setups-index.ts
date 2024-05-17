import type { TestDataProvider } from './TestDataProvider';
import { sectionTestDataProvider } from './projects/main/sections/sections-test-data';

/**
 * A series of test data providers to be used during global setup to initialize global test data
 * which is meant to span multiple tests and test files.
 */
export const setups: TestDataProvider<unknown>[] = [sectionTestDataProvider];
