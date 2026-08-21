import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { ApplicationConfiguration } from 'src/types/application.types';
import type { Actor5e } from 'src/types/types';

type BastionMaintainOrderDialogConfiguration = ApplicationConfiguration & {
  members: Actor5e[];
};

function buildMemberRow(actor: Actor5e): string {
  const img = foundry.utils.escapeHTML(foundry.utils.getRoute(actor.img));
  const name = foundry.utils.escapeHTML(actor.name);
  const bastionName = actor.system.bastion?.name?.trim();
  const subtitle = bastionName
    ? `<span class="bastion-maintain-order-subtitle">${foundry.utils.escapeHTML(bastionName)}</span>`
    : '';

  return `<li class="bastion-maintain-order-option">
    <label class="bastion-maintain-order-option-label">
      <input type="checkbox" name="maintainUuids" value="${foundry.utils.escapeHTML(actor.uuid)}" />
      <img class="bastion-maintain-order-portrait" src="${img}" alt="" />
      <span class="bastion-maintain-order-text flexcol">
        <span class="bastion-maintain-order-name">${name}</span>
        ${subtitle}
      </span>
    </label>
  </li>`;
}

export class BastionMaintainOrderDialog extends foundry.applications.api.DialogV2 {
  static DEFAULT_OPTIONS = {
    classes: ['bastion-maintain-order-dialog'],
    window: {
      icon: 'fa-solid fa-broom',
      title: 'TIDY5E.Bastion.Group.MaintainOrder.DialogTitle',
    },
    buttons: [
      {
        action: 'yes',
        label: 'Yes',
        icon: 'fa-solid fa-check',
        default: true,
        callback: (
          _event: Event,
          button: HTMLButtonElement,
        ): Set<string> => {
          const { maintainUuids } = new foundry.applications.ux.FormDataExtended(
            button.form,
          ).object as { maintainUuids?: string | string[] };

          if (!maintainUuids) {
            return new Set();
          }

          return new Set(
            Array.isArray(maintainUuids) ? maintainUuids : [maintainUuids],
          );
        },
      },
      {
        action: 'no',
        label: 'No',
        icon: 'fa-solid fa-xmark',
      },
    ],
  };

  constructor(options: Partial<BastionMaintainOrderDialogConfiguration>) {
    super(options);
  }

  /**
   * Prompt for Maintain selections. Resolves to selected actor UUIDs, or null
   * if cancelled.
   */
  static async prompt(
    members: Actor5e[],
    render: (dialog: BastionMaintainOrderDialog) => void,
  ): Promise<Set<string> | null> {
    if (!members.length) {
      return new Set();
    }

    const { promise, resolve } = Promise.withResolvers<Set<string> | null>();

    const dialog = new BastionMaintainOrderDialog({
      members,
      submit: (result: Set<string> | undefined) => {
        resolve(result instanceof Set ? result : null);
      },
    });

    dialog.addEventListener('close', () => resolve(null), { once: true });
    render(dialog);

    return promise;
  }

  _initializeApplicationOptions(
    options: Partial<BastionMaintainOrderDialogConfiguration>,
  ) {
    options = super._initializeApplicationOptions(options);

    const members = options.members ?? [];
    const hint = foundry.utils.escapeHTML(
      FoundryAdapter.localize(
        'TIDY5E.Bastion.Group.MaintainOrder.DialogHint',
      ),
    );
    const rows = members.map(buildMemberRow).join('');

    options.content = `<p class="bastion-maintain-order-hint">${hint}</p>
      <ul class="bastion-maintain-order-list">${rows}</ul>`;

    return options;
  }
}
