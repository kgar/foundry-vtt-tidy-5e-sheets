import type { GroupMemberSection } from 'src/types/group.types';
import type { UserSheetPreference } from '../user-preferences/user-preferences.types';
import { ItemUtils } from 'src/utils/ItemUtils';
import { error } from 'src/utils/logging';

export class GroupSheetSections {
  static configureMemberSections(
    sections: GroupMemberSection[],
    tabId: string,
    sheetPreferences: UserSheetPreference
    /* TODO: sectionConfig?: Record<string, SectionConfig> */
  ) {
    try {
      const sortMode = sheetPreferences.tabs?.[tabId]?.sort ?? 'm';

      // Members are already in sorted order when sorting is set to manual.
      if (sortMode === 'a') {
        sections.forEach((section) => {
          ItemUtils.sortItems(section.members, sortMode);
        });
      }
    } catch (e) {
      error('An error occurred while configuring group members', false, e);
    }
    return sections;
  }
}
