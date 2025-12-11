/** Supported spell school icon formats. */
export type SupportedSpellSchoolIcon = FontIconClass | IconFileSrcPath;

/** The necessary class text to render a font-based icon like FontAwesome. */
export type FontIconClass = string;

/** A path to an icon file like SVG. */
export type IconFileSrcPath = { iconSrc: string };
