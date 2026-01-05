// ================================
// Logger utility
// ================================

import { CONSTANTS } from 'src/constants';
import { settings } from 'src/settings/settings.svelte';

// 0 = none, warnings = 1, debug = 2, all = 3
export function debug(msg: string, args?: any) {
  if (settings.value.debug) {
    let formattedMsg = `DEBUG | ${CONSTANTS.MODULE_ID} | ${msg}`;

    if (args !== undefined) {
      console.log(formattedMsg, args);
    } else {
      console.log(formattedMsg);
    }
  }
}

export function log(message: string, args?: any) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;

  const formattedLog = message.replace('<br>', '\n');

  if (args !== undefined) {
    console.log(formattedLog, args);
  } else {
    console.log(formattedLog);
  }
}

export function notify(message: string) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;
  ui.notifications?.notify(message);
  console.log(message.replace('<br>', '\n'));
}

export function info(info: string, notify = false, args?: any) {
  info = `${CONSTANTS.MODULE_ID} | ${info}`;

  if (notify) {
    ui.notifications?.info(info);
  }

  const formattedInfo = info.replace('<br>', '\n');

  if (args !== undefined) {
    console.log(formattedInfo, args);
  } else {
    console.log(formattedInfo);
  }
}

/**
 * Warnings that have already been logged.
 */
const warnings = new Set<string>();

export function warn(
  warning: string,
  notify = false,
  args?: any,
  once: boolean = false
) {
  if (once) {
    if (warnings.has(warning)) {
      return;
    }

    warnings.add(warning);
  }

  warning = `${CONSTANTS.MODULE_ID} | ${warning}`;

  if (notify) {
    ui.notifications?.warn(warning);
  }

  const formattedWarning = warning.replace('<br>', '\n');

  if (args !== undefined) {
    console.warn(formattedWarning, args);
  } else {
    console.warn(formattedWarning);
  }
}

export function error(message: string, notify = true, args?: any) {
  message = `${CONSTANTS.MODULE_ID} | ${message}`;

  if (notify) {
    ui.notifications?.error(message);
  }

  if (args !== undefined) {
    console.error(message, args);
  } else {
    console.error(message);
  }
}
