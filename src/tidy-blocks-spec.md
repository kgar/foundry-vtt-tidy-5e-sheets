## Tidy Blocks

Yes, we are straight up adopting Notion's terminology. It is a great concept, so we're just going to use it and move on!

### To Do

- [ ] Spec out the API calls / models to register a block on a tab
  - [ ] Ok, now an array of blocks on a tab
- [ ] Simplify CONFIG.TIDY5E.features.columns and CONFIG.TIDY5E.features.rowActions to be completely flat.
  - [ ] features - consolidate duplicates that can be lightly customized during partitioning.
- [ ] Implement TableBlock component
- [ ] Design the CONFIG.TIDY5E.features.blocks types
  - features.blocks is the place where uniquely-identified block definitions, not just the generic available blocks, are kept. Expect to see lots of random IDs for keys, whereas type is "table" for all of them, for example. Blocks are put here so they can be partitioned to 1 or more places in partitions.blocks.
  - [ ] TableBlock, type: "table"
- [ ] Design the CONFIG.TIDY5E.partitions.blocks types
  - [ ] Document Name, Document Type, Tab ID, Array of block IDs
- [ ] Generate CONFIG.TIDY5E.features.blocks from the API - consider using the lazy approach in stretch goals
  - 💡 A block is validated at this stage
- [ ] Generate CONFIG.TIDY5E.partitions.blocks from the API - consider using the lazy approach in stretch goals
- [ ] Regenerate (or invalidate) these generated configs when new blocks are registered.
- [ ] Add a context map for tabIds to block arrays to all sheet contexts.
- [ ] Ensure all sheet types are preparing blocks for rendering ()
  - 💡 A block is prepared at this stage
- [ ] Implement the component that takes the document and tab information, resolves the components, and renders them.
  - 💡 A block is rendered at this stage
- [ ] Implement a component that uses the block renderer and includes a gold line above the blocks when there is at least one rendered block.
  - Each block should have an error boundary
- [ ] When rendering sheet tabs, we should include the gold-line block rendering component. When the gold line is the first element in its container, it should be hidden via pure CSS.
- [ ] Spec out the API calls / models to register block content (single or array) while registering a tab, for that tab

#### Stretch

- [ ] Make the HandlebarsBlock; it should compile the handlebars template function before storing it in the runtime
- [ ] Make the HtmlBlock
- [ ] Upgrade the tab runtimes to generate to CONFIG.TIDY5E instead of internally. They will still hold registered state.
- [ ] Hey! "generated" CONFIG.TIDY5E content could (and should) be derived content 👀, but the cache-busting needs to be signalled manually (e.g., a setting changed, or an API call has rendered the existing generated content as irrelevant). Looking at some options. Here's one that's like the coarse reactivity provider.

```js
export function lazy<T>(compute: () => T) {
  let cached: T | undefined;
  let valid = false;
  let version = $state(0);

  return {
    get value() {
      version; // subscribe the caller to invalidations
      if (!valid) {
        cached = compute();
        valid = true;
      }
      return cached as T;
    },
    invalidate() {
      valid = false;
      version++;
    },
  };
}

// ... my place where I keep all the computations .ts ;)

export const sheetData = lazy(() => expensiveComputation());

// ... main.svelte.ts

import { sheetData } from 'my place where I keep all the computations .ts';

CONFIG.TIDY5E = {
  // the configs
  get sheetData() { return sheetData.value; },
  // and so on
}
```

To invalidate data

```js
import { sheetData } from 'my place where I keep all the computations .ts';

game.settings.register('tidy5e', 'someSetting', {
  // ...
  onChange: () => sheetData.invalidate(),
});
```



### Definitions

