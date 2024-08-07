import type { GamePage } from 'tests/poms/GamePage';

export async function applySetups(gamePage: GamePage) {
  // World Test Config Setup
  await gamePage.applyTestWorldConfiguration();
  await gamePage.page.reload();
  await gamePage.page.waitForLoadState();
  await gamePage.isReady();
}
