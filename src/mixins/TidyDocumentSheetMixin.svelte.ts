import { SheetPreferencesService } from 'src/features/user-preferences/SheetPreferencesService';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import type {
  ApplicationConfiguration,
  ApplicationPosition,
} from 'src/types/application.types';
import { error } from 'src/utils/logging';

export function TidyDocumentSheetMixin(
  sheetType: string,
  BaseApplication: any
) {
  class TidyDocumentSheet extends BaseApplication {
    constructor(...args: any[]) {
      super(...args);
    }

    _initializeApplicationOptions(options: Partial<ApplicationConfiguration>) {
      options = super._initializeApplicationOptions(options);

      try {
        const { width, height } = SheetPreferencesService.getByType(sheetType);

        const position = (options.position ??= {});

        if (width) {
          position.width = width;
        }

        if (height) {
          position.height = height;
        }
      } catch (e) {
        error(
          'An error occurred while initializing application options',
          false,
          e
        );
      }

      return options;
    }

    async #persistSheetPositionPreferences(position?: ApplicationPosition) {
      if (!position || this.minimized) {
        return;
      }

      const { width, height } = position;

      const { width: configuredWidth, height: configuredHeight } =
        SheetPreferencesService.getByType(sheetType);

      if (width !== configuredWidth) {
        await SheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'width',
          width
        );
      }

      if (height !== configuredHeight) {
        await SheetPreferencesService.setDocumentTypePreference(
          sheetType,
          'height',
          height
        );
      }
    }

    #debouncePersistSheetPositionPreferences = FoundryAdapter.debounce(
      this.#persistSheetPositionPreferences.bind(this),
      1000
    );

    _onPosition(position: ApplicationPosition) {
      super._onPosition(position);

      this.#debouncePersistSheetPositionPreferences(position);
    }
  }

  return TidyDocumentSheet;
}