- **Tab** - A content area and strip of options for toggling what you see in the content area.
- **Section** - Essentially a table with organizational logic applied to it. It is one among potentially many tables that are logically partitioned together, represented on a document sheet. Sections are grouped by purpose, such as inventory sections, spell sections, effect sections, etc. They are orderable and can have their visibility toggled in general or for specific levels of user access. Sections have column configurations for their tables and manage show/hide logic based on column priority and available space.
- **Table** - a standard tabular UI that presents a list of similar information. It has columns. It sometimes have row actions in the last column. Usually, tables have a primary column, typically the first column, which helps sections to perform column show/hide logic. Each row can have a Row Summary that is expanded when clicking on the Primary Column row name. A Row Summary is another row below the row being summarized; it spans all columns and shows additional information about the previous row.
- **Block** - generally, the blueprints for a unit of UI in Tidy, which can be used to render UI. All of Tidy sheets is composed of blocks in a theoretical sense. As a feature, it is the logic and component necessary to render UI, given contextual data. Blocks can be validated. They can be used to prepare properties for UI rendering. They supply a related svelte component for rendering.

### Some Use Cases

- A module developer adds a custom tab and supplies the following blocks as part of the tab registration:
  - Action Bar Block 
  - Header Block
  - Section Group Block
    - 🔁 Section Blocks
  - Header Block
  - Section Group Block
    - 🔁 Section Blocks
  - Footer Block
- A plugin is registering a block to go below the inventory tab content for Characters only. This causes a gold separator to appear between the section group and the additional content. It supplies,
  - Section Block

### Misc Notes

In all cases, the caller should be able to register at `tidy5e-sheet.ready` time, and they should be able to specify document names, document types, and even filter logic related to the document sheet in question, giving a substantial amount of flexibility.

Registering this content is supplying the blueprints for carrying out the rendering. Tidy will optimize the preparation of this information in a generated section in CONFIG.TIDY5E each time registrations are made, possibly debounced by a very small amount of time to account for registration flooding.

CONFIG.TIDY5E should hold the prepared block content, partitioned out for O(1)-like lookups. "Prepared" entails the blocks have been validated

### Registering a Block

```js
const handle = api.blocks.register({
  type: "table",
  target: {
    documentNames: ["Actor"],
    documentTypes: ["character"],
    tabId: "inventory",
  },
  definition: {
    title: "MY.LOCALIZED.Title",
    getEntries: (args) => myModuleApi.getEntries(args.document),
    columns: [
      {
        id: "name",
        primary: true,
        props: (args, entry) => ({
          name: entry.name,
        }),
      },
      {
        id: "progress",
        widthRems: 8,
        condition: () => game.settings.get("myModule", "showProgress"),
        props: (args, entry) => ({
          value: entry.value,
          max: entry.max,
          style: "valueMax",
          meterClass: "my-cool-class",
        }),
        priority: 10,
        order: 20,
      },
    ],
    sectionActions: {
      add: {
        icon: "fa-solid fa-plus",
        tooltip: "MY.LOCALIZED.AddRowAction.Tooltip",
        condition: (args) => args.document.isOwner,
        onClick: (event, args) => myModuleApi.addAThing(args.document),
      },
    },
    rowActions: {
      increment: {
        icon: "fa-solid fa-hammer",
        tooltip: "MY.LOCALIZED.IncrementRowAction.Tooltip",
        condition: (args) => args.document.isOwner,
        onClick: (event, args, entry) =>
          myModuleApi.incrementTheThing(entry.id),
      },
      cancel: {
        icon: "fa-solid fa-trash",
        tooltip: "MY.LOCALIZED.CancelRowAction.Tooltip",
        condition: (args) => args.document.isOwner && args.common.unlocked,
        onClick: (event, args, entry) => myModuleApi.cancelTheThing(entry.id),
      },
    },
    getRowSummary: (args, entry) => getMyRowSummaryHtml(entry),
  },
});

// In case someone wants to do this in realtime via some realtime setting changes 💪
handle.unregister();
```

### Tracking and describing Block types

Be able to generically configure each block type via **type descriptors**.

```js
interface SectionTypeDescriptor<TReg, TProps> {
  validate(reg: TReg): string []; // problems, for logging
  prepare(reg: TReg, ctx: SectionContext): Promise<TProps>; // runs at context-prep time
  component: Component<TProps>; // Svelte renderer
}
```

