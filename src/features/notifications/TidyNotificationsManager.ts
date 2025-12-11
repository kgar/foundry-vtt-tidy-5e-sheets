import { CONSTANTS } from 'src/constants';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { SettingsProvider } from 'src/settings/settings.svelte';

export class TidyNotificationsManager {
  static onReady() {
    if (!FoundryAdapter.userIsGm()) {
      return;
    }

    const notifications: Record<string, boolean> =
      SettingsProvider.settings.notifications.get() ?? {};

    if (!notifications.firstTimeWelcome) {
      const message = FoundryAdapter.localize(
        'TIDY5E.Notifications.FirstTimeWelcome1',
        {
          sheetLinkStart: `<a href="${CONSTANTS.WIKI_LINK_CHANGE_SHEET_GUIDE}" target="_blank">`,
          sheetLinkEnd: `</a>`,
          allSheetsLinkStart: `<a href="${CONSTANTS.WIKI_LINK_CHANGE_ALL_SHEETS_GUIDE}" target="_blank">`,
          allSheetsLinkEnd: `</a>`,
          wikiLinkStart: `<a href="${CONSTANTS.WIKI_LINK}" target="_blank">`,
          wikiLinkEnd: `</a>`,
        }
      );
      this.sendTidyChatMessageToGm(`<p>${message}</p>`);
      notifications.firstTimeWelcome = true;
    }

    if (game.release.generation < 14 && !notifications.classicRetirementImminent) {
      const message = FoundryAdapter.localize('TIDY5E.Notifications.ClassicsRetirementImminent');
      this.sendTidyChatMessageToGm(`<p>${message}</p>`);
      notifications.classicRetirementImminent = true;
    }
    
    if ((game.release.generation >= 14) && !notifications.classicRetired) {
      const message = FoundryAdapter.localize('TIDY5E.Notifications.ClassicsRetired');
      this.sendTidyChatMessageToGm(`<p>${message}</p>`);
      notifications.classicRetired = true;
    }

    FoundryAdapter.setTidySetting('notifications', notifications);
  }

  static sendTidyChatMessageToGm(message: string) {
    let chatMessage = {
      speaker: ChatMessage.getSpeaker({
        alias: FoundryAdapter.localize('TIDY5E.ModuleName'),
      }),
      user: game.user._id,
      whisper: game.users.filter((u: any) => u.isGM).map((u: any) => u._id),
      content: message,
    };

    ChatMessage.create(chatMessage, {});
  }
}
