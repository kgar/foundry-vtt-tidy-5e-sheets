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

