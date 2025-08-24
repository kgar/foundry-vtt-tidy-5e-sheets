## Agents Quickstart: Developing Tidy 5e Sheets

A minimal, copy-paste guide to run this repo with hot-reload in Foundry VTT.

### Prerequisites
- Node.js LTS installed
- Foundry VTT installed and know your Foundry data folder path
  - macOS default: `/Users/<you>/Library/Application Support/FoundryVTT`

### One-time setup
```bash
cd /Users/k4black/Projects/fork-foundry-vtt-tidy-5e-sheets
npm install
npm run prepare-dev
# If the config file does not exist yet
cp foundry-data-path-config_example.json foundry-data-path-config.json
```
- Edit `foundry-data-path-config.json` and set `dataPath` to your Foundry data folder (the folder with `Config`, `Data`, `Logs`).
- Create a symlink to Foundry’s `modules` folder:
```bash
npm run link-create
```

### Daily dev loop (HMR)
```bash
npm run dev
# HMR server runs at http://localhost:30001
```
- Launch Foundry VTT, enable the module “Tidy 5e Sheets”.
- Keep the dev server running; edits to `.svelte/.ts/.scss` hot-reload. If a change doesn’t appear, close/reopen the sheet or refresh the browser tab.

### Useful scripts
- Build production: `npm run build`
- Watch build: `npm run build-watch`
- Type-check: `npm run check` or strict errors `npm run check-errors`
- Docs: `npm run refresh-docs`
- Remove symlink: `npm run link-remove`

### Quick verification (weight formatting + units)
- D&D5e settings → enable “Currency Weight” to see the distribution tooltip.
- D&D5e settings → toggle “Metric Weight Units” to switch kg/lbs; reopen sheets to refresh.
- Character (Quadrone) → hover the encumbrance bar:
  - Tooltip shows Items/Currency with up to 2 decimals and units.
  - Bar label shows value/max plus units.
- Container (Quadrone) → header capacity shows two-decimal formatting with units; hover the contents capacity bar for the same tooltip.
- Item sheets (Weapon, Tool, Equipment, Consumable, Loot):
  - Header weight shows value with ≤2 decimals; units styled like the price denomination (not bold).

### Key code locations
- Actor encumbrance bar (Quadrone): `src/sheets/quadrone/actor/parts/ActorEncumbranceBar.svelte`
- Encumbrance bar (Classic): `src/sheets/classic/actor/EncumbranceBar.svelte`
- Container capacity tracker (Quadrone): `src/sheets/quadrone/container/parts/CapacityTracker.svelte`
- Container header capacity: `src/sheets/quadrone/container/ContainerSheet.svelte`
- Item header weight summary: `src/sheets/quadrone/item/parts/header/ItemWeightSummary.svelte`
- Weight distribution tooltip: `src/tooltips/WeightDistributionTooltip.svelte`
- Weight unit source (kg/lbs): `src/foundry/foundry-adapter.ts` → `FoundryAdapter.getWeightUnit()`

### Tips / gotchas
- Dev mode runs on port 30001 (not 30000).
- Settings-based changes (like unit system) may require closing/reopening the sheet.
- If something looks off, disable other modules to rule out conflicts.

