import type { Item5e } from 'src/types/item';
import { error } from './logging';
import type {
  Actor5e,
  MaxPreparedSpellFormula,
  SpellAttackModCalculations,
} from 'src/types/types';
import { isNil } from './data';

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
    { label: 'T5EK.Class.Ranger', value: 'ceil(@classes.ranger.levels/2)+1' },
    {
      label: 'T5EK.Class.Wizard',
      value: '@abilities.int.mod + @classes.wizard.levels',
    },
  ];
}

export function extractDeterministicFormula(formula: string): string {
  try {
    formula =
      formula
        ?.replace(RollTerm.FLAVOR_REGEXP, '')
        ?.replace(RollTerm.FLAVOR_REGEXP_STRING, '')
        ?.trim() ?? '';

    if (formula?.trim() === '') {
      return '';
    }

    const roll = Roll.create(formula);

    const deterministicTerms = roll.terms
      .filter((t: any) => t.isDeterministic || t.isIntermediate)
      .map(
        (t: any) =>
          new NumericTerm({ number: t.evaluate().total, options: t.options })
      );

    if (!deterministicTerms.length) {
      return '';
    }

    let simplifiedFormula = Roll.fromTerms(deterministicTerms).formula;

    return simplifiedFormula;
  } catch (e) {
    error('Unable to simplify formula due to an error.', false, e);
    return formula;
  }
}

export function calculateSpellAttackMod(
  actor: Actor5e
): SpellAttackModCalculations {
  const rollData = actor.getRollData();

  let prof = actor.system.attributes.prof ?? 0;
  let spellAbility = actor.system.attributes.spellcasting;
  let abilityMod =
    (spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0) ?? 0;
  let spellAttackMod = prof + abilityMod;

  let rawRsak = Roll.replaceFormulaData(
    actor.system.bonuses.rsak.attack,
    rollData,
    { missing: 0, warn: false }
  );

  let staticRsak = simplifyFormula(extractDeterministicFormula(rawRsak));

  let rsakTotalSegments = [spellAttackMod];
  if (!isNil(staticRsak, '')) {
    rsakTotalSegments.push(staticRsak);
  }

  let rsakTotal = simplifyFormula(rsakTotalSegments.join('+'));

  if (!rsakTotal.startsWith('-')) {
    rsakTotal = "+" + rsakTotal;
  }
  
  let rawMsak = Roll.replaceFormulaData(
    actor.system.bonuses.msak.attack,
    rollData,
    { missing: 0, warn: false }
  );

  let staticMsak = simplifyFormula(extractDeterministicFormula(rawMsak));

  let msakTotalSegments = [spellAttackMod];
  if (!isNil(staticMsak, '')) {
    msakTotalSegments.push(staticMsak);
  }

  let msakTotal = simplifyFormula(msakTotalSegments.join('+'));

  if (!msakTotal.startsWith('-')) {
    msakTotal = "+" + msakTotal;
  }

  let spellAttackText =
    spellAttackMod > 0 ? '+' + spellAttackMod : spellAttackMod;

  return {
    meleeMod: msakTotal,
    meleeTooltip: 'Test MSAK',
    rangedMod: rsakTotal,
    rangedTooltip: 'Test RSAK',
  };
}
