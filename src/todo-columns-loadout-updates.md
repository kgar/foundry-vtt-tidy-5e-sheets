
## To Do

- [ ] implement inventory columns / partition
  - WIP - src\registry\features\columns.ts - customizing props for the column components and implementing prop callbacks
- [ ] implement containerContents columns / partition
- [ ] be able to exclude header, and then header should not be rendered; then update capacityTracker and capacityBar
- [ ] be able to specify width and condition overrides in column partition data ;)
- [ ] `TitleColumn` - takes unlocalized text and localizes it, takes any HTML attributes for the title maybe? 
- [ ] implement effect columns / partition
- [ ] implement encounterCombatant columns / partition
- [ ] implement encounterMember columns / partition
- [ ] implement feature columns / partition
- [ ] implement groupMember columns / partition
- [ ] implement spell columns / partition
- [ ] implement vehicleAssignedCrew columns / partition
- [ ] implement vehicleDraftAnimal columns / partition
- [ ] implement vehiclePassenger columns / partition
- [ ] implement vehicleUnassignedCrew columns / partition
- [ ] Resolve type deficiencies with the current column types and task out additional work as needed
- [ ] Design the registry types
- [ ] Design the partitions types
- [ ] Add common, general-purpose column components that provide universally common things—value/max, meter, meter with value/max, value, incrementer input, etc.
- [ ] Finalize the other domains (most likely going to match Row Action domains)
- [ ] Implement column registry and partitions for each of the domains
- [ ] Add columns to TidyFeaturesRegistry (includes width)
- [ ] Add column partitions (includes ordering and priority)
- [ ] Add column components
- [ ] Ensure - I can use plain JavaScript to add a new column to the registry and then pop it into the partitions wherever I need them
- [ ] Ensure - I can use plain JavaScript to alter an existing column
- [ ] Ensure - I can use plain JavaScript to remove a column from the registry
- [ ] Ensure - I can use plain JavaScript to remove a column from a partition or from all partitions
- [ ] Consider - Do I need helpers for outside callers to get columns partitioned properly? Seems like a lot of work they'd have to do, otherwise... Maybe some code examples will clear it up.
- [ ] Consider - types/index.ts to export all into a pure barrel file, and import from `@/types` wherever types are needed
  - [ ] If yes, then also bring all the API types into the core types folder. We don't want types spread out all over the codebase.
  - [ ] And partition types in whatever way makes the most sense.
- [ ] Consider - `widthRems` is not future proof. Should we do something else? or use an object-based approach that can support a callback for raw value, a measurement obj (measurement "px", "rem", numeric value), or a raw string value?
- [ ] The "Column" components are not really columns. They are column (header) contents.
- [ ] ColumnRuntimeBase always uses the same condition data. This is extremely convenient and saves lines of code. Consider doing likewise for row actions.
- [ ] // TODO: Make common actor context or make common pieces, like InventoryItemContext, ContainerItemContext, etc.
- [ ] Review file sizes and wieldiness of the column registry / partitions. Divide, barrel, and conquer as needed.

## After Next Release

- [ ] Document row action customization and recipes as part of the wiki. Tag it with the tentative Tidy version.

## Stretch

- [ ] Refactoring consideration: `CONFIG.TIDY5E` can replace the concept of the various runtimes. Each can be represented in config, among other useful things like first-class reusable Tidy components. Another bigger refactor opportunity worth pursuing when all other matters have been settled.
  - This should go into a github issue for tracking
- [ ] Migrate in the Item section preparers and reduce looping to a single pass over the items.
- [ ] // TODO: Determine how to make managing row action styles less hardcoded and more configured.
- [ ] Try a CSS Grid / Sub-grid approach Tidy tables. This would eliminate the need to calculate row actions width and open lots of doors, if it were performant.
- [ ] Write a script that takes an allowlist of svelte directories and generates `_module.ts` files for them. It includes named exports such as `export {default as AttuneButton} from "./AttuneButton.svelte";`

## Scratch Notes 🐕

### Column Domains?

Sometimes, there's a very strong domain identity like Vehicle Item or Vehicle Member, which can be solely dependent upon row context. Other times, the domain is weaker or more generic, like ItemUsesColumn, which can be used across inventory items, spell items, feature items, etc.

Ad hoc domains I see in the column files:

- advancement
- inventory
- spell
- feature
- item (that's any item, it doesn't use rowContext at all or rowContext is `any`)
- groupMember
- container
- activity
- effect
- encounterMember
- actor (groupMember / encounterMember)
- vehicleMember (crew / draft animal / passenger)
- vehicleItem
- vehicleUnassignedPassengers (unassigned crew / passengers)

Domains to support:

It really seems like row actions' domains work perfectly for columns as well. Well, almost perfectly. I think there will need to be some duplication of registry data--e.g., some spell and inventory registrations will use the same column--but the important part is that the responsibility to pass correct information to the column component is enforced in both locations. The only real downside here is the amount of extra labor to change a fundamental column across multiple domains, which is really a non-issue when it comes to customizing Foundry.

Consider - the emergence of these commonly held domains means we can potentially design the type definitions with a central list of domains in mind, enforcing holistic updates when adding new domains or changing existing ones. In the case of columns, it adds some duplication around registering columns, but ultimately, it will pay off in consistency and cohesiveness of design.. I think. I'll have to try it out.

### Column Props?

Column props have rigidly adhered to `ColumnCellProps<TDocument = any, TContext = any, TSection = TidySectionBase>` and specified their required document/context/(sometimes?) section within the component. This has led to something of a Type disconnect where some columns can be bandied about