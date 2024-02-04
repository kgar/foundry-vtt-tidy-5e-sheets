import type {
  ExhaustionConfig,
  IconWithSeverity,
} from 'src/features/exhaustion/exhaustion.types';

export function getStandardExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 6,
    hints: [
      'TIDY5E.StandardExhaustion0',
      'TIDY5E.StandardExhaustion1',
      'TIDY5E.StandardExhaustion2',
      'TIDY5E.StandardExhaustion3',
      'TIDY5E.StandardExhaustion4',
      'TIDY5E.StandardExhaustion5',
      'TIDY5E.StandardExhaustion6',
    ],
  };
}

export function getOneDnDExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 11,
    hints: [
      'TIDY5E.OneDnDExhaustion0',
      'TIDY5E.OneDnDExhaustion1',
      'TIDY5E.OneDnDExhaustion2',
      'TIDY5E.OneDnDExhaustion3',
      'TIDY5E.OneDnDExhaustion4',
      'TIDY5E.OneDnDExhaustion5',
      'TIDY5E.OneDnDExhaustion6',
      'TIDY5E.OneDnDExhaustion7',
      'TIDY5E.OneDnDExhaustion8',
      'TIDY5E.OneDnDExhaustion9',
      'TIDY5E.OneDnDExhaustion10',
      'TIDY5E.OneDnDExhaustion11',
    ],
  };
}

export function getStandardVehicleExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 6,
    hints: [
      'TIDY5E.StandardVehicleExhaustion0',
      'TIDY5E.StandardVehicleExhaustion1',
      'TIDY5E.StandardVehicleExhaustion2',
      'TIDY5E.StandardVehicleExhaustion3',
      'TIDY5E.StandardVehicleExhaustion4',
      'TIDY5E.StandardVehicleExhaustion5',
      'TIDY5E.StandardVehicleExhaustion6',
    ],
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
