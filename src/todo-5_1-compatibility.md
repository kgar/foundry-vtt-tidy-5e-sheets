## 5.1 To Do

> [!TODO]
> - [ ] Account for Spellcasting Upgrade https://github.com/foundryvtt/dnd5e/pull/5838/files

Steps:
- [x] Make spell details load again and present the correct options for method and preparation
  - [x] Classic
  - [x] Quadrone
- [x] Apply revamped spellbook preparation
- [x] Test Finding: Always prepared is showing unprepared styles, and the button is toggleable
- [x] Test Finding: Unprepared is showing prepared styles
- [x] Ensure prepareable icons are tagged as `can-prepare` and `prepared` | `unprepared` | `always`. Unprepared is light and regular. Prepared is default and solid. Always is icon/method color and solid.
  - [x] non-prepareable are `cannot-prepare`. cannot-prepare are icon color and solid.
- [x] Find and deal `preparation?.mode` and `preparation.mode`
- [x] Apply types for untyped spellbook section prep code
- [x] Find out: default sheet spellbook section `id` property, what does it do? Do we need it? If so, add to types and document, and make use.
- [x] dataset `system.preparation.mode` changed to `system.method`; update all callers so that spellbook drag and drop, etc., work as intended.
- [x] Renamed spellbooksection.prop to .slot; propagate
- [x] Update CONSTANTS to use methods instead of spellcasting modes. Observe all callers and how they are using method, looking for potential points to update.
- [x] research: Are the default sheets
- [x] Test: Prepared controls
  - [x] Classic
  - [x] Quadrone
- [x] Classic Spellbook styles: highlight pact spells the Pact color when prepared, Always color when always, else standard row color.
- [x] Class and Subclass sheets | details | spell progression dropdown uses different grouping and values, and they toggle some things based on Modern Rules.
- [x] Update `src\components\item-list\v1\ItemTableRow.svelte` spell method class work
- [x] Ditto `src\components\spellbook\SpellbookGrid.svelte`
- [x] Fix classic item table rows for prepared / not prepared
- [x] Q Item Sheet, Prepared toggle, icon needs to match spell method. Share the spell method icon switch in Foundry Adapter or a similar place.
- [x] system no longer uses `.spells` for their section 🙌, so why am I? Update accordingly, and simplify.
- [ ] Add read adapter for theme settings V2 flag / import data, to V3. This should happen in ThemeQuadrone whenever reading a theme flag or interpreting an import file. Migration should happen in a standalone static class file that has nothing but migration code.
- [ ] test Priority sorting; ensure it works in general and that prepared / always prepared spells are being hoisted to the top.
- [ ] test Prepared sorting `CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED`
  - Specifically, use Unprepared, Prepared, and Always. Do Always get clumped together? If so, do a math max of 1 for preparedness and allow alpha sorting after.
- [ ] // TODO: Will something bad happen if I have an empty string on spellbook section .slot or .method?
- [ ] Try to restore the cool drop logic. First, test the default sheets to see if they're doing anything special. Then determine if smart spell drop is still good to do.

### TODOs for the main 5.1 compat branch

- [ ] Selecting "Legacy 2014 Rules" causes Tidy sheets to crash completely. The default sheets don't load correctly either.


### Stretch goals for later

- [ ] Stretch - how can we leverage the fact that spellcasting modes are all nicely revised and thoroughly data-driven?
  - [ ] SpellUtils.ts - are the isAtWill / isInnate / isEtc helper functions really necessary? 


### Migration notes

`prepared` mode is now `spell` method
`always` mode is no longer a thing ; have to handle on a case-by-case basis

To check prepared state, use `CONFIG.DND5E.spellPreparationStates[key].value`

`.preparation?.mode` / `.preparation.mode` -> `method`