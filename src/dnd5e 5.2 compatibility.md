# 5.2.x Compatibility Punch List

## Actionable items from PRs, Merges, Commits, etc.

- [x] Hide/suppress riders for disabled enchantments <https://github.com/foundryvtt/dnd5e/pull/6176/files>
  - Actor base: when assigning item categories, skip items where `item.dependentOrigin?.active === false`
  - Effects: exclude effects where `(e.dependentOrigin?.active === false) || ((e.parent.system?.identified === false) && !game.user.isGM)`
  - Items: include activities where `activity.canConfigure` is true; it replaces `CONFIG.DND5E.activityTypes[a.type]?.configurable !== false`
- [x] Add visibility options to activities <https://github.com/foundryvtt/dnd5e/pull/5892/files>
  - [x] `src\runtime\item\default-item-filters.ts` should refer only to visible activities
- [x] Disabled facilities in favorites are still usable <https://github.com/foundryvtt/dnd5e/issues/6170>
  - verify whether we've covered this already
- [x] Fix negative to hit values & dice-attack bonuses <https://github.com/foundryvtt/dnd5e/commit/0df423367f0a5ec9dd7cb39ef9a79b248b7341ae>
  - Base Actor: changed `toHit` for `labels.modifier`
- [ ] Enchant thats modify a weapon's type and base item dont display properly #6228 <https://github.com/foundryvtt/dnd5e/commit/f3f1716de3f02ba4a810649592d4ef2743215fb6>
  - For Tidy, it would likely affect `_getItemBaseTypes`
  - To Do: Review item-sheet `_getBaseItemOptions` and determine what things Tidy needs to do to stay in line with the logic
- [ ] BUG: Monk unarmored movement dont increase after 6th level #3505 <https://github.com/foundryvtt/dnd5e/pull/6274/files#diff-5ab7cd05ad5f0b1b20878ec2638ebb732cb4466abc03963a02fc1c1aba759dc9> / <https://github.com/foundryvtt/dnd5e/issues/3505>
  - CONFIG.DND5E changes 
  - test Movement rollData in sheets
- [ ] #4728 Aggregate damage preview on sheet & remove flavor #6279 <https://github.com/foundryvtt/dnd5e/pull/6279>
  - see what Tidy needs to do with formula.hbs

---

- [ ] #5237, #5293 Improve currency in starting equipment labels #6169 <https://github.com/foundryvtt/dnd5e/pull/6169/files#diff-35e9a18b20e4b17cc3b2e4e27f7f899707748c5ecbe8ed673dbdbac027c84c31>
  - check starting equipment
  - it might work out-of-the-box
- [ ] Add Trade Good loot type #6355 <https://github.com/foundryvtt/dnd5e/pull/6355/files>
  - check Loot types
- [ ] #6019 Add "Webs" to difficult terrain types, add to actors #6058 <https://github.com/foundryvtt/dnd5e/pull/6058/files>
  - CONFIG.DND5E changes
- [ ] Group Weight in the carriage cargo #6171 <https://github.com/foundryvtt/dnd5e/issues/6171>
  - Review Primary Vehicle and Inventory view toggle and task out vehicle sheet work
- [ ] Prevent Cast Activities from being added to spells <https://github.com/foundryvtt/dnd5e/commit/8be04a59e1d815122a79f5aa5a3124b509d27a29>
  - Do likewise
- [ ] Honoring Damage Threshold / Damage Threshold Added to Actors <https://github.com/foundryvtt/dnd5e/pull/6209/files#diff-753ee83a2ebd7a18eea5612c5e96c010e8a12005fb0fb72c4da510385888de7a> 
  - Determine if any action needed for any actor Damage Thresholds- [ ] Primary Vehicle
    - <https://github.com/foundryvtt/dnd5e/pull/6316/files#diff-5cd0a46c8dcd0e0b13b66c96d7a7ace4d781ed671e1b365d8a0a82f2f13b0415>
      - Actor base
        - inventorySource getter on base actor and its usage throughout base actor handling (especially drag/drop)
        - group sheet override of inventorySource
        - isOwner checks against item itself rather than the actor when preparing items instead of `this.actor`
        - default drop behavior changes
        - new _onSortItem logic
      - Character
        - Looks to item parent rather than `this.actor` when getting advancement origin
      - Group
        - Overrides inventorySource with specific logic for dealing with primary vehicles
        - Prepares in-built travel pace for context now
        - member encumbrance context prep needs to account for vehicle `actor.system.getEncumbrance()` being async, and it needs to use the primary vehicle if set
        - Currency updates need special handling to update Vehicle currency instead of the group
        - Currency context prep / UI account for primary vehicle
        - Context menu options  "DND5E.Group.Action.SetPrimaryVehicle" / "DND5E.Group.Action.UnsetPrimaryVehicle"
          - Note conditions and callback
        - Group actor now has `getTravelPace()`
        - dedicated travel paces context data
        - Overall Slowed movement UI
        - Per-member Slowed moveiment UI
        - Primary vehicle has special UI to it
        - Apparently, group member Max HP is optional, probably due to vehicles not necessarily needing an HP value?
      - "Inventory UI" -> document getter now accounts for the app's inventorySource. We could do similarly with our inventory component 👍
- [ ] Allow Tools to have the "Focus" property #6255 
  - verify good to go

---

- [ ] #6295 Add separate travel speeds to vehicles & party #6297 <https://github.com/foundryvtt/dnd5e/pull/6297> / <https://github.com/foundryvtt/dnd5e/pull/6297/files>
  - Group: Switches from `movement.pace` to `travel.pace`
  - Vehicle: Adds context booleans for `showTravelPace`, `showTravelSpeed`, `showCombatSpeed`
    - Combat speed is regular movement speed, whereas travel speed is mph/kph
  - Review Movement/Senses config
  - TravelField (SchemaField) added
    - Group 
      - replaces MovementField with TravelField as `attributes.travel`; includes a migration
      - Changes localization keys for land / water / air travel - `DND5E.Travel.Type.Land`, `DND5E.Travel.Type.Water`, `DND5E.Travel.Type.Air`
    - Vehicle
      - adds TravelField as `attributes.travel` and `attributes.quality.value`
      - sidebar now shows travel speed, if `showTravelSpeed` context boolean is true
      - sidebar now shows combat speed, if `showCombatSpeed` context boolean is true
    - MovementField deprecated
    - CONFIG.DND5E changes
      - Added tavelTypes
      - Canged travel
      - Changed movementTypes
      - Added travelUnits
    - New Util: formatTravelSpeed
    - New Util: convertTravelSpeed
- [ ] #6304 Add movement bonus that applies only to existing speeds #6306 / <https://github.com/foundryvtt/dnd5e/pull/6306/files>
  - Verify it works out-of-the-box
- [ ] Group sheet ownership <https://github.com/foundryvtt/dnd5e/pull/6446/files>
  - Verify we're good to go. Compare what they're doing to what we're doing
- [ ] Use number formatter for distances in NPC sidebar #6430 <https://github.com/foundryvtt/dnd5e/issues/6430>
  - Verify we're good to go

## Vehicle Sheets to do
