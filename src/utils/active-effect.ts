import { isNil } from './data';
import { debug, error } from './logging';

export class ActiveEffectsHelper {
  static isActiveEffectAppliedToField(document: any, field: string) {
    try {
      return (
        document?.overrides &&
        !isNil(field) &&
        getProperty(document.overrides, field)
      );
    } catch (e) {
      error(
        'An error occurred while checking if a field has an active effect applied',
        false,
        e
      );
      debug('Active effect error troubleshooting info', { document, field });
      return false;
    }
  }
}
