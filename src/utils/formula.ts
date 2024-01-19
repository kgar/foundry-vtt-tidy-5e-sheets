import type { Item5e } from 'src/types/item';
import { debug, error } from './logging';
import type {
  Actor5e,
  MaxPreparedSpellFormula,
  SpellCalculations,
} from 'src/types/types';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
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

export function calculateSpellAttackAndDc(actor: Actor5e): SpellCalculations {
  try {
    const rollData = actor.getRollData();

    const prof = actor.system.attributes.prof ?? 0;
    const spellAbility = actor.system.attributes.spellcasting;
    const abilityMod =
      (spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0) ?? 0;
    const spellAttackMod = prof + abilityMod;

    const rawRsak = Roll.replaceFormulaData(
      actor.system.bonuses.rsak.attack,
      rollData,
      { missing: 0, warn: false }
    );

    const rsakBonusTotal = calculateDeterministicBonus(rawRsak);

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

    const abilityName = !isNil(spellAbility, '')
      ? CONFIG.DND5E.abilities[spellAbility].label
      : FoundryAdapter.localize('DND5E.None');

    return {
      dc: actor.system.attributes.spelldc,
      dcTooltip: getDcTooltip(actor),
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
      dc: actor.system.attributes.spelldc,
      dcTooltip: '',
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
    tooltip += abilityMod < 0 ? ' - ' : ' + ';
    tooltip += `${Math.abs(abilityMod)} (${abilityName})`;
  }

  if (proficiency !== 0) {
    tooltip += proficiency < 0 ? ' - ' : ' + ';
    tooltip += `${Math.abs(proficiency)} (${FoundryAdapter.localize(
      'DND5E.ProficiencyBonus'
    )})`;
  }

  if (bonusTotal !== 0) {
    tooltip += bonusTotal < 0 ? ' - ' : ' + ';
    tooltip += `${Math.abs(bonusTotal)} (${FoundryAdapter.localize(
      'DND5E.Bonus'
    )})`;
  }

  return tooltip.trim();
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

export function getDcTooltip(actor: Actor5e) {
  const base = 8;
  const spellAbility = actor.system.attributes.spellcasting;
  const abilityMod =
    (spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0) ?? 0;
  const abilityName = !isNil(spellAbility, '')
    ? CONFIG.DND5E.abilities[spellAbility].label
    : FoundryAdapter.localize('DND5E.None');
  const prof = actor.system.attributes.prof ?? 0;

  let tooltip = base.toString();

  if (abilityMod !== 0) {
    tooltip += abilityMod < 0 ? ' - ' : ' + ';
    tooltip += `${Math.abs(abilityMod)} (${abilityName})`;
  }

  if (prof !== 0) {
    tooltip += prof < 0 ? ' - ' : ' + ';
    tooltip += `${Math.abs(prof)} (${FoundryAdapter.localize(
      'DND5E.ProficiencyBonus'
    )})`;
  }

  const rawBonus = actor.system.bonuses.spell.dc?.toString()?.trim();
  if (!isNil(rawBonus, '') && Roll.validate(rawBonus)) {
    const bonusRoll = new Roll(rawBonus);
    bonusRoll.evaluate({ async: false });
    const bonusTotal = bonusRoll.total;

    if (bonusTotal !== 0) {
      tooltip += bonusTotal < 0 ? ' - ' : ' + ';
      tooltip += `${Math.abs(bonusTotal)} (${FoundryAdapter.localize(
        'DND5E.Bonus'
      )})`;
    }
  }

  return tooltip;
}
