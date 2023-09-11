From discord user wasp:

Svelte, while it does make traditional module development easier, it does sacrifice the traditional jQuery support that it has previously supported. I think you're right that an API to register components to certain parts of sheets would be the best, and establish a language to do so. For example, I'm the developer of Rest Recovery, and the module adds a secondary field to items that makes food items have a second field set that sets some flags on the item itself.

> I'd be happy to help out with that portion, if needed

tem Piles have a fair bit of Svelte going on, along with some customisability.
Here's a few points of inspiration that may spur your imagination:
https://github.com/fantasycalendar/FoundryVTT-ItemPiles-Bankers/blob/master/src/module.js#L11

https://github.com/fantasycalendar/FoundryVTT-ItemPiles/blob/master/src/API/api.js#L2048

https://github.com/fantasycalendar/FoundryVTT-ItemPiles/blob/master/src/applications/item-pile-config/settings/custom.svelte

The above example allows people to create their own item piles types, which is used to create a banker type item pile, which is the rider module that creates a bunch of vaults, like in WoW.

... if you run into hurdles in the Svelte space, do reach out. I have some wisdom to share after creating several Svelte powered modules 😄

I would love to develop a grid based inventory UI for the new tidy sheet
Similar to vaults in item piles

> And keep in mind that this is a module for a vtt, not the cure for all diseases. Take it easy and enjoy yourself!

## Officially Supported Modules

These modules are known to be supported in Tidy 5e currently. They are often crammed into the core implementation of the sheets rather than bolted on after the fact.

Dynamic Active Effects (ID: dynamiceffects) https://foundryvtt.com/packages/dae

> 💪 Very important sibling module

Midi Quality of Life Improvements (ID: midi-qol) https://gitlab.com/tposney/midi-qol

> 💪 Very important sibling module

Magic Items (ID: magicitems) https://foundryvtt.com/packages/magicitems/

> ✏ Check this one out sometime. Is it important enough?

~~Lazy Money (ID: lazymoney) https://github.com/p4535992/foundryvtt-lazymoney-dnd5e~~

~~> ✏ This should be core functionality in Tidy 5e~~

Character Sheet Favorites (ID: favorite-items) https://gitlab.com/mxzf/favorite-items

> ❓ Tidy 5e generally replaces this functionality

Favorite Item Tab (ID: favtab) https://foundryvtt.com/packages/favtab

> 💀 Has fallen completely out of date. Last updated 2021

Character Actions List dnd5e (ID: character-actions-list-5e ) https://github.com/ElfFriend-DnD/foundryvtt-dnd5eCharacterActions

> ✅ Can most likely be grandfathered in via the API

World Currency 5e (ID: world-currency-5e) https://foundryvtt.com/packages/world-currency-5e

> ⚠ Integrated uncomfortably closely with lazy money integration in Tidy 5e. Uncomfortably, so. This should be reimagined with the API

Popout!

> Requested by Fallayn in the commission thread, and they are intending to contribute financially.

Window Tabs

> Hasn't been requested by anyone on the commission, but it would be good to support.