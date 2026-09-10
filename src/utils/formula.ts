import type { Item5e } from 'src/types/item.types';
import { debug, error, warn } from './logging';
import type {
  Actor5e,
  MaxPreparedSpellFormula,
  SpellCalculations,
} from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { isNil } from './data';
import type {
  BasicRollConfiguration,
  BasicRollDialogConfiguration,
  BasicRollMessageConfiguration,
  BasicRollProcessConfiguration,
} from 'src/foundry/foundry.types';
import { coalesce } from './formatting';
import { CONSTANTS } from 'src/constants';

export function simplifyFormula(
  formula: string,
  removeFlavor: boolean = false
): string {
  try {
    if (removeFlavor) {
      formula = formula
        ?.replace(foundry.dice.terms.RollTerm.FLAVOR_REGEXP, '')
        ?.replace(foundry.dice.terms.RollTerm.FLAVOR_REGEXP_STRING, '')
        ?.trim();
    }

    if (formula?.trim() === '') {
      return '';
    }

    const roll = Roll.create(formula);

    const simplifiedTerms = roll.terms.map((t: any) =>
      t.isIntermediate
        ? new foundry.dice.terms.NumericTerm({
            number: t.evaluate({ allowInteractive: false }).total,
            options: t.options,
          })
        : t
    );

    let simplifiedFormula = Roll.fromTerms(simplifiedTerms).formula;

    return simplifiedFormula;
  } catch (e) {
    error('Unable to simplify formula due to an error.', false, e);
    return formula;
  }
}

export function getMaxPreparedSpellsSampleFormulas(): MaxPreparedSpellFormula[] {
  return [
    {
      label: 'TIDY5E.Class.Artificer',
      value: '@abilities.int.mod + floor(@classes.artificer.levels / 2)',
    },
    {
      label: 'TIDY5E.Class.Bard',
      value:
        'max(@classes.bard.levels + 3 - floor(@classes.bard.levels/20), (min(floor(@classes.bard.levels/10),1) * (14 + min(floor(@classes.bard.levels/11),1) + min(floor(@classes.bard.levels/13),1) + (min(floor(@classes.bard.levels/14),1) * 2) + min(floor(@classes.bard.levels/15),1) + min(floor(@classes.bard.levels/17),1) + (min(floor(@classes.bard.levels/18),1) * 2))))',
    },
    {
      label: 'TIDY5E.Class.Cleric',
      value: '@abilities.wis.mod + @classes.cleric.levels',
    },
    {
      label: 'TIDY5E.Class.Druid',
      value: '@abilities.wis.mod + @classes.druid.levels',
    },
    {
      label: 'TIDY5E.Class.Paladin',
      value: '@abilities.cha.mod + floor(@classes.paladin.levels / 2)',
    },
    { label: 'TIDY5E.Class.Ranger', value: 'ceil(@classes.ranger.levels/2)+1' },
    {
      label: 'TIDY5E.Class.Sorcerer',
      value:
        'min(@classes.sorcerer.levels + 1, 12 + min(floor(@classes.sorcerer.levels/13),1) + min(floor(@classes.sorcerer.levels/15),1) + min(floor(@classes.sorcerer.levels/17),1))',
    },
    {
      label: 'TIDY5E.Class.Wizard',
      value: '@abilities.int.mod + @classes.wizard.levels',
    },
  ];
}

const faces: Record<string, string> = {
  '1': 'fa-solid fa-dice-one',
  '2': 'fa-solid fa-dice-two',
  '3': 'fa-solid fa-dice-three',
  '4': 'fa-solid fa-dice-four',
  '5': 'fa-solid fa-dice-five',
  '6': 'fa-solid fa-dice-six',
};

const unknownFace = 'fa-solid fa-dice';

export function getUsesRechargeDiceRange(uses: any | undefined) {
  const recovery = uses?.recovery[0];
  const formula = recovery?.formula ?? '';
  const rechargeRange = formula === '6' ? formula : `${formula}-6`;
  const diceIconClass = faces[formula] ?? unknownFace;

  return {
    rechargeRange,
    diceIconClass,
  };
}
