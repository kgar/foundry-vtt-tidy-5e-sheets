// ================================
// Logger utility
// ================================
// export let debugEnabled = 0;

import { CONSTANTS } from 'src/constants';
import { SettingsProvider } from 'src/settings/settings';

// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg: string, args?: any) {
  if (SettingsProvider.settings.debug.get()) {
    console.log(`DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`, args);
  }
}
export function log(message: string, args: any) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  console.log(message.replace('<br>', '\n'), args);
}
export function notify(message: string) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
}
export function info(info: string, notify = false) {
  info = `${CONSTANTS.MODULE_ID} | ${info}`;
  if (notify) ui.notifications?.info(info);
  console.log(info.replace('<br>', '\n'));
}
export function warn(warning: string, notify = false) {
  warning = `${CONSTANTS.MODULE_ID} | ${warning}`;
  if (notify) ui.notifications?.warn(warning);
  console.warn(warning.replace('<br>', '\n'));
}
export function error(message: string, notify = true, args?: any) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  if (notify) ui.notifications?.error(message);
  console.error(message, args);
}
