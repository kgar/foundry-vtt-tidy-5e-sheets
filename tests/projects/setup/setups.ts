import type { GamePage } from 'tests/poms/GamePage';
import { applySectionsSetups } from '../main/sections/sections-setups';

export async function applySetups(gamePage: GamePage) {
  // World Test Config Setup
  await gamePage.applyTestConfiguration();
  await gamePage.page.reload();
  await gamePage.page.waitForLoadState();
  await gamePage.isReady();

  // Test Suite Setups
  await applySectionsSetups(gamePage);
  // TODO: Apply all other setups here.
}
