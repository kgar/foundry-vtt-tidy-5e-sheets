import type { ExhaustionConfig } from "src/settings/settings.types";

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
        ]
    }
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
        ]
    }
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
        ]
    }
}