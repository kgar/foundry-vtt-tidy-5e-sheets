# Spellbook To Do's

## Tab impl

- [ ] Settings
  - [x] hideSpellSlotMarker
  - [x] enableSpellLevelButtons
  - [x] spellClassFilterSelect
    - [x] "name": "Enable Multiclass Spellbook filter", "hint": "If you don't need this for your character, disabling this option will allow you to reclaim the space and declutter your sheet."
  - [ ] spellClassFilterIconReplace
  - [x] spellClassFilterAdditionalClasses
    - [x] A list of ids and friendly text which represent additional classes to include
  - [x] hbEnableUpcastFreeSpell
    - [x] Revert spell level buttons to use dropdown invisibly
    - [x] plug in upcast checkbox feature
  - [x] hbSetFeaturesForUpcastFreeSpell?
  - [x] ...?
- [x] Make a component
- [x] Implement in list mode
  - [x] HTML
  - [x] Spell slot markers
    - [x] HTML
    - [x] Styles
    - [x] Functionality
    - [x] Refactor: extract to component
    - [x] Achieve the hover effect which visualizes the delta change to occur.
  - [x] Styles
    - [x] etc.
    - [x] spell headers
  - [x] Functionality
- [x] Implement search.
- [x] Implement action economy filters
- [x] Grid Toggle with stub view (wasp wants to make this)
  - ~~Hold off on this one: Implement ItemGrid family of components and support grid mode.~~
- [x] Spellbook Footer
  - [x] the rest
  - [x] attack mod
  - [x] big calculation tooltip
- [x] Styles
- [x] Put spell-related item components into their own spell-related directory
- [x] ...?

## Side quests

- [x] Make shared components for filter container and individual filters; individual filters can be made generic by filter name ("action", "bonus action", etc.) and set ("feature", "effect", etc.)
- [x] Make a component for the item controls container (the buttons on the far right) that can be generically used. It could even take `allowEdit` and toggle its own width accordingly.
- [x] Make component for search so we can share
- [x] Make the scrollable item table container a shared, generic component

## Spell Attack Mod

```js
async function spellAttackMod(app, html, data) {
  let actor = app.actor;

  const rollData = actor.getRollData();
  let formula = Roll.replaceFormulaData(
    actor.system.bonuses.rsak.attack,
    rollData,
    { missing: 0, warn: false }
  );
  if (formula === '') {
    formula = '0';
  }

  let spellBonus = 0;

  try {
    // Roll parser no longer accepts some expressions it used to so we will try and avoid using it
    spellBonus = Roll.safeEval(formula);
  } catch (err) {
    // safeEval failed try a roll
    try {
      spellBonus = new Roll(formula).evaluate({ async: false }).total;
    } catch (err) {
      error('spell bonus calculation failed : ' + err?.message, true);
    }
  }

  let prof = actor.system.attributes.prof;
  let spellAbility = html
    .find('.spellcasting-attribute select option:selected')
    .val();
  let abilityMod =
    spellAbility != '' ? actor.system.abilities[spellAbility].mod : 0;
  let spellAttackMod = prof + abilityMod;
  let spellAttackModWihBonus = prof + abilityMod + spellBonus;
  let spellAttackText =
    spellAttackMod > 0 ? '+' + spellAttackMod : spellAttackMod;
  let spellAttackTextWithBonus =
    spellAttackModWihBonus > 0
      ? '+' + spellAttackModWihBonus
      : spellAttackModWihBonus;
  let spellAttackTextTooltip = `${prof} (prof.)+${abilityMod} (${spellAbility})`;
  let spellAttackTextTooltipWithBonus = `with bonus ${spellAttackTextWithBonus} = ${prof} (prof.)+${abilityMod} (${spellAbility})+${formula} (bonus 'actor.system.bonuses.rsak.attack')`;
  spellAttackTextTooltipWithBonus = spellAttackTextTooltipWithBonus.replace(
    '++',
    '+'
  );
  debug(
    `tidy5e-sheet | spellAttackMod | Prof: ${prof ?? ''} / Spell Ability: ${
      spellAbility ?? ''
    } / ability Mod: ${abilityMod ?? ''} / Spell Attack Mod: ${
      spellAttackMod ?? ''
    } / Spell Bonus : ${spellBonus ?? ''}`
  );

  html.find('.spell-mod .spell-attack-mod').html(spellAttackTextWithBonus);
  html
    .find('.spell-mod .spell-attack-mod')
    .attr(
      'data-tooltip',
      `${spellAttackTextTooltip} [${spellAttackTextTooltipWithBonus}] `
    );
}
```

