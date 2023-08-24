## To Do - Item Card

- [x] Learn how the existing one works
- [ ] Determine if a svelte-y plan would work
- [ ] Implement without animation first
- [ ] Add animation
- [ ] Support hotkey options
- [ ] Support Item Card placement settings
- [ ] Etc.

## Notes - How Item Cards Currently Work

Each sheet has a `section.item-info-container`.
The container template is the same for all, with a few comment- and formatting-related differences.

```hbs
<section id="item-info-container">
    <div class="info-wrap">
        <article id="item-info-container-content">
            <!-- Info Card here -->
        </article>

        <article class="info-card-hint">
            <p>
                <span class="key">X</span>
                {{localize "TIDY5E.ItemCardsKeyHint"}}
            </p>
            <p>
                <i class="fas fa-mouse"></i>
                {{localize "TIDY5E.ItemCardsMouseHint"}}
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