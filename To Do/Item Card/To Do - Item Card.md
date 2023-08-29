## To Do - Item Card

- [x] Learn how the existing one works
- [x] Determine if a svelte-y plan would work
- [x] Add base card to Character Sheet
- [x] Style it
- [x] Get it to show/hide when mousing in and out of item table rows
- [x] Set up default item-card template component ; this is bare bones and provides the most basic groundwork. Any future items default to this until they get their own component
- [x] Consider pulling actor context from store rather than weaving `ctx` everywhere. It is absolutely available, but it will have to be the union of PC / NPC / Vechicle context, so everything related to `ctx` and `store` should be treated as potentially null / undefined.
- [x] Implement Inventory template ; all items that are not spells, based on inventory-grid version from tidy
  - [x] Try to slot the additional content into the default template
  - [x] ~~Maybe refashion the default template as a base card template?~~ Different plan
- [x] Implement Spellbook template ; spells, based on spellbook-grid version from tidy
- [x] Implement Feature template ; it's the default template ✅
- [x] Wire up item chat data fetch within item info card component, and get the template from the card store, else use the default
- [x] Implement custom content (Inventory Grid has a special template for item card content)
- [x] Implement freeze key
  - [x] Subscribe to document on item info card component (clean up?)
  - [x] Let go of freeze on target Key Up OR when the user removes focus from the browser tab
  - [x] Provide visual indicator that freeze key is being held
- [x] Implement floating
  - [x] Apply class when setting is set
  - [x] Create function for getting top/left
  - [x] Set top/left 
  - [x] Listen to mousemove and retarget top/left while open and not frozen
- [x] Implement `overflowing` feature which applies some padding against the scrollbar. Accomplished this by eliminating the feature and always having some padding in place.
- [x] Test/compare for PC
- [x] Test/compare for NPC
- [ ] Test/compare for Vehicle
- [ ] Test with popout!
- [ ] Test with Window Tabs
- [ ] Ponder how one might add custom content to these cards... such as mod buttons
- [ ] Implement setting: Disable item cards for NPCs/Vehicles
- [ ] 

## Refine

- [ ] Extract common grid layout button and wire in the item card functionality so that it's shared
- [ ] Review item card implementation and simplify / streamline if able
- [ ] Add hook subscribe to catch changes to tidy 5e kgar main settings changes and then rerender sheets the same way that it works for sheet settings.
- [ ] Upgrade cards to support longer names. Particularly, eliminate the faded gradient in favor of a more direct coloration of the header name section.
- [ ]
- [x] The show/hide is not as deterministic as the original. The original always allows the card to fully dismiss before applying changes. Do we need a throttle of some sort? Buffering to allow close to finish? This may become clearer after implementing more of the card.
- [ ] // TODO: Replace pixel perfection with more relative measurements
- [ ] Figure out how to mix in the various item card features. They're all layered onto the one component, and it's getting pretty crowded.

## Rewriting Item Cards

One approach:

- Each sheet gets its own reusable item-card
- Create a writable store that contains the state for managing the item card
  - Show/Hide
  - ~~Delay~~ this will be in settings and can be directly in the card component
  - ~~Floating~~ this will be in settings and can be directly in the card component
  - item-card content html (or component)
- Let CSS do the heavy lifting as it has for the original Tidy 5e sheets
- Use mouseenter / mouseleave on the ItemTableRow components can pull the writable store from context and interact with it
  - mouseenter
    - Pull chat message data and/or (?) use custom card content provided by the particular item table row in question
    - When everything is ready, apply it to the store and call `show.set(true)`
  - mouseleave
    - call `show.set(false)`
- From the item card's perspective
  - when `show` becomes `true`
    - use similar logic as the original to prepare to show the card, handling things like a monitored/cancellable delay timeout, positioning based on whether we are floating, Freeze key handling
  - when `show` becomes `false`
    - ditto to show true

## Notes - How Item Cards Currently Work

Each sheet has a `section.item-info-container`.
The container template is the same for all, with a few comment- and formatting-related differences.

```hbs
<section id='item-info-container'>
  <div class='info-wrap'>
    <article id='item-info-container-content'>
      <!-- Info Card here -->
    </article>

    <article class='info-card-hint'>
      <p>
        <span class='key'>X</span>
        {{localize 'TIDY5E.ItemCardsKeyHint'}}
      </p>
      <p>
        <i class='fas fa-mouse'></i>
        {{localize 'TIDY5E.ItemCardsMouseHint'}}
      </p>
    </article>
  </div>
</section>
```

There is a dedicated script `tidy5e-itemcard.js` which is invoked during the `activateListeners()` phase for each sheet. It is ignored if the relevant sheet setting has it as disabled.

### getBounds()

It tries to account for PopOut! It kinda works when the Item Card is set to show beside the mouse cursor. However, holding "X" doesn't work like it should when popped out.

### setCardPosition()

