> **Goal**
> Make an API that allows other modules to more easily hook into aspects of Tidy 5e sheet.

- This API should be available directly on the module object as `.api`.
- It should be versioned with a few caveats
  - Old versions never die
    - old API functions should forward to new API versions with a warning log and smart defaults when translating to the new approach
    - if a function becomes completely obsolete, then that function may result in a warning log declaring the API call as nonfunctional, but this should be fairly rare
  - **BIG IDEA 💡**: along with Tidy 5e, provide a CRUD interface that allows for adding multiple startup scripts to fire upon app init. 
    - This should provide the ability for users to paste in API interfacing code that can augment Tidy 5e sheets with other modules' functionality, like Midi QoL.
    - *There should be a disclaimer about never pasting in scripts from unknown sources.*
    - This script feature should be a stopgap for users who want to integrate other modules into their Tidy 5e sheet.
    - Wouldn't it be nice if such scripts were maintained in the Tidy 5e github code base and could be referenced based on which module / version they apply to?
    - These scripts would provide the baseline and examples for other module developers, should they wish to hook into Tidy 5e and customize it for their own modules.


## Things it can do

- Insert additional columns into tables with custom content that can be generated via callbacks and managed by other modules.
- Add/replace charms on the character profile area
- Provide known selectors to specific things (usually data-test attributes, because those will hopefully never change and always remain in place with very specific information embedded)
- Provide data-driven information about the current state of Tidy 5e sheets, their tables/columns, etc.
- Automate actions like
  - Any of the user interactions with the sheets
  - ...?
- 