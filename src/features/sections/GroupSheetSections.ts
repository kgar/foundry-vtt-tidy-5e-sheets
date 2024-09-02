import type { GroupMemberSection } from 'src/types/group.types';
import type { SheetPreference } from '../user-preferences/user-preferences.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import { error } from 'src/utils/logging';

export class GroupSheetSections {
  static configureMemberSections(
    sections: GroupMemberSection[],
    tabId: string,
    sheetPreferences: SheetPreference
    /* TODO: sectionConfig?: Record<string, SectionConfig> */
  ) {
    try {
      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      sections.forEach((section) => {
        ItemUtils.sortItems(
          section.members,
          sortMode
        );
      });
    } catch (e) {
      error('An error occurred while configuring group members', false, e);
    }
    return sections;
  }
}
