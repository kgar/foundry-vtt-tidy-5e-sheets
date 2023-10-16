## To Do

> **Goal**  
> Allow module developers to augment Tidy 5e sheets in a stable way which can tolerate numerous major updates to layout classes, structure, etc. For module developers who lean into using the API, they should be able to "set it and forget it" when it comes to hooking into Tidy 5e sheets.
> 
> As such, to achieve the goal means to create a resilient API that is detached from the implementation details enough that it can provide smart defaults, perform validation where needed, and be able to forward current API calls to future API calls if ever they are deprecated in favor of new APIs.

- [ ] Identify "seams" where augmentation should be supported
  - [ ] Tabs - Characters, NPCs, Vehicles, Items
  - [ ] Tab Menu items/sections - All supported sheet types, all tabs or specific tabs, enable boolean/function
  - [ ] Item Info Card
  - [ ] Item Table Context Menu Options
  - [ ] Item Table Classic Controls
  - [ ] Theme colors? (may require the Theme overhaul in order to allow for this)
  - [ ] Additional sheet profile trackers/charms like inspiration
  - [ ] Inserting content in various places that are specific to a given layout (DnDB importer, "Module-Who-Shall-Not-Be-Named" Lvl Up icon, etc.)
  - [ ] Adding more item states and colors/decorations/styles for those states
  - [ ] ... (poll and look for inspiration)

## Refine

- [ ] Make the API more forgiving and able to apply smart defaults before calling underlying state services.
- [ ] Create a one-off test script (world script) which adds a new tab and plugs in an arbitrary component
  - [ ] Make a special Tidy 5e hook which establishes when Tidy 5e's API is ready to use
  - [ ] Make the one-off test script talk to the Tidy 5e API in order to add a tab and arbitrary content
    - [ ] Use a component provided by the API
    - [x] Allow for raw HTML
    - [ ] Allow for a function that receives context and expects raw HTML in return
    - [x] Provide an optional render callback with HTML set to the containing tab content node
    - [ ] Allow for handlebars?
- [ ] `game.settings.get('dnd5e', 'disableExperienceTracking')` -> extract to CharacterSheetContext


### Registering tabs through the API

```js
// Hint: throw this in a macro for demonstration
  function addTestTab() {

    game.modules.get('tidy5e-sheet-kgar').api.registerCharacterSheetTab({
      displayName: 'Test',
      enabled: true,
      id: 'test-tab',
      order: -1,
      layout: 'all',
      content: {
        html: `
          <h2>Hello, world!</h2>
          <button type="button">Click the button</button>
        `,
        cssClass: 'test-class',
        rerenderOnSubmit: false,
        render: (tabContent) => {
          tabContent
            .querySelector('button')
            ?.addEventListener('click', (ev) => {
              const header = tabContent.querySelector('h2');
              if (header) {
                header.textContent = 'Goodbye, Moon Man!';
              }
            });
        },
      },
    });
  }

  addTestTab();
  ```