import { type Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { TidyFlags } from 'src/foundry/TidyFlags';
import type { SystemIntegrationBase } from '../integration-classes';
import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { settings } from 'src/settings/settings.svelte';

export class TidyCustomSectionsInDefaultItemSheetIntegration
  implements SystemIntegrationBase
{
  init(_: Tidy5eSheetsApi): void {
    Hooks.on('renderItemSheet5e', (app: any) => {
      const includeSectionFields =
        settings.value.includeTidySectionFieldsInDefaultSheets;

      if (!includeSectionFields) {
        return;
      }

      const isUnsupportedItemType = [
        CONSTANTS.ITEM_TYPE_RACE,
        CONSTANTS.ITEM_TYPE_BACKGROUND,
        CONSTANTS.ITEM_TYPE_CLASS,
        CONSTANTS.ITEM_TYPE_SUBCLASS,
      ].includes(app.document.type);

      if (isUnsupportedItemType) {
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
      const html = `
          <fieldset>
            <legend>${FoundryAdapter.localize('TIDY5E.Tidy5eSettings')}</legend>
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
            </div>
          </fieldset>`;

      const element = app.element as HTMLElement;

      element
        .querySelector('.tab.details')
        ?.insertAdjacentHTML('beforeend', html);

      const sectionInput = element.querySelector<HTMLInputElement>(
        `#${customSectionId}`
      );

      if (sectionInput) {
        sectionInput.value = section;
      }

      const actionSectionInput = element.querySelector<HTMLInputElement>(
        `#${customActionSectionId}`
      );

      if (actionSectionInput) {
        actionSectionInput.value = actionSection;
      }
    });
  }
}
