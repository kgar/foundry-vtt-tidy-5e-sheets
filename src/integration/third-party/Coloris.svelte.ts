import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { ThirdPartyIntegrationBase } from '../integration-classes';
import Coloris from '@melloware/coloris';
import { debug } from 'src/utils/logging';

export class ColorisThirdPartyIntegration extends ThirdPartyIntegrationBase {
  name: string = 'Coloris';
  userColorCss: string = '';

  init(_api: Tidy5eSheetsApi): void {
    import('./coloris.less');
    Coloris.init();
    Coloris.coloris({
      el: '.coloris',
      formatToggle: true,
      swatches: this.getSwatches(),
    });

    this.userColorCss = game.user.color.css;

    Hooks.on('updateUser', (user: any) => {
      const newColor = game.user.color.css;
      if (user === game.user && this.userColorCss !== newColor) {
        debug('Updating user custom swatch in Coloris.');
        this.userColorCss = newColor;
        // The documentation supports this usage, even if TypeScript does not. It is designed to allow a caller to swap out individual settings.
        //@ts-expect-error
        Coloris({ swatches: this.getSwatches() });
      }
    });
  }

  private getSwatches(): string[] {
    const userColorSwatch = game.user.color.css;
    return [
      'rgba(116, 27, 43, 1)',
      'rgba(101, 56, 14, 1)',
      'rgba(115, 99, 63, 1)',
      'rgba(255, 182, 42, 1)',
      'rgba(55, 109, 71, 1)',
      'rgba(62, 74, 117, 1)',
      'rgba(31, 76, 145, 1)',
      'rgba(2, 90, 128, 1)',
      'rgba(100, 64, 128, 1)',
      'rgba(117, 53, 88, 1)',
      'rgba(68, 72, 86, 1)',
      userColorSwatch,
    ];
  }
}
