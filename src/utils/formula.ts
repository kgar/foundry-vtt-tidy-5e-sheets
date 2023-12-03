import type { Item5e } from 'src/types/item';
import { error } from './logging';
import type { MaxPreparedSpellFormula } from 'src/types/types';

export function scaleCantripDamageFormula(spell: Item5e, formula: string) {
  try {
    const scaledFormula = spell._scaleCantripDamage(
      [formula],
      spell.system.scaling.formula,
      spell.actor.type === 'character'
        ? spell.actor.system.details.level ?? 0
        : spell.system.preparation.mode === 'innate'
        ? Math.ceil(spell.actor.system.details.cr ?? 0)
        : spell.actor.system.details.spellLevel ?? 0,
      spell.getRollData()
    );

    return scaledFormula;
  } catch (e) {
    error(
      'An error occurred while scaling cantrip damage. Returning original formula.',
      false,
      e
    );
    return formula;
  }
}

export function simplifyFormula(
  formula: string,
  removeFlavor: boolean = false
): string {
  try {
    if (removeFlavor) {
      formula = formula
        ?.replace(RollTerm.FLAVOR_REGEXP, '')
        ?.replace(RollTerm.FLAVOR_REGEXP_STRING, '')
        ?.trim();
    }

    if (formula?.trim() === '') {
      return '';
    }

    const roll = Roll.create(formula);

    const simplifiedTerms = roll.terms.map((t: any) =>
      t.isIntermediate
        ? new NumericTerm({ number: t.evaluate().total, options: t.options })
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
      label: 'T5EK.Class.Artificer',
      value: '@abilities.int.mod + floor(@classes.artificer.levels / 2)',
    },
    {
      label: 'T5EK.Class.Cleric',
      value: '@abilities.wis.mod + @classes.cleric.levels',
    },
    {
      label: 'T5EK.Class.Druid',
      value: '@abilities.wis.mod + @classes.druid.levels',
    },
    {
      label: 'T5EK.Class.Paladin',
      value: '@abilities.cha.mod + floor(@classes.paladin.levels / 2)',
    },
    { label: 'T5EK.Class.Ranger', value: 'ceil(@classes.rangers.levels/2)+1' },
    {
      label: 'T5EK.Class.Wizard',
      value: '@abilities.int.mod + @classes.wizard.levels',
    },
  ];
}
