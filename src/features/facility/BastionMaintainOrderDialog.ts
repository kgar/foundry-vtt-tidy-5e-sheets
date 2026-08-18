import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type { Actor5e } from 'src/types/types';

export type BastionMaintainOrderOption = {
  actor: Actor5e;
  bastionName: string;
};

function renderMemberRow(option: BastionMaintainOrderOption): string {
  const { actor, bastionName } = option;
  const img = foundry.utils.escapeHTML(foundry.utils.getRoute(actor.img));
  const name = foundry.utils.escapeHTML(actor.name);
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

function getSelectedMaintainUuids(button: HTMLButtonElement): Set<string> {
  const { maintainUuids } = new foundry.applications.ux.FormDataExtended(
    button.form,
  ).object as { maintainUuids?: string | string[] };

  if (!maintainUuids) {
    return new Set<string>();
  }

  return new Set(Array.isArray(maintainUuids) ? maintainUuids : [maintainUuids]);
}

/**
 * Ask which group members should issue Maintain instead of advancing this turn.
 * Returns null when cancelled, otherwise the set of checked actor UUIDs.
 */
export async function promptMaintainOrderSelection(
  members: BastionMaintainOrderOption[],
  renderDialog: (dialog: any) => void,
): Promise<Set<string> | null> {
  if (!members.length) {
    return new Set();
  }

  const { promise, resolve } = Promise.withResolvers<Set<string> | null>();

  const rows = members.map(renderMemberRow).join('');
  const hint = FoundryAdapter.localize(
    'TIDY5E.Bastion.Group.MaintainOrder.DialogHint',
  );

  const dialog = new foundry.applications.api.DialogV2({
    classes: ['bastion-maintain-order-dialog'],
    content: `<p class="bastion-maintain-order-hint">${foundry.utils.escapeHTML(hint)}</p>
      <ul class="bastion-maintain-order-list">${rows}</ul>`,
    window: {
      icon: 'fa-solid fa-broom',
      title: FoundryAdapter.localize(
        'TIDY5E.Bastion.Group.MaintainOrder.DialogTitle',
      ),
    },
    buttons: [
      {
        action: 'yes',
        icon: 'fa-solid fa-check',
        label: FoundryAdapter.localize(
          'TIDY5E.Bastion.Group.MaintainOrder.DialogYes',
        ),
        default: true,
        callback: (_event: Event, button: HTMLButtonElement) =>
          getSelectedMaintainUuids(button),
      },
      {
        action: 'no',
        icon: 'fa-solid fa-xmark',
        label: FoundryAdapter.localize(
          'TIDY5E.Bastion.Group.MaintainOrder.DialogNo',
        ),
        callback: () => null,
      },
    ],
    submit: (result: Set<string> | null) => resolve(result),
  });

  dialog.addEventListener('close', () => resolve(null), { once: true });

  renderDialog(dialog);

  return promise;
}
