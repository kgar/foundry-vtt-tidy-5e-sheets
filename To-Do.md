## To Do

- [x] Add card
- [x] Brainstorm useful content
- [x] Apply content to card
- [x] Apply card to 
  - [x] Actor
  - [x] NPC
  - [x] Character
  - [x] Item
  - [x] ~~Container?~~
- [x] Style content
- [x] Test
- [x] Add setting to toggle
- [x] Configure to respect setting
- [x] Item Cards for All Layouts should apply to any actor; enforce on 
- [x] Remove NPC/Vehicle Card option
- [x] Refactor: Include info card outside of the main sheet component as an additional component, ambiently included by the sheet class.


## Extras

- [x] Import Button is missing from item sheets in compendia. This must be an App V2 issue. Put it in the extended menu as MVP
- [x] Stretch: Can you put the import button to the right or left of the menu instead? (I'm sure I can)
- [x] Refactor: Survey how this import button is currently included and then make it so it's a document-sheet-level concern.
- [x] Research: What additional dynamic controls are missing for document sheets?
- [ ] Drag-and-drop from compendia should be supported. This is a common thing when enchanting items a la the DMG module.
- [ ] Bonus: Effect Summary? How difficult?

## Import button scratch

### App V1

```js
    // Compendium Import
    if ( (this.document.constructor.name !== "Folder") && !this.document.isEmbedded &&
          this.document.compendium && this.document.constructor.canUserCreate(game.user) ) {
      buttons.unshift({
        label: "Import",
        class: "import",
        icon: "fas fa-download",
        onclick: async () => {
          await this.close();
          return this.document.collection.importFromCompendium(this.document.compendium, this.document.id);
        }
      });
    }
```

### App V2 Header Buttons

```js
  /** @inheritDoc */
  async _renderFrame(options) {
    const frame = await super._renderFrame(options);

    // Add form options
    if ( this.options.tag === "form" ) frame.autocomplete = "off";

    // Add document ID copy
    const copyLabel = game.i18n.localize("SHEETS.CopyUuid");
    const copyId = `<button type="button" class="header-control fa-solid fa-passport" data-action="copyUuid"
                            data-tooltip="${copyLabel}" aria-label="${copyLabel}"></button>`;
    this.window.close.insertAdjacentHTML("beforebegin", copyId);

    // Add sheet configuration button
    if ( this.options.sheetConfig && this.isEditable && !this.document.getFlag("core", "sheetLock") ) {
      const label = game.i18n.localize("SHEETS.ConfigureSheet");
      const sheetConfig = `<button type="button" class="header-control fa-solid fa-cog" data-action="configureSheet"
                                   data-tooltip="${label}" aria-label="${label}"></button>`;
      this.window.close.insertAdjacentHTML("beforebegin", sheetConfig);
    }
    return frame;
  }
```

## Notes

effect fields and props

Effect Name: `.name`
Source: `.parent?.name` ?? what...

Duration: `.duration.seconds`
Enchantment: `type === "enchantment"`
Enchantment Source: `system?.parent?.name`

Key: `changes[].key`
Mode: `changes[].mode` - `localize(CONST.ACTIVE_EFFECT_MODES[mode])`
Value:  `changes[].value`
Priority: `changes[].priority`

Conditions: `Array.from(statuses)[].name` - `localize(CONFIG.statusEffects[name])` 

Suspended pill: `disabled`
Apply Effect to Actor pill: `transfer`
Supressed pill: `isSuppressed`


Shelved:
Section Title: Temporary, Passive, Inactive, Unavailable