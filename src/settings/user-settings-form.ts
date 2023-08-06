import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { log } from 'src/utils/logging';
import { SettingsProvider } from './settings';

export class Tidy5eKgarUserSettings extends FormApplication {
  // settings template
  static get defaultOptions() {
    return {
      ...super.defaultOptions,
      height: 500,
      title: FoundryAdapter.localize('T5EK.Settings.SheetMenu.title'),
      width: 600,
      classes: ['tidy5e-kgar', 'settings'],
      tabs: [
        {
          navSelector: '.tabs',
          contentSelector: 'form',
          initial: 'Players',
        },
      ],
      submitOnClose: true,
    };
  }

  get template() {
    return FoundryAdapter.getTemplate('user-settings-template.hbs');
  }

  constructor(object = {}, options) {
    super(object, options);
  }

  _getHeaderButtons() {
    let btns = super._getHeaderButtons();
    btns[0].label = 'Close';
    return btns;
  }

  getSettingsData() {
    let data: Record<string, unknown> = {};
    Object.keys(SettingsProvider.settings).forEach((setting) => {
      data[setting] = { value: FoundryAdapter.getGameSetting(setting) };
    });
    return data;
  }

  getData() {
    let data = super.getData();
    data.settings = this.getSettingsData();
    return data;
  }

  activateListeners(html: any) {
    // TODO: DO IT IN SVELTE
    // super.activateListeners(html);
    // // debug('Listeners Active!')
    // // debug(html)
    // let exhaustionEffectSelect = html.find("select#exhaustionEffectsEnabled");
    // let exhaustionSelected = $(exhaustionEffectSelect).val();
    // // debug(exhaustionSelected)
    // switch (exhaustionSelected) {
    // 	case "default": {
    // 		html.find("input#exhaustionEffectIcon").closest(".setting").hide();
    // 		html.find("input#exhaustionEffectCustom").closest(".setting").hide();
    // 		break;
    // 	}
    // 	case "tidy5e": {
    // 		html.find("input#exhaustionEffectCustom").closest(".setting").hide();
    // 		break;
    // 	}
    // 	case "dfredce": {
    // 		html.find("input#exhaustionEffectIcon").closest(".setting").hide();
    // 		break;
    // 	}
    // 	case "cub": {
    // 		html.find("input#exhaustionEffectIcon").closest(".setting").hide();
    // 		break;
    // 	}
    // }
    // exhaustionEffectSelect.on("change", function (e) {
    // 	html.find("input#exhaustionEffectIcon").closest(".setting").hide();
    // 	html.find("input#exhaustionEffectCustom").closest(".setting").hide();
    // 	let value = e.target.value;
    // 	if (value == "tidy5e") {
    // 		html.find("input#exhaustionEffectIcon").closest(".setting").show();
    // 	} else if (value == "custom") {
    // 		html.find("input#exhaustionEffectCustom").closest(".setting").show();
    // 	}
    // });
    // html.find("input#exhaustionEffectIcon").on("change", function (e) {
    // 	// debug(e.target.value)
    // 	if (e.target.value == "" || e.target.value == null) {
    // 		e.target.value = `modules/${CONSTANTS.MODULE_ID}/images/exhaustion.svg`;
    // 	}
    // });
  }

  redrawOpenSheets() {
    // Redraw open global actor sheets
    game.actors
      .filter((a) => a.sheet.rendered)
      .forEach((a) => a.sheet.render(true));

    // Redraw open global item sheets
    game.items
      .filter((a) => a.sheet.rendered)
      .forEach((a) => a.sheet.render(true));

    // Redraw open embedded item sheets
    game.actors.forEach((a) =>
      a.items.filter((i) => i.sheet.rendered).forEach((s) => s.render(true))
    );
  }

  async _updateObject(ev, formData) {
    const data = expandObject(formData);
    let settingsUpdated = false;
    // debug(formData);
    // debug(settingOptions);
    for (let key in data) {
      // debug(`Key: ${key} with value: ${data[key]}`);
      let oldSetting = FoundryAdapter.getGameSetting(key);
      let newSetting = data[key];
      if (oldSetting == newSetting) continue;
      // debug(`${key} changed to "${data[key]}"`);
      await FoundryAdapter.setGameSetting(key, data[key]);
      settingsUpdated = true;
    }

    if (settingsUpdated) {
      this.redrawOpenSheets();
    }
  }
}

// Hooks.on("renderTidy5eUserSettings", () => {
// 	if (!game.user.isGM) {
// 		document.querySelectorAll(".tidy5e.settings .gm-only").forEach(function (el) {
// 			el.remove();
// 		});
// 	}
// });
