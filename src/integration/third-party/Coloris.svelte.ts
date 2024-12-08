import type { Tidy5eSheetsApi } from 'src/api';
import { ThirdPartyIntegrationBase } from '../integration-classes';
import Coloris from '@melloware/coloris';
import { settings } from 'src/settings/settings.svelte';
import { getThemeOrDefault } from 'src/theme/theme';

export class ColorisThirdPartyIntegration extends ThirdPartyIntegrationBase {
  name: string = 'Coloris';

  init(_api: Tidy5eSheetsApi): void {
    import('./coloris.scss');
    Coloris.init();
    Coloris.coloris({
      el: '.coloris',
      formatToggle: true,
      swatches: [
        'rgba(58, 116, 126, 1)',
        'rgba(60, 179, 113, 0.3)',
        'rgba(60, 179, 113, 0.3)',
        'rgba(25, 94, 59, 1)',
        'rgba(144, 238, 144, 1)',
        'rgba(60, 179, 113, 0.3)',
        'rgba(25, 94, 59, 1)',
        'rgba(144, 238, 144, 1)',
        'rgba(255, 99, 71, 0.3)',
        'rgba(139, 0, 0, 1)',
        'rgba(255, 160, 122, 1)',
        'rgba(102, 205, 170, 0.3)',
        'rgba(0, 100, 0, 1)',
        'rgba(152, 251, 152, 1)',
        'rgba(221, 160, 221, 0.3)',
        'rgba(138, 43, 226, 1)',
        'rgba(255, 182, 193, 1)',
        'rgba(255, 165, 0, 0.3)',
        'rgba(184, 134, 11, 1)',
        'rgba(255, 215, 0, 1)',
      ],
    });

    $effect(() => {
      const theme = getThemeOrDefault(settings.colorScheme);
      // The documentation supports this usage, even if TypeScript does not.
      //@ts-expect-error
      Coloris({ themeMode: theme.type });
    });
  }
}
