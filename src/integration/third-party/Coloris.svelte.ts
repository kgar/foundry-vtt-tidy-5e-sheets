import type { Tidy5eSheetsApi } from 'src/api/Tidy5eSheetsApi';
import { ThirdPartyIntegrationBase } from '../integration-classes';
import Coloris from '@melloware/coloris';
import { settings } from 'src/settings/settings.svelte';

export class ColorisThirdPartyIntegration extends ThirdPartyIntegrationBase {
  name: string = 'Coloris';

  init(_api: Tidy5eSheetsApi): void {
    import('./coloris.scss');
    Coloris.init();
    Coloris.coloris({
      el: '.coloris',
      formatToggle: true,
      swatches: [
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
      ],
    });

    $effect.root(() => {
      // The documentation supports this usage, even if TypeScript does not.
      //@ts-expect-error
      Coloris({});
    });
  }
}
