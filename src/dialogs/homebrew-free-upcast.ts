import { FoundryAdapter } from 'src/foundry/foundry-adapter';
  import { type Actor5e } from 'src/types/actor';
import { SettingsProvider } from 'src/settings/settings';
import { SPELL_LEVEL_RADIO_BUTTON_CLASS } from './spell-level-buttons';

export function useHombrewEnableUpcastFreeSpell(
  app: any,
  html: any,
  options: any
) {
  if (!SettingsProvider.settings.hbEnableUpcastFreeSpell.get()) {
    return;
  }

  if (app?.item?.type != 'spell') {
    return;
  }

  let tooltip = FoundryAdapter.localize('T5EK.LevelBumpTooltip');

  const featuresThatSupportUpcast =
    SettingsProvider.settings.hbSetFeaturesForUpcastFreeSpell.get();
  if (featuresThatSupportUpcast && app.item?.actor) {
    const namesFeaturesToCheck = featuresThatSupportUpcast.split('|') ?? [];
    const namesFeatures = getFeatureNamesFromActor(app.item?.actor) ?? [];
    const check = namesFeaturesToCheck.some((v) =>
      namesFeatures.includes(v.toLowerCase())
    );
    if (!check) {
      return;
    }
    tooltip =
      tooltip +
      ` Ty to one of these features '${namesFeaturesToCheck.join(',')}'`;
  }

  const dropdown = html.find('select[name="consumeSpellLevel"]');

  if (dropdown.length == 0) {
    return;
  }

  const checkboxId = getUpcastId(app.appId);

  const newFormGroup = `
    <div class="form-group">
        <label 
            class="checkbox" 
            for="${checkboxId}"
            title="${tooltip}">
            <input 
                id="${checkboxId}" 
                type="checkbox" 
                class="homebrew-enable-upcast-free-spell"
                name="freeUpcast" />
                ${FoundryAdapter.localize('T5EK.LevelBump')}
        </label>
    </div>
      `;

  const consumeSpellSlotFormGroup = html
    .find('[name="consumeSpellSlot"]')
    .closest('.form-group');

  consumeSpellSlotFormGroup.after(newFormGroup);

  app.setPosition({ height: 'auto' });

  $(`#${checkboxId}`).change((ev: any) => {
    const inputsToUpdate = html
      .find(
        `[name="consumeSpellLevel"] option, .${SPELL_LEVEL_RADIO_BUTTON_CLASS}`
      )
      .toArray();

    if (ev.target.checked) {
      inputsToUpdate.forEach((o: any) => {
        if (!o.value) {
          return;
        }

        o.value =
          o.value === 'pact'
            ? String(app.item.actor.system.spells.pact.level + 1)
            : String(parseInt(o.value) + 1);
      });
    } else {
      inputsToUpdate.forEach((o: any) => {
        if (!o.value) {
          return;
        }

        o.value = o.text?.includes('Pact')
          ? 'pact'
          : String(parseInt(o.value) - 1);
      });
    }
  });
}

function getFeatureNamesFromActor(actor: Actor5e) {
  const features = getFeatureItemsFromActor(actor);
  const names = [];
  for (const feature of features) {
    names.push(feature.name.toLowerCase());
  }
  return names;
}

function getFeatureItemsFromActor(actor: Actor5e) {
  return actor.items
    .filter((item: { type: string }) => ['feat'].includes(item.type))
    .sort((a: { name: string }, b: { name: string }) => {
      return a.name.localeCompare(b.name);
    });
}

function getUpcastId(appId: string) {
  return `${appId}-homebrew-enable-upcast-free-spell`;
}

export function applyHombrewEnableUpcastFreeSpellToPreItemConsumption(
  item: any,
  config: any,
  options: any
) {
  if (!SettingsProvider.settings.hbEnableUpcastFreeSpell.get()) {
    return;
  }

  if (item?.type != 'spell') {
    return;
  }

  if (config?.freeUpcast) {
    if (item.system.preparation.mode === 'pact') {
      config.consumeSpellLevel = 'pact';
    } else {
      config.consumeSpellLevel = String(parseInt(config.consumeSpellLevel) - 1);
    }
  }
}
