import { TidyFlags, type Tidy5eSheetsApi } from 'src/api';
import type { SystemIntegrationBase } from '../integration-classes';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

export class TidyCustomSectionsInDefaultItemSheetIntegration
  implements SystemIntegrationBase
{
  init(api: Tidy5eSheetsApi): void {
    Hooks.on('renderItemSheet5e', (app: any) => {
      const isUnsupportedItemType = [
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
      ].includes(app.document.type);

      if (api.isTidy5eSheet(app) || isUnsupportedItemType) {
        return;
      }

      const inputIdPrefix = foundry.utils.randomID();
      const section =
        foundry.utils.getProperty(app.document, TidyFlags.section.prop) ?? '';
      const actionSection =
        foundry.utils.getProperty(app.document, TidyFlags.actionSection.prop) ??
        '';
      const customSectionId = `i-${inputIdPrefix}-tidy-5e-custom-section`;
      const customActionSectionId = `i-${inputIdPrefix}-tidy-5e-custom-action-section`;
      const html = `<h3 class="form-header">
              ${FoundryAdapter.localize('TIDY5E.Tidy5eSettings')}
            </h3>
            <div class="form-group custom-section">
              <label for="${customSectionId}">
                ${FoundryAdapter.localize('TIDY5E.Section.Label')}
              </label>
              <div class="form-fields">
                <input
                  type="text"
                  name="${TidyFlags.section.prop}"
                  id="${customSectionId}"
                  value=""
                />
              </div>
            </div>
            <div class="form-group custom-action-section">
              <label for="${customActionSectionId}">
                ${FoundryAdapter.localize('TIDY5E.Section.ActionLabel')}
              </label>
              <div class="form-fields">
                <input
                  type="text"
                  name="${TidyFlags.actionSection.prop}"
                  id="${customActionSectionId}"
                  value=""
                />
              </div>
            </div>`;

      const element = app.element.get?.(0) ?? app.element;

      element
        .querySelector('.tab.details')
        ?.insertAdjacentHTML('beforeend', html);

      const sectionInput = element.querySelector(`#${customSectionId}`);

      if (sectionInput) {
        sectionInput.value = section;
      }

      const actionSectionInput = element.querySelector(
        `#${customActionSectionId}`
      );

      if (actionSectionInput) {
        actionSectionInput.value = actionSection;
      }
    });
  }
}
