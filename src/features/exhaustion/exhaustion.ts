import type {
  ExhaustionConfig,
  IconWithSeverity,
} from 'src/features/exhaustion/exhaustion.types';

export function getDefaultExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 6,
    hints: [],
  };
}

const iconsWithSeverity: IconWithSeverity[] = [
  { iconCssClass: 'far fa-grin', severity: 0 },
  { iconCssClass: 'far fa-smile', severity: 1 },
  { iconCssClass: 'far fa-meh', severity: 1 },
  { iconCssClass: 'far fa-frown', severity: 2 },
  { iconCssClass: 'far fa-frown-open', severity: 2 },
  { iconCssClass: 'far fa-tired', severity: 3 },
  { iconCssClass: 'far fa-dizzy', severity: 3 },
];

export function getExhaustionIconsWithSeverity(
  levels: number
): IconWithSeverity[] {
  const levelsIncludingZero = levels + 1;

  if (levelsIncludingZero === 0) {
    return [];
  }

  const lastIconWithSeverity = iconsWithSeverity[iconsWithSeverity.length - 1];

  if (levelsIncludingZero === 1) {
    return [iconsWithSeverity[0]];
  }

  if (levelsIncludingZero === 2) {
    return [iconsWithSeverity[0], lastIconWithSeverity];
  }

  const middleIcons = iconsWithSeverity.slice(1, iconsWithSeverity.length - 1);
  const middleIconsLength = middleIcons.length;

  let distributedIcons: {
    iconWithSeverity: IconWithSeverity;
    order: number;
  }[] = [];

  for (let index = 0; index < levelsIncludingZero - 2; index++) {
    const iconIndex = index % middleIconsLength;
    distributedIcons.push({
      iconWithSeverity: middleIcons[iconIndex],
      order: iconIndex,
    });
  }

  return [
    iconsWithSeverity[0],
    ...distributedIcons
      .sort((a, b) => a.order - b.order)
      .map((q) => q.iconWithSeverity),
    lastIconWithSeverity,
  ];
}
