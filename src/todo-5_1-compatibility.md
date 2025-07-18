## 5.1 To Do

> [!TODO]
> - [ ] Account for Spellcasting Upgrade https://github.com/foundryvtt/dnd5e/pull/5838/files

Steps:
- [x] Make spell details load again and present the correct options for method and preparation
  - [x] Classic
  - [x] Quadrone
- [x] Apply revamped spellbook preparation
- [ ] Test Finding: Always prepare is showing unprepared styles, and the button is toggleable
- [ ] Test Finding: Unprepared is showing prepared styles
- [ ] Character / Actor Sheet: Item Spell Context Preparation has changed. Adapt to the updated version.
- [ ] Test: Prepared controls
  - [ ] Classic
  - [ ] Quadrone
- [ ] Find and deal `preparation?.mode` and `preparation.mode`
- [ ] system no longer uses `.spells` for their section 🙌, so why am I? Update accordingly, and simplify.
- [ ] dataset `system.preparation.mode` changed to `system.method`; update all callers so that spellbook drag and drop, etc., work as intended.
- [ ] Apply types for untyped spellbook section prep code
- [ ] Find out: default sheet spellbook section `id` property, what does it do? Do we need it? If so, add to types and document, and make use.
- [ ] Renamed spellbooksection.prop to .slot; propagate
- [ ] Update CONSTANTS to use methods instead of spellcasting modes. Observe all callers and how they are using method, looking for potential points to update.
- [ ] Update `src\components\item-list\v1\ItemTableRow.svelte` spell method class work
- [ ] Ditto `src\components\spellbook\SpellbookGrid.svelte`
- [ ] Add read adapter for theme settings V2 flag / import data, to V3. This should happen in ThemeQuadrone whenever reading a theme flag or interpreting an import file. Migration should happen in a standalone static class file that has nothing but migration code.
- [ ] test Priority sorting; ensure it works in general and that prepared / always prepared spells are being hoisted to the top.
- [ ] test Prepared sorting `CONSTANTS.ITEM_SORT_METHOD_KEY_PREPARED`
  - Specifically, use Unprepared, Prepared, and Always. Do Always get clumped together? If so, do a math max of 1 for preparedness and allow alpha sorting after.
- [ ] research: Are the default sheets
- [ ] Fix classic item table rows for prepared / not prepared
- [ ] // TODO: Will something bad happen if I have an empty string on spellbook section .slot or .method?

### Stretch goals for later

- [ ] Stretch - how can we leverage the fact that spellcasting modes are all nicely revised and thoroughly data-driven?
  - [ ] Filters - can we list out all prep modes just by using CONFIG.DND5E.spellcasting?
  - [ ] SpellUtils.ts - are the isAtWill / isInnate / isEtc helper functions really necessary? 


### Migration notes

`prepared` mode is now `spell` method
`always` mode is no longer a thing ; have to handle on a case-by-case basis

To check prepared state, use `CONFIG.DND5E.spellPreparationStates[key].value`

`.preparation?.mode` / `.preparation.mode` -> `method`