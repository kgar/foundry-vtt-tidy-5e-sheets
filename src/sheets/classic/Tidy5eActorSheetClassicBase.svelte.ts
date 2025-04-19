import { CONSTANTS } from 'src/constants';
import {
  actorUsesActionFeature,
  getActorActionSections,
} from 'src/features/actions/actions.svelte';
import { FoundryAdapter } from 'src/foundry/foundry-adapter';
import { ActorPortraitRuntime } from 'src/runtime/ActorPortraitRuntime';
import { ItemFilterRuntime } from 'src/runtime/item/ItemFilterRuntime.svelte';
import { settings } from 'src/settings/settings.svelte';
import type { Item5e } from 'src/types/item.types';
import type {
  ActorSaves,
  ActorSheetContextV1,
  DamageModificationContextEntry,
  DamageModificationData,
} from 'src/types/types';
import { splitSemicolons } from 'src/utils/array';
import { isNil } from 'src/utils/data';
import { debug, error } from 'src/utils/logging';

let ActorSheetAppV1 = foundry.appv1?.sheets?.ActorSheet ?? ActorSheet;

export class Tidy5eActorSheetClassicBase extends ActorSheetAppV1 {
  async getData(options: any) {
    // The Actor's data
    const source = this.actor.toObject();

    // Concentration
    let saves: ActorSaves = {};
    if (
      [CONSTANTS.SHEET_TYPE_CHARACTER, CONSTANTS.SHEET_TYPE_NPC].includes(
        this.actor.type
      )
    ) {
      const attrConcentration = this.actor.system.attributes.concentration;
      if (
        this.actor.statuses.has(CONFIG.specialStatusEffects.CONCENTRATING) ||
        (FoundryAdapter.isSheetUnlocked(this.actor) && attrConcentration)
      ) {
        saves.concentration = {
          isConcentration: true,
          label: game.i18n.localize('DND5E.Concentration'),
          abbr: game.i18n.localize('DND5E.Concentration'),
          mod: Math.abs(attrConcentration.save),
          sign: this.actor.system.attributes.concentration.save < 0 ? '-' : '+',
        };
      }
    }

    let hasSpecialSaves = Object.keys(saves).length > 0;

    // Temporary HP
    const hp = { ...this.actor.system.attributes.hp };
    if (hp.temp === 0) delete hp.temp;
    if (hp.tempmax === 0) delete hp.tempmax;

    const editable = this.isEditable;

    const unlocked = FoundryAdapter.isSheetUnlocked(this.actor) && editable;

    const warnings = foundry.utils.deepClone(this.actor._preparationWarnings);
    let context: ActorSheetContextV1 = {
      abilities: foundry.utils.deepClone(this.actor.system.abilities),
      actions: await getActorActionSections(this.actor),
      activateEditors: (node, options) =>
        FoundryAdapter.activateEditors(node, this, options?.bindSecrets),
      actor: this.actor,
      actorPortraitCommands:
        ActorPortraitRuntime.getEnabledPortraitMenuCommands(this.actor),
      allowEffectsManagement: true,
      appId: this.appId,
      config: CONFIG.DND5E,
      customActorTraits: [],
      customContent: [],
      editable: editable,
      effects: dnd5e.applications.components.EffectsElement.prepareCategories(
        this.actor.allApplicableEffects()
      ),
      elements: this.options.elements,
      filterData: { ...this.actor.system.attributes.hp },
      filterPins: ItemFilterRuntime.defaultFilterPins[this.actor.type],
      hasSpecialSaves: hasSpecialSaves,
      healthPercentage: this.actor.system.attributes.hp.pct.toNearest(0.1),
      hp: hp,
      isCharacter: this.actor.type === 'character',
      isNPC: this.actor.type === 'npc',
      isVehicle: this.actor.type === 'vehicle',
      limited: this.actor.limited,
      items: Array.from(this.actor.items)
        .filter((i: Item5e) => !this.actor.items.has(i.system.container))
        .toSorted((a: Item5e, b: Item5e) => (a.sort || 0) - (b.sort || 0)),
      labels: this._getLabels(),
      lockExpChanges: FoundryAdapter.shouldLockExpChanges(),
      lockHpMaxChanges: FoundryAdapter.shouldLockHpMaxChanges(),
      lockItemQuantity: FoundryAdapter.shouldLockItemQuantity(),
      lockLevelSelector: FoundryAdapter.shouldLockLevelSelector(),
      lockMoneyChanges: FoundryAdapter.shouldLockMoneyChanges(),
      lockSensitiveFields:
        (!unlocked && settings.value.useTotalSheetLock) || !editable,
      modernRules: FoundryAdapter.checkIfModernRules(this.actor),
      movement: this._getMovementSpeed(this.actor.system),
      options: this.options,
      overrides: {
        attunement: foundry.utils.hasProperty(
          this.actor.overrides,
          'system.attributes.attunement.max'
        ),
      },
      owner: this.actor.isOwner,
      saves: saves,
      rollData: this.actor.getRollData(),
      senses: this._getSenses(this.actor.system),
      skills: foundry.utils.deepClone(this.actor.system.skills ?? {}),
      source: source.system,
      showLimitedSheet: FoundryAdapter.showLimitedSheet(this.actor),
      system: this.actor.system,
      tabs: [],
      tools: foundry.utils.deepClone(this.actor.system.tools ?? {}),
      traits: this._prepareTraits(this.actor.system),
      unlocked: unlocked,
      useActionsFeature: actorUsesActionFeature(this.actor),
      useClassicControls: settings.value.useClassicControlsForCharacter,
      useRoundedPortraitStyle: [
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_ALL as string,
        CONSTANTS.CIRCULAR_PORTRAIT_OPTION_CHARACTER as string,
      ].includes(settings.value.useCircularPortraitStyle),
      viewableWarnings:
        warnings?.filter((w: any) => !isNil(w.message?.trim(), '')) ?? [],
      warnings: warnings,
    };

    // Ability Scores
    for (const [a, abl] of Object.entries<any>(context.abilities)) {
      abl.icon = this._getProficiencyIcon(abl.proficient);
      abl.hover = CONFIG.DND5E.proficiencyLevels[abl.proficient];
      abl.label = CONFIG.DND5E.abilities[a]?.label;
      abl.baseProf = source.system.abilities[a]?.proficient ?? 0;
      abl.key = a;
    }

    // Skills & tools.
    const baseAbility = (prop: string, key: string) => {
      let src = source.system[prop]?.[key]?.ability;
      if (src) return src;
      if (prop === 'skills') src = CONFIG.DND5E.skills[key]?.ability;
      return src ?? 'int';
    };
    (['skills', 'tools'] as const).forEach((prop) => {
      for (const [key, entry] of Object.entries<any>(context[prop])) {
        entry.abbreviation =
          CONFIG.DND5E.abilities[entry.ability]?.abbreviation;
        entry.icon = this._getProficiencyIcon(entry.value);
        entry.hover = CONFIG.DND5E.proficiencyLevels[entry.value];
        entry.label =
          prop === 'skills'
            ? CONFIG.DND5E.skills[key]?.label
            : dnd5e.documents.Trait.keyLabel(key, { trait: 'tool' });
        entry.baseValue = source.system[prop]?.[key]?.value ?? 0;
        entry.baseAbility = baseAbility(prop, key);
      }
    });
  }

