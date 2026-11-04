import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { error } from 'src/utils/logging';

type ChooseFromOptionsArgs = {
  title: string;
  message: string;
  options: { id: string; label: string }[];
};

/**
 * Presents a dialog with indicated options. When the user makes a
 * selection and clicks Confirm, the ID of the chosen value is returned.
 */
async function chooseFromOptions({
  title,
  message,
  options,
}: ChooseFromOptionsArgs): Promise<string | undefined> {
  const radioRows = options
    .map(
      (opt, index) => `
    <label>
      <input type="radio" name="choice" value="${opt.id}" ${index === 0 ? 'checked' : ''}>
      <span>${FoundryAdapter.localize(opt.label)}</span>
    </label>
  `,
    )
    .join('');

  const fullContent = `
    <div>${FoundryAdapter.localize(message)}</div>
    <form class="standard-form">
      <fieldset>
        ${radioRows}
      </fieldset>
    </form>
  `;

  const buttons = [
    {
      action: 'ok',
      icon: 'fas fa-check',
      label: FoundryAdapter.localize('COMMON.Confirm'),
      default: true,
      callback: (_event: Event, _button: HTMLElement, app: any) => {
        const formData = new foundry.applications.ux.FormDataExtended(
          app.element.querySelector('form'),
        );
        return formData.get('choice');
      },
    },
    {
      action: 'cancel',
      icon: 'fas fa-xmark',
      label: FoundryAdapter.localize('COMMON.Cancel'),
      callback: () => undefined,
    },
  ];

  try {
    const result = await foundry.applications.api.DialogV2.wait({
      window: { title: title },
      content: fullContent,
      buttons: buttons,
      rejectClose: false,
    });

    return result;
  } catch (e) {
    error('An error occured while managing an options dilaog.', false, {
      error: e,
      title,
      message,
      options,
    });
    return undefined;
  }
}

export const DialogService = {
  chooseFromOptions,
};
