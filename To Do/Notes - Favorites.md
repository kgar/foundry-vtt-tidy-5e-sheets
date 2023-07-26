## Steps

The following is a moderately explained list of steps for how favorites are prepared and visualized on the screen.

In essence, there is a great deal of functionality that is redone here because of this content not being in its native handlebars template. The amount of rework is pretty overwhelming.

Also, there are numerous inappropriate segments in this code where data for other modules is being packed into the items. This is something we'll have to fix by allowing module developers to hook into our stuff and add their data, accordingly. With dynamic hooks, that work may already be done, so...It would be up to us to provide the API which allows them to add their own classes / styles to Tidy 5e elements as we are preparing to render them.


1. Get list of favorite items. These are items of any type, including any inventory, spells, features, subclasses, etc. Any item from `actor.items` where we deem it a favorite (see [the impl](#isitemfavorite-impl))
2. Get favorite color and favorite icon
3. Make context - provides whitelist of accepted favorites, data ownership, and item context entries
    - I see no reason to whitelist. If it can be favorited via the UI, then just let be favorited and visualized. If there is no suitable favorites section, then maybe we can make a generic one with one column for "Name".
4. For each applicable item, creates a favorite button and appends it, full-on jquery style, before the edit button of the target item in its respective list
5. Add class "isFav" to the target item if it has been favorited
6. If "isFav", then
   1. Prepare the item object with additional fields, such as more labels, isStack, canAttune, isMagic, toggleClass, toggleTitle (e.g., "Not Equipped"), spell components, isItem, canPrepare
        - I'm not entirely sure, but this seems no longer necessary. If other parties want to hook into this favorites screen, then let them do so through an API.
7. If `enableSortFavoritesItemsAlphabetically`, then sort each whitelisted item type alphabetically
8. Render fav tab (actually, render fav section on attributes tab, nowadays)
   1. Add fav items, feats, spells (broken out by preparation), and some other settings to context
   2. Load the template for "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-item.html"
   3. Render template "modules/tidy5e-sheet/templates/favorites/tidy5e-favorite-template.html" and pass in the context which was made
   4. Wire up the context menu
   5. Wire up item summary click handling
   6. Wire up item rolling, dragging, editing, toggling, attunement updating, removing from favorites, spell slot values and override changes, creating charges for items, charging features, custom sorting on drop, item uses max / value / count changes,...
   7. Add class `hasFavs` to the favContainer
   8. Append the favHtml to favContent
   9. Handle right-click disabled
   10. Remember scroll top position from last time
   11. Wire up tidy ammo switch
   12. apply color picker customization
        - This is impressive, intense, and unmaintainable. I cannot wait to be on the other side of simplifying this.




### `isItemFavorite` impl

```js
export const isItemFavorite = function (item) {
  if (!item) {
    return false;
  }
  let isFav =
    (game.modules.get("favtab")?.active && item.flags["favtab"]?.isFavorite) ||
    (game.modules.get("favorite-items")?.active &&
      item.flags["favorite-items"]?.favorite) ||
    item.flags[CONSTANTS.MODULE_ID]?.favorite ||
    false;

  const isAlreadyTidyFav = getProperty(
    item.flags[CONSTANTS.MODULE_ID],
    `favorite`
  );
  // for retrocompatibility
  const isAlreadyFabTab = getProperty(item.flags["favtab"], `isFavorite`);
  if (
    String(isAlreadyFabTab) === "true" &&
    String(isAlreadyFabTab) === "false"
  ) {
    if (
      String(isAlreadyTidyFav) !== "true" &&
      String(isAlreadyTidyFav) !== "false"
    ) {
      isFav = item.flags["favtab"]?.isFavorite; // for retrocompatibility
    }
  }

  // if(String(isAlreadyTidyFav) !== "true" && String(isAlreadyTidyFav) !== "false") {
  // //   item.setFlag(CONSTANTS.MODULE_ID,"favorite",isFav);
  // }

  return isFav;
};
```