Dedicated to setting position for floating cards. Does nothing if frozen.
It will look for the mouse cursor position and follow it until fixed or dismissed.
It is aware of how much space is on either side and will favor the side with more space to show the card. Specifically, if the mouse X + 304px is greater than the sheet border right, then it will swap to the left.

#### The basic gist of setting position

If frozen, do nothing.
Put the card to the right of the mouse, centered if possible.
If too far to the right of the sheet's edge, orient the card to the left of the mouse.
If centering is not possible, favor anchoring the card's top position so that the card bottom rests at the sheet bottom.

### Freeze Key Handling

It uses document keydown and keyup to drive whether the card is fixed in place. This is probably why popout! integration doesn't work with the "X" key. When the card is fixed, no other cards will appear for this sheet or any other Tidy sheet. So, in this regard, it is indeed a singleton, even if every sheet has its own copy of the item card. Moreover, if the target key is being held down before mousing over / into a node of interest, the card feature will do nothing.

When "X" is pressed, simply set `itemCardIsFixed` to true.

When "X" is released, set `itemCardIsFixed` to false, and if there's a visible card, remove it, accounting for optional delay. When no delay, they outright remove the card via `removeCard()`. Else, they remove the `open` class from the card, which most likely results in a slide out animation.

### itemCardDelayCard()

Set timeout based on delay, then remove existing card and show new card, adding the `open` class to the info container.

### resetDelay()

Clear the timeout if it exists.
If item card is not fixed, then remove the `open` class on the info container.

### Mouse enter and leave

There are two sets of mouseenter and mouseleave events for card triggers.

mouseenter 1: if the card is not fixed and there's no delay, then add class "open" to the info container

mouseenter 2: set `mouseOverItem` true (what that mean?), and if the card is fixed, do nothing else. Otherwise, if there's a delay, then `itemCardDelayCard()`, else `showCard()`.

mouseleave 1: if the card isn't fixed and there's no delay, then `hideContainer()`

mouseleave 2: set `mouseOverItem` false (what that mean?), and if the card is fixed, do nothing else. Otherwise, if there's no delay, `removeCard()`, else `resetDelay()`.

As to why these are spread out like this, unless there's a weird edge case I don't know about, it seems like the product of multiple developers collaborating and no one person going back and cleaning it up.

### Reacting to context menu and dragging

When the user right-clicks an item (`.item`, which are essentially the triggering targets for item card), then it will set `mouseOverItem` false and then call `hideContainer()`. This results in immediately hiding the card if context menu is invoked.

If the user begins dragging an item, then set `mouseOverItem` false and call `hideContainer()`.

Note: Hiding on context menu generally works until you mouseenter another item row, at which point the card will reappear. Thankfully, the card is behind the context menu, currently.

Note: Dragging seems to be more way more effective at keeping the card gone. I cannot tell right away why that is.

### showCard()

Easily the biggest part of this feature.

It calls `getBounds()`. It finds the closest item and then gets the item ID from the element dataset. If the item exists and belongs to the actor, it proceeds to the next part.

Next, it gets the chat data for the item and extracts the description value.

Then, it gets the `.info-card`, if any, clones it, and appends it to the info container content. (could this be how oathbow in Grid layout has the ammo dropdown in the card?)

It finds and hides the info background (why?).

It finds the info description and populates it with the item description from chat message data.

It creates a list of props and puts them after the `.info-card` description-wrap.

If the inner scroll height of the infoDescription's first element is greater than the infoDescription's overall height, it sets an `overflowing` class on the infoDescription.

With this, it has successfully shown the card. This is called on mouseenter within `itemCardDelayCard()` when there's a delay or directly when there's no delay.

### removeCard()

Find the item info container background and show it (why?).

Within the info container content, find the `.info-card` and remove it. This is the custom content to be found within the item card from the chat message data.

### hideContainer()

Simply removes the `open` class from infoContainer.

### Handling `.button` clicks?

At the end of the script, there is a global event handler that fires and wires up button click handling. Specifically, it tries to find the closest `.info-card` and take the attr `data-item-id`. Then it pulls the `data-action` from the button. Then, it targets a tidy5e sheet item whos `data-item-id` matches, then drills down through item buttons to the button whose `data-action` matches, and then trigger the button.

I do not know what would merit this, yet. I haven't encountered buttons in the `.info-card`.

The main problem with this wiring is that it is being called against the entire document every time a Tidy 5e sheet renders. If there is such a button, it may well have hundreds / thousands of click event handlers after some time with the page open. The compounding problem is that the ID is reused in PC, NPC, and vehicle sheets, so depending on how many sheets are open and rerendering, the event bindings get multiplicative. After all, this event wire-up is being called on every `activateListeners()` call.

I wonder if this is actually being used... Either way, I intend for there to be an API hook for adding buttons and enabling the caller to wire them when the info card is being prepared / rendered.
