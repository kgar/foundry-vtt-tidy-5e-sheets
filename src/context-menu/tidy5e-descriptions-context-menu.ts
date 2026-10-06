import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ContextMenuEntry } from 'src/foundry/foundry.types';
import { TidyHooks } from 'src/foundry/TidyHooks';
import type { TidyExtensibleDocumentSheetMixinInstance } from 'src/mixins/TidyDocumentSheetMixin.svelte';

export function configureDescriptionsContextMenu(
  element: HTMLElement,
  app: TidyExtensibleDocumentSheetMixinInstance,
) {
  const prop = element.closest<HTMLElement>('[data-prop]')?.dataset.prop;

  if (!prop) {
    return;
  }

  ui.context.menuItems = getDescriptionsContextOptions(app, prop);

  TidyHooks.tidy5eSheetsGetDescriptionsContextOptions(
    app.document,
    prop,
    ui.context.menuItems,
  );
}

/**
 * Prepare an array of context entries for group skills rolls.
 * @param app         The calling application.
 * @param skillKey    The skill key that corresponds to CONFIG.DND5E.skills.
 * @returns           Context menu options.
 */
function getDescriptionsContextOptions(
  app: TidyExtensibleDocumentSheetMixinInstance,
  prop: string,
): ContextMenuEntry[] {
  return [
    {
      label: FoundryAdapter.localize('DND5E.DescriptionEdit', {
        description: FoundryAdapter.localize('DND5E.Description'),
      }),
      icon: 'fa-solid fa-feather',
      visible: (target) =>
        !!target
          .closest<HTMLElement>('[data-prop]')
          ?.querySelector<HTMLElement>('.edit'),
      onClick: (event, target) => {
        // TODO: Find a less volatile way to do this. Perhaps leveraging messaging to the target sheet which can propagate to the relevant component?
        target
          .closest<HTMLElement>('[data-prop]')
          ?.querySelector<HTMLElement>('.edit')
          ?.click();
      },
    },
    {
      label: 'TIDY5E.COMMON.Action.CopyToClipboard',
      icon: 'fa-solid fa-copy',
      onClick: (event, target) => {
        const value = FoundryAdapter.getProperty(
          app.document,
          prop,
        )?.toString();

        if (!value) {
          return;
        }

        app._copyValue(
          value,
          FoundryAdapter.localize('TIDY5E.COMMON.CopiedData', {
            prop: `<b>${prop}</b>`,
          }),
        );
      },
    },
    {
      label: 'TIDY5E.COMMON.Action.CopyWithoutFormatting',
      icon: 'fa-solid fa-text-slash',
      onClick: async (event, target) => {
        const { descriptionSelector } = target.dataset;

        const container = descriptionSelector
          ? (app.element.querySelector(descriptionSelector) as
              HTMLElement | undefined)
          : // TODO: Find a less volatile way to do find the inner text. Trouble is, it needs to have all the same CSS applied to it in order to ensure hidden text is excluded from the grab.
            target
              .closest<HTMLElement>('[data-prop]')
              ?.querySelector<HTMLElement>('[data-target]');

        const innerText = container?.innerText;

        app._copyValue(
          innerText,
          FoundryAdapter.localize('TIDY5E.COMMON.CopiedWithoutFormatting'),
        );
      },
    },
    {
      label: 'DND5E.DisplayCard',
      icon: 'fa-solid fa-message-arrow-up-right',
      onClick: async (event, target) => {
        const value = FoundryAdapter.getProperty(
          app.document,
          prop,
        )?.toString();

        if (!value) {
          return;
        }

        ChatMessage.create({
          content: value,
          speaker: ChatMessage.getSpeaker({ alias: app.document.name }),
          flavor: prop,
        });
      },
    },
  ];
}
