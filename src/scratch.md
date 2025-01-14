- Should Aggregate actor item sections
  - Has parent with items collection, e.g., Actor5e - owned by actor and should not aggregate world / unlocked compendia items
  - AND either is not in a compendium or is in an unlocked compendium
- Should aggregate world item sections
  - Has null parent and is not in a compendium
- Should aggregate unlocked compendium item sections
  - Has null parent and is in an unlocked compendium

```js
const useParentCollection = !!document.parent && !document.compendium?.locked;

const itemCollection = useParentCollection ? document.parent.items : game.items;

Array.from(
  itemCollection.reduce((prev, curr) => {
    prev.add(curr.getFlag("tidy5e-sheet", "section"));
    prev.add(curr.getFlag("tidy5e-sheet", "actionSection"));
    return prev;
  }, new Set())
)
  .filter((x) => !!x)
  .toSorted((left, right) => left.localeCompare(right));
```