  /**
   * Prepare labels object for the context.
   * @returns {object}           Object containing various labels.
   * @protected
   */
  _getLabels() {
    const labels = { ...this.actor.labels };

    // Currency Labels
    labels.currencies = Object.entries(CONFIG.DND5E.currencies).reduce<
      Record<string, any>
    >((obj, [k, c]) => {
      obj[k] = c.label;
      return obj;
    }, {});

    // Proficiency
    labels.proficiency =
      game.settings.get('dnd5e', 'proficiencyModifier') === 'dice'
        ? `d${this.actor.system.attributes.prof * 2}`
        : `+${this.actor.system.attributes.prof}`;

    return labels;
  }

  /**
   * Prepare the display of movement speed data for the Actor.
   * @param {object} systemData               System data for the Actor being prepared.
   * @param {boolean} [largestPrimary=false]  Show the largest movement speed as "primary", otherwise show "walk".
   * @returns {{primary: string, special: string}}
   * @protected
   */
  _getMovementSpeed(systemData: any, largestPrimary = false) {
    const movement = systemData.attributes.movement ?? {};

    // Prepare an array of available movement speeds
    let speeds = [
      [
        movement.burrow,
        `${game.i18n.localize('DND5E.MovementBurrow')} ${movement.burrow}`,
      ],
      [
        movement.climb,
        `${game.i18n.localize('DND5E.MovementClimb')} ${movement.climb}`,
      ],
      [
        movement.fly,
        `${game.i18n.localize('DND5E.MovementFly')} ${movement.fly}${
          movement.hover
            ? ` (${game.i18n.localize('DND5E.MovementHover')})`
            : ''
        }`,
      ],
      [
        movement.swim,
        `${game.i18n.localize('DND5E.MovementSwim')} ${movement.swim}`,
      ],
    ];
    if (largestPrimary) {
      speeds.push([
        movement.walk,
        `${game.i18n.localize('DND5E.MovementWalk')} ${movement.walk}`,
      ]);
    }

    // Filter and sort speeds on their values
    speeds = speeds.filter((s) => s[0]).sort((a, b) => b[0] - a[0]);
    const units = movement.units ?? dnd5e.utils.defaultUnits('length');

    // Case 1: Largest as primary
    if (largestPrimary) {
      let primary = speeds.shift();
      return {
        primary: `${primary?.[1]} ${units}`,
        special: speeds.map((s) => s[1]).join(', '),
      };
    }

    // Case 2: Walk as primary
    else {
      return {
        primary: dnd5e.utils.formatLength(movement.walk ?? 0, units),
        special: speeds.length ? speeds.map((s) => s[1]).join(', ') : '',
      };
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare senses object for display.
   * @param {object} systemData  System data for the Actor being prepared.
   * @returns {object}           Senses grouped by key with localized and formatted string.
   * @protected
   */
  _getSenses(systemData: any) {
    const senses = systemData.attributes.senses ?? {};
    const tags: Record<string, string> = {};
    const units = senses.units ?? dnd5e.utils.defaultUnits('length');
    for (let [k, label] of Object.entries(CONFIG.DND5E.senses)) {
      const v = senses[k] ?? 0;
      if (v === 0) continue;
      tags[k] = `${game.i18n.localize(label)} ${dnd5e.utils.formatLength(
        v,
        units
      )}`;
    }
    if (senses.special)
      splitSemicolons(senses.special).forEach(
        (c, i) => (tags[`custom${i + 1}`] = c)
      );
    return tags;
  }

  /** @inheritDoc */
  async activateEditor(
    name: string,
    options: Record<string, any> = {},
    initialContent: string = ''
  ) {
    options.relativeLinks = true;
    return super.activateEditor(name, options, initialContent);
  }

  /* -------------------------------------------- */

  /**
   * Prepare the data structure for traits data like languages, resistances & vulnerabilities, and proficiencies.
   * @param {object} systemData  System data for the Actor being prepared.
   * @returns {object}           Prepared trait data.
   * @protected
   */
  _prepareTraits(systemData: any) {
    const traits = {};
    for (const [trait, traitConfig] of Object.entries(CONFIG.DND5E.traits)) {
      if (trait === 'dm') continue;
      const key =
        // @ts-expect-error
        traitConfig.actorKeyPath?.replace('system.', '') ?? `traits.${trait}`;
      const data = foundry.utils.deepClone(
        foundry.utils.getProperty(systemData, key)
      );
      if (!data) continue;
      foundry.utils.setProperty(traits, key, data);
      let values = data.value;
      if (!values) values = [];
      else if (values instanceof Set) values = Array.from(values);
      else if (!Array.isArray(values)) values = [values];

      // Split physical damage types from others if bypasses is set
      const physical: string[] = [];
      if (data.bypasses?.size) {
        values = values.filter((t: string) => {
          if (!CONFIG.DND5E.damageTypes[t]?.isPhysical) return true;
          physical.push(t);
          return false;
        });
      }

      data.selected = values.reduce(
        (obj: Record<string, string>, key: string) => {
          obj[key] = dnd5e.documents.Trait.keyLabel(key, { trait }) ?? key;
          return obj;
        },
        {} as Record<string, string>
      );

      // Display bypassed damage types
      if (physical.length) {
        const damageTypesFormatter = new Intl.ListFormat(game.i18n.lang, {
          style: 'long',
          type: 'conjunction',
        });
        const bypassFormatter = new Intl.ListFormat(game.i18n.lang, {
          style: 'long',
          type: 'disjunction',
        });
        data.selected.physical = game.i18n.format(
          'DND5E.DamagePhysicalBypasses',
          {
            damageTypes: damageTypesFormatter.format(
              physical.map((t) => dnd5e.documents.Trait.keyLabel(t, { trait }))
            ),
            bypassTypes: bypassFormatter.format(
              data.bypasses.reduce((acc: string[], t: string) => {
                const v = CONFIG.DND5E.itemProperties[t];
                if (v && v.isPhysical) acc.push(v.label);
                return acc;
              }, [])
            ),
          }
        );
      }

      // Add custom entries
      if (data.custom)
        splitSemicolons(data.custom).forEach(
          (c, i) => (data.selected[`custom${i + 1}`] = c)
        );
      data.cssClass = !foundry.utils.isEmpty(data.selected) ? '' : 'inactive';

      // If petrified, display "All Damage" instead of all damage types separately
      if (trait === 'dr' && this.document.hasConditionEffect('petrification')) {
        data.selected = { custom1: game.i18n.localize('DND5E.DamageAll') };
        data.cssClass = '';
      }
    }

    return traits;
  }

  static applyDamageModifications(context: ActorSheetContextV1) {
    try {
      // Damage modifications
      const dm: DamageModificationData | undefined =
        context.actor.system.traits?.dm;
      if (dm) {
        const rollData = context.actor.getRollData({ deterministic: true });
        const mods = Object.entries(dm.amount)
          .map(([key, value]) => {
            const total = dnd5e.utils.simplifyBonus(value, rollData);
            if (!total) return null;

            const damageType =
              CONFIG.DND5E.damageTypes[
                key as keyof typeof CONFIG.DND5E.damageTypes
              ] ?? {};

            const mod: DamageModificationContextEntry = {
              label: `${damageType?.label ?? key} ${dnd5e.utils.formatNumber(
                total,
                { signDisplay: 'always' }
              )}`,
              consequence: total > 0 ? 'detriment' : 'benefit',
            };
            const icons: string[] = (mod.icons = []);
            if (
              dm.bypasses.size &&
              'isPhysical' in damageType &&
              damageType?.isPhysical
            )
              icons.push(...dm.bypasses);
            return mod;
          })
          .filter((f) => f);

        context.traits.traits.dm = mods;
      }
    } catch (e) {
      error(
        'An error occurred while preparing Damage Modification data',
        false,
        e
      );
      debug('Damage Modification error troubleshooting info', { context });
    }
  }

  /* -------------------------------------------- */

  /**
   * Prepare the data structure for items which appear on the actor sheet.
   * Each subclass overrides this method to implement type-specific logic.
   * @protected
   */
  _prepareItems() {}

  /* -------------------------------------------- */

  /**
   * Insert a spell into the spellbook object when rendering the character sheet.
   * @param {object} context    Sheet rendering context data being prepared for render.
   * @param {object[]} spells   Spells to be included in the spellbook.
   * @returns {object[]}        Spellbook sections in the proper order.
   * @protected
   */
  _prepareSpellbook(context, spells) {
    const owner = this.actor.isOwner;
    const levels = context.actor.system.spells;
    const spellbook = {};

    // Define section and label mappings
    const sections = Object.entries(CONFIG.DND5E.spellPreparationModes).reduce(
      (acc, [k, { order }]) => {
        if (Number.isNumeric(order)) acc[k] = Number(order);
        return acc;
      },
      {}
    );
    const useLabels = { '-30': '-', '-20': '-', '-10': '-', 0: '&infin;' };

    // Format a spellbook entry for a certain indexed level
    const registerSection = (
      sl,
      i,
      label,
      { prepMode = 'prepared', value, max, override, config } = {}
    ) => {
      const aeOverride = foundry.utils.hasProperty(
        this.actor.overrides,
        `system.spells.spell${i}.override`
      );
      spellbook[i] = {
        order: i,
        label: label,
        usesSlots: i > 0,
        canCreate: owner,
        canPrepare:
          (context.actor.type === 'character' && i >= 1) || config?.prepares,
        spells: [],
        uses: useLabels[i] || value || 0,
        slots: useLabels[i] || max || 0,
        override: override || 0,
        dataset: {
          type: 'spell',
          level: prepMode in sections ? 1 : i,
          preparationMode: prepMode,
        },
        prop: sl,
        editable: context.editable && !aeOverride,
      };
    };

    // Determine the maximum spell level which has a slot
    const maxLevel = Array.fromRange(
      Object.keys(CONFIG.DND5E.spellLevels).length - 1,
      1
    ).reduce((max, i) => {
      const level = levels[`spell${i}`];
      if (level && (level.max || level.override) && i > max) max = i;
      return max;
    }, 0);

    // Level-based spellcasters have cantrips and leveled slots
    if (maxLevel > 0) {
      registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      for (let lvl = 1; lvl <= maxLevel; lvl++) {
        const sl = `spell${lvl}`;
        registerSection(sl, lvl, CONFIG.DND5E.spellLevels[lvl], levels[sl]);
      }
    }

    // Create spellbook sections for all alternative spell preparation modes that have spell slots.
    for (const [k, v] of Object.entries(CONFIG.DND5E.spellPreparationModes)) {
      if (!(k in levels) || !v.upcast || !levels[k].max) continue;

      if (!spellbook['0'] && v.cantrips)
        registerSection('spell0', 0, CONFIG.DND5E.spellLevels[0]);
      const l = levels[k];
      const level = game.i18n.localize(`DND5E.SpellLevel${l.level}`);
      const label = `${v.label} — ${level}`;
      registerSection(k, sections[k], label, {
        prepMode: k,
        value: l.value,
        max: l.max,
        override: l.override,
        config: v,
      });
    }

    // Iterate over every spell item, adding spells to the spellbook by section
    spells.forEach((spell) => {
      const mode = spell.system.preparation.mode || 'prepared';
      let s = spell.system.level || 0;
      const sl = `spell${s}`;

      // Spells from items
      if (spell.getFlag('dnd5e', 'cachedFor')) {
        s = 'item';
        if (!spell.system.linkedActivity?.displayInSpellbook) return;
        if (!spellbook[s]) {
          registerSection(
            null,
            s,
            game.i18n.localize('DND5E.CAST.SECTIONS.Spellbook')
          );
          spellbook[s].order = 1000;
        }
      }

      // Specialized spellcasting modes (if they exist)
      else if (mode in sections) {
        s = sections[mode];
        if (!spellbook[s]) {
          const l = levels[mode] || {};
          const config = CONFIG.DND5E.spellPreparationModes[mode];
          registerSection(mode, s, config.label, {
            prepMode: mode,
            value: l.value,
            max: l.max,
            override: l.override,
            config: config,
          });
        }
      }

      // Sections for higher-level spells which the caster "should not" have, but spell items exist for
      else if (!spellbook[s]) {
        registerSection(sl, s, CONFIG.DND5E.spellLevels[s], {
          levels: levels[sl],
        });
      }

      // Add the spell to the relevant heading
      spellbook[s].spells.push(spell);
    });

    // Sort the spellbook by section level
    const sorted = Object.values(spellbook);
    sorted.sort((a, b) => a.order - b.order);
    return sorted;
  }

  /**
   * Get the font-awesome icon used to display a certain level of skill proficiency.
   * @param {number} level  A proficiency mode defined in `CONFIG.DND5E.proficiencyLevels`.
   * @returns {string}      HTML string for the chosen icon.
   * @private
   */
  _getProficiencyIcon(level) {
    const icons = {
      0: '<i class="far fa-circle"></i>',
      0.5: '<i class="fas fa-adjust"></i>',
      1: '<i class="fas fa-check"></i>',
      2: '<i class="fas fa-check-double"></i>',
    };
    return icons[level] || icons[0];
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  /** @inheritDoc */
  activateListeners(html) {
    // Property attributions
    this.form
      .querySelectorAll('[data-attribution], .attributable')
      .forEach(this._applyAttributionTooltips.bind(this));

    // Preparation Warnings
    html.find('.warnings').click(this._onWarningLink.bind(this));

    // Editable Only Listeners
    if (this.isEditable) {
      // Input focus and update
      const inputs = html.find('input');
      inputs.focus((ev) => ev.currentTarget.select());
      inputs
        .addBack()
        .find('[type="text"][data-dtype="Number"]')
        .change(this._onChangeInputDelta.bind(this));

      // Ability Proficiency
      html
        .find('.ability-proficiency')
        .click(this._onToggleAbilityProficiency.bind(this));

      // Toggle Skill Proficiency
      html
        .find('.skill-proficiency')
        .on('click contextmenu', (event) =>
          this._onCycleProficiency(event, 'skill')
        );

      // Toggle Tool Proficiency
      html
        .find('.tool-proficiency')
        .on('click contextmenu', (event) =>
          this._onCycleProficiency(event, 'tool')
        );

      // Trait Selector
      html.find('.trait-selector').click(this._onTraitSelector.bind(this));

      // Configure Special Flags
      html.find('.config-button').click(this._onConfigMenu.bind(this));

      // Changing Level
      html.find('.level-selector').change(this._onLevelChange.bind(this));

      // Owned Item management
      html
        .find('.slot-max-override')
        .click(this._onSpellSlotOverride.bind(this));
      html
        .find('.attunement-max-override')
        .click(this._onAttunementOverride.bind(this));

      this._disableOverriddenFields(html);
    }

    // Owner Only Listeners, for non-compendium actors.
    if (
      this.actor.isOwner &&
      !this.actor[game.release.generation < 13 ? 'compendium' : 'inCompendium']
    ) {
      // Ability Checks
      html.find('.ability-name').click(this._onRollAbilityTest.bind(this));

      // Roll Skill Checks
      html.find('.skill-name').click(this._onRollSkillCheck.bind(this));

      // Roll Tool Checks.
      html.find('.tool-name').on('click', this._onRollToolCheck.bind(this));
    }

    // Handle default listeners last so system listeners are triggered first
    super.activateListeners(html);
  }

  _disableOverriddenFields(html: any) {}

  /** @inheritDoc */
  _onDragStart(event) {
    const li = event.currentTarget;
    if (event.target.classList.contains('content-link')) return;

    if (li.dataset.effectId && li.dataset.parentId) {
      const effect = this.actor.items
        .get(li.dataset.parentId)
        ?.effects.get(li.dataset.effectId);
      if (effect)
        event.dataTransfer.setData(
          'text/plain',
          JSON.stringify(effect.toDragData())
        );
      return;
    }

    super._onDragStart(event);
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropActor(event, data) {
    const canPolymorph =
      game.user.isGM ||
      (this.actor.isOwner && game.settings.get('dnd5e', 'allowPolymorphing'));
    if (!canPolymorph || this._tabs[0].active === 'bastion') return false;

    // Get the target actor
    const cls = getDocumentClass('Actor');
    const sourceActor = await cls.fromDropData(data);
    if (!sourceActor) return;

    // Define a function to record polymorph settings for future use
    const rememberOptions = (html) => {
      const options = {};
      html.find('input').each((i, el) => {
        options[el.name] = el.checked;
      });
      const settings = foundry.utils.mergeObject(
        game.settings.get('dnd5e', 'polymorphSettings') ?? {},
        options
      );
      game.settings.set('dnd5e', 'polymorphSettings', settings);
      return settings;
    };

    // Create and render the Dialog
    return new Dialog(
      {
        title: game.i18n.localize('DND5E.PolymorphPromptTitle'),
        content: {
          options: game.settings.get('dnd5e', 'polymorphSettings'),
          settings: CONFIG.DND5E.polymorphSettings,
          effectSettings: CONFIG.DND5E.polymorphEffectSettings,
          isToken: this.actor.isToken,
        },
        default: 'accept',
        buttons: {
          accept: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize('DND5E.PolymorphAcceptSettings'),
            callback: (html) =>
              this.actor.transformInto(sourceActor, rememberOptions(html)),
          },
          wildshape: {
            icon: CONFIG.DND5E.transformationPresets.wildshape.icon,
            label: CONFIG.DND5E.transformationPresets.wildshape.label,
            callback: (html) =>
              this.actor.transformInto(
                sourceActor,
                foundry.utils.mergeObject(
                  CONFIG.DND5E.transformationPresets.wildshape.options,
                  { transformTokens: rememberOptions(html).transformTokens }
                )
              ),
          },
          polymorph: {
            icon: CONFIG.DND5E.transformationPresets.polymorph.icon,
            label: CONFIG.DND5E.transformationPresets.polymorph.label,
            callback: (html) =>
              this.actor.transformInto(
                sourceActor,
                foundry.utils.mergeObject(
                  CONFIG.DND5E.transformationPresets.polymorph.options,
                  { transformTokens: rememberOptions(html).transformTokens }
                )
              ),
          },
          self: {
            icon: CONFIG.DND5E.transformationPresets.polymorphSelf.icon,
            label: CONFIG.DND5E.transformationPresets.polymorphSelf.label,
            callback: (html) =>
              this.actor.transformInto(
                sourceActor,
                foundry.utils.mergeObject(
                  CONFIG.DND5E.transformationPresets.polymorphSelf.options,
                  { transformTokens: rememberOptions(html).transformTokens }
                )
              ),
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('Cancel'),
          },
        },
      },
      {
        classes: ['dialog', 'dnd5e', 'polymorph'],
        width: 900,
        template: 'systems/dnd5e/templates/apps/polymorph-prompt.hbs',
      }
    ).render(true);
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _onDropActiveEffect(event, data) {
    const effect = await ActiveEffect.implementation.fromDropData(data);
    if (effect?.target === this.actor) return false;
    return super._onDropActiveEffect(event, data);
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropItem(event, data) {
    const behavior = this._dropBehavior(event, data);
    if (!this.actor.isOwner || behavior === 'none') return false;
    const item = await Item.implementation.fromDropData(data);

    // Handle moving out of container & item sorting
    if (behavior === 'move' && this.actor.uuid === item.parent?.uuid) {
      if (item.system.container !== null)
        await item.update({ 'system.container': null });
      return this._onSortItem(event, item.toObject());
    }

    return this._onDropItemCreate(item, event, behavior);
  }

  /* -------------------------------------------- */

  /** @override */
  async _onDropFolder(event, data) {
    if (!this.actor.isOwner) return [];
    const folder = await Folder.implementation.fromDropData(data);
    if (folder.type !== 'Item') return [];
    const droppedItemData = await Promise.all(
      folder.contents.map(async (item) => {
        if (!(item instanceof Item)) item = await fromUuid(item.uuid);
        return item;
      })
    );
    return this._onDropItemCreate(droppedItemData, event);
  }

  /* -------------------------------------------- */

  /**
   * Handle the final creation of dropped Item data on the Actor.
   * @param {Item5e[]|Item5e} itemData     The item or items requested for creation.
   * @param {DragEvent} event              The concluding DragEvent which provided the drop data.
   * @param {DropEffectValue} behavior     The specific drop behavior.
   * @returns {Promise<Item5e[]>}
   * @protected
   */
  async _onDropItemCreate(itemData, event, behavior) {
    let items = itemData instanceof Array ? itemData : [itemData];
    const itemsWithoutAdvancement = items.filter(
      (i) => !i.system.advancement?.length
    );
    const multipleAdvancements =
      items.length - itemsWithoutAdvancement.length > 1;
    if (
      multipleAdvancements &&
      !game.settings.get('dnd5e', 'disableAdvancements')
    ) {
      ui.notifications.warn(
        game.i18n.format('DND5E.WarnCantAddMultipleAdvancements')
      );
      items = itemsWithoutAdvancement;
    }

    // Filter out items already in containers to avoid creating duplicates
    const containers = new Set(
      items.filter((i) => i.type === 'container').map((i) => i._id)
    );
    items = items.filter((i) => !containers.has(i.system.container));

    // Create the owned items & contents as normal
    const toCreate = await Item5e.createWithContents(items, {
      transformFirst: (item) => {
        if (item instanceof foundry.abstract.Document) item = item.toObject();
        return this._onDropSingleItem(item, event);
      },
    });
    const created = await Item5e.createDocuments(toCreate, {
      pack: this.actor.pack,
      parent: this.actor,
      keepId: true,
    });
    if (behavior === 'move')
      items.forEach((i) =>
        fromUuid(i.uuid).then((d) => d?.delete({ deleteContents: true }))
      );
    return created;
  }

  /* -------------------------------------------- */

  /**
   * Handles dropping of a single item onto this character sheet.
   * @param {object} itemData            The item data to create.
   * @param {DragEvent} event            The concluding DragEvent which provided the drop data.
   * @returns {Promise<object|boolean>}  The item data to create after processing, or false if the item should not be
   *                                     created or creation has been otherwise handled.
   * @protected
   */
  async _onDropSingleItem(itemData, event) {
    // Check to make sure items of this type are allowed on this actor
    if (this.constructor.unsupportedItemTypes.has(itemData.type)) {
      ui.notifications.warn(
        game.i18n.format('DND5E.ActorWarningInvalidItem', {
          itemType: game.i18n.localize(CONFIG.Item.typeLabels[itemData.type]),
          actorType: game.i18n.localize(
            CONFIG.Actor.typeLabels[this.actor.type]
          ),
        })
      );
      return false;
    }

    // Create a Consumable spell scroll on the Inventory tab
    if (
      itemData.type === 'spell' &&
      (this._tabs[0].active === 'inventory' || this.actor.type === 'vehicle')
    ) {
      const scroll = await Item5e.createScrollFromSpell(itemData);
      return scroll?.toObject?.() ?? false;
    }

    // Clean up data
    this._onDropResetData(itemData, event);

    // Stack identical consumables
    const stacked = this._onDropStackConsumables(itemData);
    if (stacked) return false;

    // Bypass normal creation flow for any items with advancement
    if (
      this.actor.system.metadata?.supportsAdvancement &&
      itemData.system.advancement?.length &&
      !game.settings.get('dnd5e', 'disableAdvancements')
    ) {
      // Ensure that this item isn't violating the singleton rule
      const dataModel = CONFIG.Item.dataModels[itemData.type];
      const singleton = dataModel?.metadata.singleton ?? false;
      if (singleton && this.actor.itemTypes[itemData.type].length) {
        ui.notifications.error(
          game.i18n.format('DND5E.ActorWarningSingleton', {
            itemType: game.i18n.localize(CONFIG.Item.typeLabels[itemData.type]),
            actorType: game.i18n.localize(
              CONFIG.Actor.typeLabels[this.actor.type]
            ),
          })
        );
        return false;
      }

      const manager = AdvancementManager.forNewItem(this.actor, itemData);
      if (manager.steps.length) {
        manager.render(true);
        return false;
      }
    }

    // Adjust the preparation mode of a leveled spell depending on the section on which it is dropped.
    if (itemData.type === 'spell') this._onDropSpell(itemData, event);

    return itemData;
  }

  /* -------------------------------------------- */

  /**
   * Reset certain pieces of data stored on items when they are dropped onto the actor.
   * @param {object} itemData    The item data requested for creation. **Will be mutated.**
   * @param {DragEvent} event    The concluding DragEvent which provided the drop data.
   */
  _onDropResetData(itemData, event) {
    if (!itemData.system) return;
    ['attuned', 'equipped', 'prepared'].forEach(
      (k) => delete itemData.system[k]
    );
  }

  /* -------------------------------------------- */

  /**
   * Adjust the preparation mode of a dropped spell depending on the drop location on the sheet.
   * @param {object} itemData    The item data requested for creation. **Will be mutated.**
   * @param {DragEvent} event    The concluding DragEvent which provided the drop data.
   */
  _onDropSpell(itemData, event) {
    if (!['npc', 'character'].includes(this.document.type)) return;

    // Determine the section it is dropped on, if any.
    let header = event.target.closest('.items-header'); // Dropped directly on the header.
    if (!header) {
      const list = event.target.closest('.item-list'); // Dropped inside an existing list.
      header = list?.previousElementSibling;
    }
    const { level, preparationMode } =
      header?.closest('[data-level]')?.dataset ?? {};

    // Determine the actor's spell slot progressions, if any.
    const spellcastKeys = Object.keys(CONFIG.DND5E.spellcastingTypes);
    const progs = Object.values(this.document.classes).reduce((acc, cls) => {
      const type = cls.spellcasting?.type;
      if (spellcastKeys.includes(type)) acc.add(type);
      return acc;
    }, new Set());

    const prep = itemData.system.preparation;

    // Case 1: Drop a cantrip.
    if (itemData.system.level === 0) {
      const modes = CONFIG.DND5E.spellPreparationModes;
      if (modes[preparationMode]?.cantrips) {
        prep.mode = 'prepared';
      } else if (!preparationMode) {
        const isCaster =
          this.document.system.attributes.spell?.level || progs.size;
        prep.mode = isCaster ? 'prepared' : 'innate';
      } else {
        prep.mode = preparationMode;
      }
      if (modes[prep.mode]?.prepares) prep.prepared = true;
    }

    // Case 2: Drop a leveled spell in a section without a mode.
    else if (level === '0' || !preparationMode) {
      if (this.document.type === 'npc') {
        prep.mode = this.document.system.attributes.spell.level
          ? 'prepared'
          : 'innate';
      } else {
        const m = progs.has('leveled') ? 'prepared' : progs.first() ?? 'innate';
        prep.mode = progs.has(prep.mode) ? prep.mode : m;
      }
    }

    // Case 3: Drop a leveled spell in a specific section.
    else prep.mode = preparationMode;
  }

  /**
   * Initialize attribution tooltips on an element.
   * @param {HTMLElement} element  The tooltipped element.
   * @protected
   */
  _applyAttributionTooltips(element) {
    if ('tooltip' in element.dataset) return;
    element.dataset.tooltip = `
      <section class="loading" data-uuid="${this.actor.uuid}"><i class="fas fa-spinner fa-spin-pulse"></i></section>
    `;
    element.dataset.tooltipClass = 'property-attribution';
  }

  /**
   * Handle toggling Ability score proficiency level.
   * @param {Event} event              The originating click event.
   * @returns {Promise<Actor5e>|void}  Updated actor instance.
   * @private
   */
  _onToggleAbilityProficiency(event) {
    if (event.currentTarget.classList.contains('disabled')) return;
    event.preventDefault();
    const field = event.currentTarget.previousElementSibling;
    return this.actor.update({ [field.name]: 1 - parseInt(field.value) });
  }

  /* -------------------------------------------- */

  /**
   * Handle links within preparation warnings.
   * @param {Event} event  The click event on the warning.
   * @protected
   */
  async _onWarningLink(event) {
    event.preventDefault();
    const a = event.target;
    if (!a || !a.dataset.target) return;
    switch (a.dataset.target) {
      case 'armor':
        new ArmorClassConfig({ document: this.actor }).render({ force: true });
        return;
      default:
        const item = await fromUuid(a.dataset.target);
        item?.sheet.render(true);
    }
  }

  /* -------------------------------------------- */

  /** @override */
  _getHeaderButtons() {
    let buttons = super._getHeaderButtons();
    if (this.actor.isPolymorphed) {
      buttons.unshift({
        label: 'DND5E.PolymorphRestoreTransformation',
        class: 'restore-transformation',
        icon: 'fas fa-backward',
        onclick: () => this.actor.revertOriginalForm(),
      });
    }
    return buttons;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async _updateObject(event, formData) {
    // Unset any flags which are "false"
    for (const [k, v] of Object.entries(formData)) {
      if (k.startsWith('flags.dnd5e.') && !v) {
        delete formData[k];
        if (foundry.utils.hasProperty(this.document._source, k))
          formData[k.replace(/\.([\w\d]+)$/, '.-=$1')] = null;
      }
    }

    // Parent ActorSheet update steps
    return super._updateObject(event, formData);
  }
}
