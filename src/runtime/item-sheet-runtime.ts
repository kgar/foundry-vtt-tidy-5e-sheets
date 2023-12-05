import type { RegisterItemDetailsSectionOptions } from 'src/api/api.types';

// TODO: Provide dynamic columns for all known item types

let itemDetailCustomSections: RegisterItemDetailsSectionOptions[] = [];

export function registerItemDetailSection(
  section: RegisterItemDetailsSectionOptions
) {
  // validate? Or let chaos reign?
  itemDetailCustomSections.push(section);
}

export function getCustomItemDetailSections(
  context: any
): RegisterItemDetailsSectionOptions[] {
  const sections = [...itemDetailCustomSections].filter(
    (s) => !s.enabled || s.enabled(context)
  );
  return sections;
}
