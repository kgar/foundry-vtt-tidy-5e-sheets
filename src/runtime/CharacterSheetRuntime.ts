import type {
  CharacterSheetContext,
  CustomContent,
  HtmlRuntimeContent,
  Tab,
} from 'src/types/types';
import CharacterAttributesTab from 'src/sheets/character/tabs/CharacterAttributesTab.svelte';
import CharacterInventoryTab from 'src/sheets/character/tabs/CharacterInventoryTab.svelte';
import CharacterSpellbookTab from 'src/sheets/character/tabs/CharacterSpellbookTab.svelte';
import CharacterFeaturesTab from 'src/sheets/character/tabs/CharacterFeaturesTab.svelte';
import ActorEffectsTab from 'src/sheets/actor/ActorEffectsTab.svelte';
import CharacterBiographyTab from 'src/sheets/character/tabs/CharacterBiographyTab.svelte';
import ActorJournalTab from 'src/sheets/actor/tabs/ActorJournalTab.svelte';
import ActorActionsTab from 'src/sheets/actor/tabs/ActorActionsTab.svelte';
import type { RegisteredContent, RegisteredTab } from './types';
import { CONSTANTS } from 'src/constants';
import { warn } from 'src/utils/logging';
import { TabManager } from './tab/TabManager';
import type {
  ActorTabRegistrationOptions,
  ContentRegistrationOptions,
  SupportedContent,
} from 'src/api/api.types';
import { HandlebarsContent } from 'src/api/content/HandlebarsContent';
import { HandlebarsTemplateRenderer } from 'src/api/HandlebarsTemplateRenderer';
import { CustomContentManager } from './content/CustomContentManager';

export class CharacterSheetRuntime {
  private static _content: RegisteredContent<CharacterSheetContext>[] = [];
  private static _tabs: RegisteredTab<CharacterSheetContext>[] = [
    {
      title: 'T5EK.Actions.TabName',
      content: {
        component: ActorActionsTab,
        type: 'svelte',
      },
      id: CONSTANTS.TAB_ACTOR_ACTIONS,
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_ATTRIBUTES,
      title: 'DND5E.Attributes',
      content: {
        component: CharacterAttributesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_INVENTORY,
      title: 'DND5E.Inventory',
      content: {
        component: CharacterInventoryTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_SPELLBOOK,
      title: 'DND5E.Spellbook',
      content: {
        component: CharacterSpellbookTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_FEATURES,
      title: 'DND5E.Features',
      content: {
        component: CharacterFeaturesTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_EFFECTS,
      title: 'DND5E.Effects',
      content: {
        component: ActorEffectsTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_BIOGRAPHY,
      title: 'DND5E.Biography',
      content: {
        component: CharacterBiographyTab,
        type: 'svelte',
      },
      layout: 'classic',
    },
    {
      id: CONSTANTS.TAB_CHARACTER_JOURNAL,
      title: 'T5EK.JournalTabName',
      content: {
        component: ActorJournalTab,
        type: 'svelte',
      },
      enabled: (context) => context.owner,
      layout: 'classic',
    },
  ];

  static async getContent(
    context: CharacterSheetContext
  ): Promise<CustomContent[]> {
    return await CustomContentManager.prepareContentForRender(
      context,
      CharacterSheetRuntime._content
    );
  }

  static async getTabs(context: CharacterSheetContext): Promise<Tab[]> {
    return await TabManager.prepareTabsForRender(
      context,
      CharacterSheetRuntime._tabs
    );
  }

  static getAllRegisteredTabs(): RegisteredTab<CharacterSheetContext>[] {
    return [...CharacterSheetRuntime._tabs];
  }

  static registerContent(
    selector: string,
    position: string,
    content: SupportedContent,
    options: ContentRegistrationOptions | undefined
  ) {
    let mappedContent: HtmlRuntimeContent | HandlebarsTemplateRenderer =
      content instanceof HandlebarsContent
        ? new HandlebarsTemplateRenderer({
            path: content.path,
          })
        : ({
            html: content.html,
            renderScheme: content.renderScheme,
            type: 'html',
          } satisfies HtmlRuntimeContent);

    this._content.push({
      selector: selector,
      position: position,
      content: mappedContent,
      activateDefaultSheetListeners: content.activateDefaultSheetListeners,
      enabled: content.enabled,
      layout: options?.layout ?? 'all',
      renderScheme: content.renderScheme,
      getData:
        content instanceof HandlebarsContent ? content.getData : undefined,
      onRender: content.onRender,
    });
  }

  static registerTab(
    tab: RegisteredTab<CharacterSheetContext>,
    options?: ActorTabRegistrationOptions
  ) {
    const tabExists = CharacterSheetRuntime._tabs.some((t) => t.id === tab.id);

    if (tabExists && !options?.overrideExisting) {
      warn(`Tab with id ${tab.id} already exists.`);
      return;
    }

    if (tabExists && options?.overrideExisting) {
      const index = CharacterSheetRuntime._tabs.findIndex(
        (t) => t.id === tab.id
      );
      if (index >= 0) {
        CharacterSheetRuntime._tabs.splice(index, 1);
      }
    }

    CharacterSheetRuntime._tabs.push(tab);

    return CharacterSheetRuntime.getAllRegisteredTabs();
  }
}
