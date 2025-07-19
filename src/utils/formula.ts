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

export function calculateSpellAttackAndDc(
  actor: Actor5e,
  spellClass: Item5e
): SpellCalculations {
  try {
    const rollData = actor.getRollData();

    const prof = actor.system.attributes.prof ?? 0;
    const spellAbility = coalesce(
      spellClass?.system?.spellcasting?.ability,
      actor.system.attributes.spellcasting
    );
    const abilityMod =
      (spellAbility != ''
        ? actor.system.abilities[spellAbility].mod
        : actor.system.attributes.spell.mod) ?? 0;
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

    const abilityName =
      CONFIG.DND5E.abilities[
        spellAbility as keyof typeof CONFIG.DND5E.abilities
      ]?.label ?? FoundryAdapter.localize('DND5E.None');

    const hasSpellcastingProgression =
      !isNil(spellClass?.system.spellcasting.progression) &&
      spellClass?.system.spellcasting.progression !==
        CONSTANTS.SPELLCASTING_PROGRESSION_NONE;

    return {
      dc: hasSpellcastingProgression
        ? spellClass?.system.spellcasting.save
        : actor.system.attributes.spell.dc,
      dcTooltip: getDcTooltip(actor, spellAbility),
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
      dc: actor.system.attributes.spell.dc,
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

  // `Roll.fromTerms` doesn't allow an empty array since it expects a sequence
  // of tokens that it can parse into a syntax tree. Therefore, we need to be
  // careful about what we pass into it.
  //
  // TODO: To correctly prune non-deterministic terms from the formula, we need
  // to invoke the RollParser and prune elements from the syntax tree.
  //
  // This `if` statement handles the most common failure case, wherein the whole
  // formula is non-deterministic, but it's just a temporary band-aid; the real
  // fix will be considerably more complicated to implement.
  //
  // Currently, an expression like `1 + 1d4 * 2` would prune the `1d4` and
  // attempt to roll `1 + * 2`, causing an error. The try/catch block below
  // anticipates that possibility and logs it as a warning since it's a known
  // issue, but it should ideally be replaced with a more rigorous fix.
  if (deterministicRawBonus.length == 0) {
    return 0;
  }

  let bonusRoll = Roll.fromTerms([new foundry.dice.terms.NumericTerm(0)]);
  try {
    bonusRoll = Roll.fromTerms(deterministicRawBonus);

    let bonusTotal = 0;
    if (Roll.validate(bonusRoll.formula)) {
      bonusTotal = bonusRoll.evaluateSync({ allowInteractive: false }).total;
    }
    return bonusTotal;
  } catch (e: any) {
    warn(e.toString());
    return 0;
  }
}

export function getDcTooltip(actor: Actor5e, spellAbility: string) {
  const base = 8;

  const abilityMod =
    (spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0) ?? 0;
  const abilityName =
    CONFIG.DND5E.abilities[spellAbility as keyof typeof CONFIG.DND5E.abilities]
      ?.label ?? FoundryAdapter.localize('DND5E.None');
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
    bonusRoll.evaluateSync({ allowInteractive: false });
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

type RawSpellAttackType = 'rsak' | 'msak';

export async function rollRawSpellAttack(
  ev: MouseEvent,
  actor: Actor5e,
  attackType?: RawSpellAttackType,
  spellcastingAbility?: string
) {
  const rollConfig: BasicRollProcessConfiguration = {
    evaluate: true,
    event: ev,
    hookNames: ['rawSpellAttack', 'd20Test'],
    rolls: [getSpellAttackRoll(actor, attackType, spellcastingAbility)],
    subject: actor,
  };

  let flavorKey =
    attackType === 'rsak'
      ? 'TIDY5E.ActorRangedSpellAttackFlavorText'
      : attackType === 'msak'
      ? 'TIDY5E.ActorMeleeSpellAttackFlavorText'
      : 'TIDY5E.ActorSpellAttackFlavorText';

  let flavor = FoundryAdapter.localize(flavorKey);

  const messageConfig: BasicRollMessageConfiguration = {
    rollMode: game.settings.get('core', 'rollMode'),
    data: {
      'flags.dnd5e.roll': {
        type: 'attack',
      },
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      flavor,
    },
  };

  let titleKey =
    attackType === 'rsak'
      ? 'TIDY5E.ActorRangedSpellAttackTitle'
      : attackType === 'msak'
      ? 'TIDY5E.ActorMeleeSpellAttackTitle'
      : 'TIDY5E.ActorSpellAttackTitle';

  let title = FoundryAdapter.localize(titleKey, {
    actorName: actor.name,
  });

  const dialog: BasicRollDialogConfiguration = {
    options: { title },
  };

  const rolls = await CONFIG.Dice.D20Roll.build(
    rollConfig,
    dialog,
    messageConfig
  );

  debug(rolls);
}

function getSpellAttackRoll(
  actor: any,
  attackType: string | undefined,
  spellcastingAbility: string | undefined
): BasicRollConfiguration {
  const effectiveAttackType = attackType ?? 'rsak';

  const rollData: Record<string, any> = {};

  const parts: string[] = [];

  // Ability score modifier
  const filteredClass = actor.sheet.classSpellbookFilter;

  spellcastingAbility ??=
    actor.classes?.[filteredClass]?.system.spellcasting?.ability;

  const spellcastingMod = actor.system.abilities[spellcastingAbility!]?.mod;

  if (spellcastingAbility !== 'none' && spellcastingMod) {
    parts.push('@mod');
    rollData.mod = spellcastingMod;
  }

  // Add proficiency bonus.
  parts.push('@prof');
  rollData.prof = actor.system.attributes.prof;

  // Actor-level global bonus to attack rolls
  const actorBonusAttack = actor.system.bonuses?.[effectiveAttackType]?.attack;
  if (actorBonusAttack) {
    parts.push(actorBonusAttack);
  }

  return {
    parts,
    data: rollData,
    options: {
      elvenAccuracy: actor.flags['dnd5e']?.elvenAccuracy ?? false,
      halflingLucky: actor.flags['dnd5e']?.halflingLucky ?? false,
    },
    subject: actor,
  };
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
