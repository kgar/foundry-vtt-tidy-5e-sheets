import type { Item5e } from 'src/types/item';
import { debug, error } from './logging';
import type {
  Actor5e,
  MaxPreparedSpellFormula,
  SpellAttackModCalculations,
} from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';

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

export function calculateSpellAttackMod(
  actor: Actor5e
): SpellAttackModCalculations {
  try {
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

    let rsakBonusTotal = calculateDeterministicBonus(rawRsak);

    let rsakTotal = (spellAttackMod + rsakBonusTotal).toString();

    if (!rsakTotal.startsWith('-')) {
      rsakTotal = '+' + rsakTotal;
    }

    let rawMsak = Roll.replaceFormulaData(
      actor.system.bonuses.msak.attack,
      rollData,
      { missing: 0, warn: false }
    );

    let msakBonusTotal = calculateDeterministicBonus(rawMsak);

    let msakTotal = (spellAttackMod + msakBonusTotal).toString();

    if (!msakTotal.startsWith('-')) {
      msakTotal = '+' + msakTotal;
    }

    const abilityName = CONFIG.DND5E.abilities[spellAbility].label;
    return {
      meleeMod: msakTotal,
      meleeTooltip: buildAttackModTooltip(
        abilityName,
        abilityMod,
        prof,
        msakBonusTotal
      ),
      meleeHasBonus: msakBonusTotal !== 0,
      rangedMod: rsakTotal,
      rangedTooltip: buildAttackModTooltip(
        abilityName,
        abilityMod,
        prof,
        rsakBonusTotal
      ),
      rangedHasBonus: rsakBonusTotal !== 0,
    };
  } catch (e) {
    error('An error occurred while calculating spell attack bonus', false, e);
    debug('Spell attack bonus error troubleshooting details', {
      bonuses: actor.system.bonuses,
      actor: actor,
    });

    return {
      meleeMod: '',
      meleeTooltip: '',
      meleeHasBonus: false,
      rangedMod: '',
      rangedTooltip: '',
      rangedHasBonus: false,
    };
  }
}

function buildAttackModTooltip(
  abilityName: string,
  abilityMod: number,
  proficiency: number,
  bonusTotal: number
) {
  let tooltip = '';
  if (abilityMod !== 0) {
    tooltip += `${abilityMod} (${abilityName})`;
  }

  if (proficiency !== 0) {
    if (tooltip !== '') {
      tooltip += proficiency < 0 ? ' - ' : ' + ';
    }
    tooltip += `${Math.abs(proficiency)} (${FoundryAdapter.localize(
      'DND5E.ProficiencyBonus'
    )})`;
  }

  if (bonusTotal !== 0) {
    if (tooltip !== '') {
      tooltip += bonusTotal < 0 ? ' - ' : ' + ';
    }
    tooltip += `${Math.abs(bonusTotal)} (${FoundryAdapter.localize(
      'DND5E.Bonus'
    )})`;
  }

  return tooltip;
}

function calculateDeterministicBonus(rawBonus: string): number {
  if (!Roll.validate(rawBonus)) {
    return 0;
  }

  const deterministicRawBonus = new Roll(rawBonus).terms.filter(
    (t: any) => t.isDeterministic
  );

  const bonusRoll = Roll.fromTerms(deterministicRawBonus);

  let bonusTotal = 0;
  if (Roll.validate(bonusRoll.formula)) {
    bonusTotal = bonusRoll.evaluate({ async: false }).total;
  }
  return bonusTotal;
}
