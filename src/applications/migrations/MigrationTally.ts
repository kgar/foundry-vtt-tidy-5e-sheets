/**
 * A tally that represents the number of migrations that have been added to Tidy.
 * This field is used by the developer to control whether a migration notification appears for the GM.
 * When the GM indicates "Do Not Show Again," the migration tally is saved to world config,
 * to prevent the dialog from showing until the next round of migrations.
 * The number of times this tally advances is not as important as the fact that it advances at least once for any release that contains at least one new migration.
 */

export const MigrationTally = 3 as const;