## How Filter Toggling Works

```js
_onToggleFilter(event) {
  event.preventDefault();
  const li = event.currentTarget;
  const set = this._filters[li.parentElement.dataset.filter];
  const filter = li.dataset.filter;
  if ( set.has(filter) ) set.delete(filter);
  else set.add(filter);
  return this.render();
}
```

```js
/**
 * Track the set of item filters which are applied
 * @type {Object<string, Set>}
 * @protected
 */
_filters = {
  inventory: new Set(),
  spellbook: new Set(),
  features: new Set(),
  effects: new Set(),
};
```

## Spell Preparation

```js
  /**
   * Handle toggling the state of an Owned Item within the Actor.
   * @param {Event} event        The triggering click event.
   * @returns {Promise<Item5e>}  Item with the updates applied.
   * @private
   */
  _onToggleItem(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest(".item").dataset.itemId;
    const item = this.actor.items.get(itemId);
    const attr = item.type === "spell" ? "system.preparation.prepared" : "system.equipped";
    return item.update({[attr]: !foundry.utils.getProperty(item, attr)});
  }
```

## Spell slot override

```js
  async _onSpellSlotOverride(event) {
    const span = event.currentTarget.parentElement;
    const level = span.dataset.level;
    const override = this.actor.system.spells[level].override || span.dataset.slots;
    const input = document.createElement("INPUT");
    input.type = "text";
    input.name = `system.spells.${level}.override`;
    input.value = override;
    input.placeholder = span.dataset.slots;
    input.dataset.dtype = "Number";

    // Replace the HTML
    const parent = span.parentElement;
    parent.removeChild(span);
    parent.appendChild(input);
  }
```

## Spell slot markers

### Original Styles

```scss
.spellSlotMarker {
  display: flex;
  // flex-direction: row-reverse;
  gap: 2px;
  align-items: center;
  margin-top: -2px;
  .dot {
    position: relative;
    display: block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    cursor: pointer;
    background-color: var(--t5e-primary-accent);
    border: 1px solid var(--t5e-primary-font);
    &:hover,
    &.change {
      background-color: var(--t5e-warning-accent);
    }

    &.empty {
      background-color: transparent;

      &:hover,
      &.change {
        background-color: var(--t5e-prepared);
      }
    }
  }
}
```

## Spell Level Buttons Impl

