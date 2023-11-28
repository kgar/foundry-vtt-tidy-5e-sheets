import type {
  ExhaustionConfig,
  IconWithSeverity,
} from 'src/features/exhaustion/exhaustion.types';

export function getStandardExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 6,
    hints: [
      'T5EK.StandardExhaustion0',
      'T5EK.StandardExhaustion1',
      'T5EK.StandardExhaustion2',
      'T5EK.StandardExhaustion3',
      'T5EK.StandardExhaustion4',
      'T5EK.StandardExhaustion5',
      'T5EK.StandardExhaustion6',
    ],
  };
}

export function getOneDnDExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 11,
    hints: [
      'T5EK.OneDnDExhaustion0',
      'T5EK.OneDnDExhaustion1',
      'T5EK.OneDnDExhaustion2',
      'T5EK.OneDnDExhaustion3',
      'T5EK.OneDnDExhaustion4',
      'T5EK.OneDnDExhaustion5',
      'T5EK.OneDnDExhaustion6',
      'T5EK.OneDnDExhaustion7',
      'T5EK.OneDnDExhaustion8',
      'T5EK.OneDnDExhaustion9',
      'T5EK.OneDnDExhaustion10',
      'T5EK.OneDnDExhaustion11',
    ],
  };
}

export function getStandardVehicleExhaustionConfig(): ExhaustionConfig {
  return {
    type: 'specific',
    levels: 6,
    hints: [
      'T5EK.StandardVehicleExhaustion0',
      'T5EK.StandardVehicleExhaustion1',
      'T5EK.StandardVehicleExhaustion2',
      'T5EK.StandardVehicleExhaustion3',
      'T5EK.StandardVehicleExhaustion4',
      'T5EK.StandardVehicleExhaustion5',
      'T5EK.StandardVehicleExhaustion6',
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
