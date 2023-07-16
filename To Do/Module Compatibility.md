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

