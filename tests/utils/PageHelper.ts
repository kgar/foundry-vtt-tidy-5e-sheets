import type { Page } from '@playwright/test';
import { GamePage } from '../poms/GamePage';
import { JoinPage } from '../poms/JoinPage';
import { ServerAuthenticationPage } from '../poms/ServerAuthenticationPage';
import { SetupPage } from '../poms/SetupPage';

const { ADMIN_PASSWORD = 'admin password required' } = process.env;

export class PageHelper {
  static async routeToTestGame(page: Page): Promise<GamePage> {
    let currentPage = await this.findCurrentPage(page);

    if (currentPage === undefined) {
      page.goto('/');
      currentPage = await this.findCurrentPage(page);
    }

    if (currentPage instanceof ServerAuthenticationPage) {
      currentPage = await currentPage.login(ADMIN_PASSWORD);
      await currentPage.isReady();
    }

    if (currentPage instanceof SetupPage) {
      currentPage = await currentPage.goToTestWorldJoinPage();
      await currentPage.isReady();
    }

    if (currentPage instanceof JoinPage) {
      currentPage = await currentPage.joinAsGm();
      await currentPage.isReady();
    }

    if (currentPage instanceof GamePage) {
      return currentPage;
    }

    throw new Error('Failed to find game page');
  }

  private static async findCurrentPage(
    page: Page
  ): Promise<
    ServerAuthenticationPage | SetupPage | JoinPage | GamePage | undefined
  > {
    await page.waitForLoadState();
    const gameView = await page.evaluate(() => window['game']?.view);
    switch (gameView) {
      case 'auth':
        const authPage = new ServerAuthenticationPage(page);
        await authPage.isReady();
        return authPage;
      case 'setup':
        const setupPage = new SetupPage(page);
        await setupPage.isReady();
        return setupPage;
      case 'join':
        const joinPage = new JoinPage(page);
        await joinPage.isReady();
        return joinPage;
      case 'game':
        const gamePage = new GamePage(page);
        await gamePage.isReady();
        return gamePage;
    }
    return undefined;
  }

  static async isLoggedIn(page: Page): Promise<boolean> {
    const gameView = await page.evaluate(() => {
      return window['game']?.view;
    });

    return ['setup', 'join', 'game'].includes(gameView);
  }
}
