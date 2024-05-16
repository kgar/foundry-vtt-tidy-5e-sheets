import type { Locator, Page } from '@playwright/test';

export class DocumentTabSectionConfigApplicationPom {
  page: Page;
  $application: Locator;
  $listboxOptions: Locator;
  $configureSectionsSaveChanges: Locator;
  $configureSectionsApplyChanges: Locator;
  $configureSectionsUseDefault: Locator;
  $configureSectionsUseDefaultYesButton: Locator;
  $configureSectionsUseDefaultNoButton: Locator;
  $configureSectionMoveItemUpButton: Locator;
  $configureSectionMoveItemDownButton: Locator;

  sectionKeyAttribute = 'data-section-key';
  hideSectionTestId = 'section-config-hide';
  showSectionTestId = 'section-config-show';

  constructor(page: Page) {
    this.page = page;
    this.$application = page.locator('#tidy-5e-sheets-section-configuration');
    this.$listboxOptions = this.$application.getByRole('option');
    this.$configureSectionsSaveChanges = this.$application.getByTestId(
      'section-config-save-changes'
    );
    this.$configureSectionsApplyChanges = this.$application.getByTestId(
      'section-config-apply-changes'
    );
    this.$configureSectionsUseDefault = this.$application.getByTestId(
      'section-config-use-default'
    );
    // Assumption: there's only one dialog with a .yes button open
    this.$configureSectionsUseDefaultYesButton = page
      .getByRole('dialog')
      .locator('button.yes');
    // Assumption: there's only one dialog with a .no button open
    this.$configureSectionsUseDefaultNoButton = page
      .getByRole('dialog')
      .locator('button.no');
    this.$configureSectionMoveItemUpButton = this.$application.getByTestId(
      'sorting-listbox-move-up'
    );
    this.$configureSectionMoveItemDownButton = this.$application.getByTestId(
      'sorting-listbox-move-down'
    );
  }

  async isReady() {
    await this.$application.isVisible();
  }

  async selectSection(name: string) {
    await this.getOption(name).click();
  }

  private getOption(key: string) {
    return this.$listboxOptions.filter({
      has: this.page.locator(`[${this.sectionKeyAttribute}="${key}"]`),
    });
  }

  async dragSectionTo(sourceSectionName: string, targetSectionName: string) {
    return await this.getOption(sourceSectionName).dragTo(
      this.getOption(targetSectionName)
    );
  }

  async getSectionsInCurrentOrder(): Promise<string[]> {
    const sectionLocators = await this.$listboxOptions
      .getByTestId('section-config-item-label')
      .all();
    const sections: string[] = [];
    for (const locator of sectionLocators) {
      sections.push((await locator.textContent()) ?? '');
    }
    return sections;
  }

  async hideSection(name: string) {
    await this.getOption(name).getByTestId(this.hideSectionTestId).click();
  }

  async showSection(name: string) {
    await this.getOption(name).getByTestId(this.showSectionTestId).click();
  }

  async saveChanges() {
    await this.$configureSectionsSaveChanges.click();
    await this.$application.waitFor({
      state: 'hidden',
    });
  }

  async getOptionsInCurrentOrder(): Promise<string[]> {
    return await this.$application.evaluate(async (app) =>
      Array.from(
        app.querySelectorAll(
          '[role="listbox"] [role="option"] [data-section-key]'
        )
      ).map((el, i) => el.getAttribute('data-section-key') ?? '')
    );
  }
}