```js
// called from hook
// Hooks.on('renderAbilityUseDialog', (app: any, html: any, options: any) => { ... }
export const tidy5eSpellLevelButtons = async function (app, html, options) {
  if (
    game.settings.get(CONSTANTS.MODULE_ID, 'enableSpellLevelButtons') &&
    // The module already do the job so for avoid redundance...
    !game.modules.get('spell-level-buttons-for-dnd5e')?.active
  ) {
    if (app?.item?.type != 'spell') {
      return; // Nevermind if this isn't a spell
    }
    if (html.find('[name="consumeSpellSlot"]').length == 0) {
      return;
    }
    const optionsApplication = app;

    if (
      $('.dnd5e.dialog #ability-use-form select[name="consumeSpellLevel"]')
        .length > 0
    ) {
      // If the dialog box has a option to select a spell level

      // Resize the window to fit the contents
      let originalWindowHeight = parseInt(
        $(optionsApplication._element[0]).css('height')
      );
      let heightOffset = 42;

      $(optionsApplication._element[0]).height(
        originalWindowHeight + heightOffset
      );

      // Find the label that says "Cast at level", and select it's parent parent (There's no specific class or ID for this wrapper)
      let levelSelectWrapper = $(optionsApplication._element[0])
        .find(
          `.form-group label:contains("${game.i18n.localize(
            `DND5E.SpellCastUpcast`
          )}")`
        )
        .parent();
      let selectedLevel = levelSelectWrapper.find('select').val();

      let appId = optionsApplication.appId;

      // Hide the default level select menu
      levelSelectWrapper.css('display', 'none');

      // Append a container for the buttons
      levelSelectWrapper.after(`
            <div class="form-group spell-lvl-btn">
                <label>${game.i18n.localize(`DND5E.SpellCastUpcast`)}</label>
                <div class="form-fields"></div>
            </div>
        `);

      // Append a button for each spell level that the user can cast
      $(optionsApplication._element[0])
        .find(`select[name="consumeSpellLevel"] option`)
        .each(function () {
          let availableTextSlotsFounded = $(this)
            .text()
            .match(/\(\d+\s\w+\)/);
          if (!availableTextSlotsFounded) {
            availableTextSlotsFounded = $(this).text().match(/\d+/g);
            const lastMatch =
              availableTextSlotsFounded[availableTextSlotsFounded.length - 1];
            if (lastMatch) {
              availableTextSlotsFounded = lastMatch;
            }
          }

          if (!availableTextSlotsFounded) {
            warn(
              `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the spell slots on text '${$(
                this
              ).text()}' with ${/\(\d+\s\w+\)/}`
            );
          }
          let availableSlotsFounded = availableTextSlotsFounded
            ? availableTextSlotsFounded[0].match(/\d+/)
            : undefined;
          if (!availableSlotsFounded) {
            warn(
              `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the spell slots on text '${$(
                this
              ).text()}' with ${/\d+/}`
            );
          }
          let availableSlots = availableSlotsFounded
            ? availableSlotsFounded[0]
            : 0;
          let availableSlotsBadge = '';
          let value = $(this).val();

          let i;

          if (value == 'pact') {
            // i = "p" + $(this).text().match(/\d/)[0]; // Get the pact slot level
            let availablePactSlotsFounded = $(this).text().match(/\d/);
            if (!availablePactSlotsFounded) {
              warn(
                `tidy5e-spell-level-buttons | tidy5eSpellLevelButtons | Cannot find the pact slots on text '${$(
                  this
                ).text()}' with ${/\d/}`
              );
            }
            if (availablePactSlotsFounded) {
              i = 'p' + availablePactSlotsFounded[0]; // Get the pact slot level
            } else {
              i = 'p' + 0;
            }
          } else {
            i = value;
          }

          if (availableSlots > 0) {
            availableSlotsBadge = `<span class="available-slots">${availableSlots}</span>`;
          }

          $(optionsApplication._element[0]).find(
            '.spell-lvl-btn .form-fields'
          ).append(`
                <label title="${$(
                  this
                ).text()}" class="spell-lvl-btn__label" for="${appId}lvl-btn-${i}">
                    <input type="radio" id="${appId}lvl-btn-${i}" name="lvl-btn" value="${value}">
                    <div class="spell-lvl-btn__btn">${i}</div>
                    ${availableSlotsBadge}
                </label>
            `);
        });

      // Click on the button corresponding to the default value on the cast level dropdown menu
      $(optionsApplication._element[0])
        .find(`#${appId}lvl-btn-${selectedLevel}`)
        .trigger('click');

      // Change the dropdown menu value when user clicks on a button
      $(optionsApplication._element[0])
        .find('.spell-lvl-btn__label')
        .on('click', function () {
          levelSelectWrapper.find('select').val($(this).find('input').val());
        });
    }
  }
};
```

```scss
form .form-group.spell-lvl-btn {
  justify-content: center;
  flex-direction: column;
  margin-bottom: 15px;

  label {
    text-align: center;
  }

  .form-fields {
    margin: auto;

    .spell-lvl-btn__label {
      padding: 0;
      margin-right: 10px;
      position: relative;

      &:last-child {
        margin-right: 0;
      }

      .spell-lvl-btn__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        background: rgba(0, 0, 0, 0.05);
        border: 2px groove #c9c7b8;
        border-radius: 3px;
        font-size: 16px;
        font-weight: 900;
        user-select: none;

        &:hover,
        &:focus {
          cursor: pointer;
          outline: none;
          box-shadow: 0 0 5px red;
        }
      }

      input {
        display: none;

        &:checked + .spell-lvl-btn__btn {
          box-shadow: 0 0 5px red;
        }
      }

      .available-slots {
        position: absolute;
        top: -4px;
        right: -4px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 15px;
        height: 15px;
        font-size: 11px;
        line-height: 1;
        border-radius: 50%;
        background: #ff6400;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
}
```

## Spell Class Filter Select impl

```js
const classesConfiguration = {
  artificer: 'TIDY5E.ClassArtificer',
  barbarian: 'TIDY5E.ClassBarbarian',
  bard: 'TIDY5E.ClassBard',
  cleric: 'TIDY5E.ClassCleric',
  druid: 'TIDY5E.ClassDruid',
  fighter: 'TIDY5E.ClassFighter',
  monk: 'TIDY5E.ClassMonk',
  paladin: 'TIDY5E.ClassPaladin',
  ranger: 'TIDY5E.ClassRanger',
  rogue: 'TIDY5E.ClassRogue',
  sorcerer: 'TIDY5E.ClassSorcerer',
  warlock: 'TIDY5E.ClassWarlock',
  wizard: 'TIDY5E.ClassWizard',
  custom: 'TIDY5E.ClassCustom',
};

const user_setting_filterSelect = game.settings.get(
  CONSTANTS.MODULE_ID,
  'spellClassFilterSelect'
);

const spellbook = html.find('.tab.spellbook');
const filterList = spellbook.find('ul.filter-list');
const firstItem = filterList.children('li.filter-item:first');
// const itemData = actor.items
const actorItems = actor.items;

// Inject a simple dropdown menu.
if (user_setting_filterSelect) {
  classesConfigurationTmp = classesConfiguration;
  const user_setting_addClasses = game.settings.get(
    CONSTANTS.MODULE_ID,
    'spellClassFilterAdditionalClasses'
  );
  if (user_setting_addClasses && user_setting_addClasses.includes('|')) {
    let classes = [];
    if (user_setting_addClasses.includes(',')) {
      classes = user_setting_addClasses.split(',');
    } else {
      classes = [user_setting_addClasses];
    }
    for (let clazz of classes) {
      const c = clazz.split('|');
      const id = c[0];
      const name = c[1];
      if (id && name) {
        classesConfigurationTmp[id] = name;
      }
    }
  }
  const actorClassFilter = await renderTemplate(
    'modules/tidy5e-sheet/templates/actors/parts/tidy5e-spellbook-class-filter.html',
    {
      SCF: classesConfigurationTmp,
      actor,
      flags: flags,
      scFlags: actor.flags[CONSTANTS.MODULE_ID],
    }
  );
  firstItem.before(actorClassFilter);
}
```

```hbs
<select name='flags.tidy5e-sheet.classFilter'>
  {{selectOptions
    SCF
    selected=scFlags.classFilter
    blank='TIDY5E.Spellbook'
    localize=true
  }}
</select>
```

## Homebrew Enable Upcast Free Spell

```js
function getFeatureItemsFromActor(actor) {
  return actor.items
    .filter((item) => {
      if (['feat'].includes(item.type)) {
        return true;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
}

function getFeatureNamesFromActor(actor) {
  const features = getFeatureItemsFromActor(actor);
  const names = [];
  for (const feature of features) {
    names.push(feature.name.toLowerCase());
  }
  return names;
}

export const tidy5eHBEnableUpcastFreeSpell = async function (
  app,
  html,
  options
) {
  if (game.settings.get(CONSTANTS.MODULE_ID, 'hbEnableUpcastFreeSpell')) {
    if (app?.item?.type != 'spell') {
      debug(`tidy5eHBEnableUpcastFreeSpell | Nevermind if this isn't a spell`);
      return; // Nevermind if this isn't a spell
    }
    if (html.find('[name="consumeSpellSlot"]').length == 0) {
      debug(`tidy5eHBEnableUpcastFreeSpell | Nevermind if this is a cantrip`);
      return; // Nevermind if this is a cantrip
    }

    let tooltip = game.i18n.localize('TIDY5E.LevelBumpTooltip');

    if (
      game.settings.get(
        CONSTANTS.MODULE_ID,
        'hbSetFeaturesForUpcastFreeSpell'
      ) &&
      app.item?.actor
    ) {
      debug(
        `tidy5eHBEnableUpcastFreeSpell | hbSetFeaturesForUpcastFreeSpell check`
      );
      const namesFeaturesToCheck =
        game.settings
          .get(CONSTANTS.MODULE_ID, 'hbSetFeaturesForUpcastFreeSpell')
          .split('|') ?? [];
      const namesFeatures = getFeatureNamesFromActor(app.item?.actor) ?? [];
      const check = namesFeaturesToCheck.some((v) =>
        namesFeatures.includes(v.toLowerCase())
      );
      if (!check) {
        debug(
          `tidy5eHBEnableUpcastFreeSpell | hbSetFeaturesForUpcastFreeSpell check is failed`
        );
        return;
      }
      tooltip =
        tooltip +
        ` Ty to one of these features '${namesFeaturesToCheck.join(',')}'`;
    }
    // Add a new checkbox and insert it at the end of the list
    // let new_checkbox = $(`
    //   <div class="form-group">
    //     <label class="checkbox"><input type="checkbox" name="freeUpcast" />${game.i18n.localize("TIDY5E.LevelBump")}</label>
    //   </div>`);

    let new_checkbox = $(`
      <div class="form-group spell-lvl-btn" data-tooltip="${tooltip}">
        <label class="checkbox spell-lvl-btn__label"><input type="checkbox" name="freeUpcast" />${game.i18n.localize(
          'TIDY5E.LevelBump'
        )}</label>
      </div>`);
    new_checkbox.insertAfter(html.find('.form-group').last());
    // Bind a change handler to the new checkbox to increment/decrement the options in the dropdown
    // This is so that dnd5e will scale the spell up under the hood as-if it's upcast
    new_checkbox.change((ev) => {
      if (ev.target.checked) {
        Object.values(html.find('[name="consumeSpellLevel"] option')).map(
          (o) => {
            // Strange check
            if (o.value) {
              if (o.value === 'pact') {
                o.value = String(app.item.actor.system.spells.pact.level + 1);
              } else {
                o.value = String(parseInt(o.value) + 1);
              }
            }
          }
        );
      } else {
        Object.values(html.find('[name="consumeSpellLevel"] option')).map(
          (o) => {
            // Strange check
            if (o.value) {
              if (o.text?.includes('Pact')) {
                o.value = 'pact';
              } else {
                o.value = String(parseInt(o.value) - 1);
              }
            }
          }
        );
      }
    });
    app.setPosition({ height: 'auto' }); // Reset the height of the window to match the new content
  }
};
```

## spellClassFilterIconReplace impl

This feature requires that you tag spells with the class identifier. Once you've done this, the class image can be set up to override the regularly configured image.

```js

const user_setting_iconReplace = game.settings.get(
  CONSTANTS.MODULE_ID,
  'spellClassFilterIconReplace'
);

// collect some data to use later
const actor = app.object;
const type = actor.type;
const flags = actor.flags;
const actorSCFlags = flags[CONSTANTS.MODULE_ID];

if (type == 'character') {
  const spellbook = html.find('.tab.spellbook');
  const filterList = spellbook.find('ul.filter-list');
  const firstItem = filterList.children('li.filter-item:first');
  // const itemData = actor.items
  const actorItems = actor.items;

  // Get a list of classes for the actor and store their img.
  let classes = {};
  for (let item of actorItems) {
    if (item.type == 'class') {
      let className = item.name.toLowerCase();
      let classImg = item.img;
      classes[className] = classImg;
    }
  }
  // spellClassFilter.log(true, classes)
  // Loop through some elements and get thier data
  const spellList = spellbook.find('.inventory-list');
  const items = spellList.find('.item');
  items.each(function () {
    let itemID = $(this).data('item-id');
    let item = actorItems.get(itemID);
    let itemFlags = item.flags;
    let itemSCFlags = itemFlags[CONSTANTS.MODULE_ID]; //Should return undefined if doesn't exist.

    if (user_setting_iconReplace) {
      // Replace spell icon image
      if (itemSCFlags) {
        if (classes.hasOwnProperty(itemSCFlags.parentClass)) {
          // spellClassFilter.log(false, $(this))
          // $(this).css('background-image', 'url('+classes[itemSCFlags.parentClass]+')')
          let imgdiv = $(this).find('.item-image');
          imgdiv.css(
            'background-image',
            `url(${classes[itemSCFlags.parentClass]})`
          );
        }
      }
    }
  });
}
```
