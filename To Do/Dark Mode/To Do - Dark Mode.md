# To Do - Dark Mode

## Main List

- [x] Learn how the current dark mode implementation works
- [x] Task out the new version
- [x] Rename the css variables to distinguish them from Tidy 5e until the rewrite is done: `--t5e-...` to `--t5ek-...`
- [x] Extract the light theme variables into a `light.tidy5e-theme` file; it'll just be json with the exact mappings
- [x] Find the appropriate hook / timing to apply the initial CSS variables for the currently-selected theme
- [x] Apply the currently-selected theme variables to the root element
  - [x] at the earliest reasonable init time (the hook or timing thing mentioned above)
  - [x] on change of theme
- [x] Ensure that changing theme causes the entire master list of variables to be reviewed; when the selected theme has specified something for that variable, set it, else clear that variable from the root element. No one gets left behind. Full reset. This is why we'll have the master list of theme colors.
  - [x] Key - the variable name
  - [x] Value
    - [x] type - maybe consider putting some kind of MDN-friendly type text here that would guide in what kind UI to present
    - [x] group - a logical grouping to put the variable in when rendering the UI
- [x] Finally fix the multiply tinting / darkening issue with profile pictures and HP overlays
  - inspo: https://www.youtube.com/watch?v=TAA89nkEuhw&ab_channel=KevinPowell
  - inspo: https://codepen.io/kevinpowell/pen/OJpYKNR/3cf5d075a29e2d702c02ee7387d516c2
  - inspo for rounded images: https://codepen.io/jh3y/pen/mMbOEQ
- [x] Review the dark theme stylesheet and ensure that all of its mappings are accounted for in flat variable bindings; right now, there are some additional styles that are not accounted for
  - [x] For cases where dark theme has a variable and light theme does not, allow the theme to be blank and unset
- [x] Fix death saves icon and input colors
- [x] Fix item input colors
- [x] Fix item input placeholder color
- [x] Make new custom variables as needed
  - [x] `--t5ek-activated-profile-toggle-color`; dark mode is `--t5ek-primary-font` ; light mode is `--t5ek-white`
  - [x] Review the exhaustion font colors. Need more contrast on Yellow exhaustion.
- [x] Create a master list of variables in the form of a TS type and make the light and dark themes adhere to this type; all variables are optional
- [x] Trim all unused variables
  - [x] Also ensure that unset variables are not applied to the root element
- [x] Add setting for Default Theme which determines what the "default" option maps to
  - [x] first available options: Light, Dark
  - [x] ~~Float with commission whether it would be good to default to the OS choice when a default has not been selected yet~~ - perhaps down the line, when I'm doing a full-fledged theme builder project
  - [x] plan for the future to allow any of the custom themes that have been imported to be used
- [x] Upgrade themes so that there is a special collection in player settings that represents the themes
  - [x] name - the theme's pretty name which will appear in the dropdown and theme buidler
  - [x] id - we can generate this, or the user can if they wish
  - [x] description - some editor-enabled text to talk up this theme
  - [x] version - a number to represent the evolving theme file format, incremented by 1, provided by Tidy 5e on export; should be used when migrating to more current versions of the theme
  - [x] variables - the JSON object containing the variable names and their values
  - [x] ...?
- [x] Ensure that this list has the default light and dark themes included
- [x] Update the theme selector and default theme selector configs to point to this collection of themes when preparing to present their options
- [x] Update English localization for the light/dark options to exclude the notion that Light is the default theme.
- [x] Compare PCs
- [x] Compare NPCs
- [x] Compare Vehicles
- [x] Compare Items
- [x] Test linked / unlinked NPC tokens/sheets
- [x] Celebraaaaate! 🎉🎊

## Item Card Side Quest

- [x] Update Item Info Card Footer to include saving throw and damage information

From Fallayn:
```
The "normal" flyout behaviour does not work with Popout at all. However, there is a Tidy option to instead have them as hover tooltips instead of flyouts, like in RPG inventories. Those work in Popout, so I use that option.

Also if I may: the item footer at the bottom has those details, populated by calling Item5e.getChatData(). However, the most important thing IMO is missing there by default: the item's saving throw and damage information, if any. Currently, I'm patching Item5e.getChatData() to add those in, so it shows up in the sheet, but it would be super cool and way less invasive if the sheet template instead added those manually to the item display, should be only a few lines of code.

// Add weapon details in item footer
if (typeof libWrapper === "function") {
  libWrapper.register("advanced-macros", "dnd5e.documents.Item5e.prototype.getChatData", async function (wrapped, ...args) {
    var ret = await wrapped(...args);
    if (this.labels?.toHit) {
      ret.properties.push(this.labels.toHit.replace("+ ", "+").replace("- ", "-"));
    }
    if (this.labels?.damage && this.labels?.derivedDamage?.length > 0) {
      ret.properties.push(this.labels.derivedDamage[0].label.replace(" + ", "+").replace(" - ", "-"));
    }
    if (this.labels?.save) {
      ret.properties.push(this.labels.save);
    }
    return ret;
  }, "WRAPPER");
}

So basically, instead of just putting Item.getChatData() in the footer, you'd prepend Item.labels.toHit//.labels.derivedDamage/.labels.save if they exists/aren't empty
```

KGar:
Localized text:
DND5E.ToHit - To Hit
DND5E.Damage - Damage
DND5E.VersatileDamage - Versatile Damage


Add to front of tags

## Oops

- [x] PC tool proficiencies are missing? Put them back - I think it was from a recent dnd5e update; thankfully, this will be covered in my automated tests later, so catching this stuff will be a breeze

## Refine

- [x] Refine: rename the font-family-specific variables to something more geared to their purpose and not to the font family itself.
- [x] Refine: setting properties directly on root is not very Tidy of me.
  - Using a constructed stylesheet works for the main page but not for popout.
  - [x] Consider applying theme by setting a style tag in the head element.
- [x] Document it: add a readme to the theme folder that explains how to add new variables, remove variables, etc.
- [x] inline the Class Advancement SVGs
  - [x] create a component called InlineSvg that takes a url
  - [x] fetch the content via the url in the component
  - [x] render the return value on the screen
  - [x] if error, then attempt to put it to an `img[src]`
  - [x] set the class advancement SVG fills to our `--t5ek-primary-font` value 💪
  - [x] set the width/height of the SVG images appropriately
  - [x] ~~leave the image filter variable intact as a fallback, and have the styles support it~~ nah
- [x] item tables in dark mode have a little sliver of border-left on the rows
- [x] Revisit settings.ts and look for FoundryAdapter.localize(). There's no need to do that during setting registration.
- [x] Sweep the code base for rgba(), rgb(), hsla(), hsl(), `\s#[0-9a-fA-F]{3,6,8}`, and extract or reuse colors
  - [x] rgb, rgba
  - [x] hex
  - [x] hsl, hsla
  - [x] named CSS colors (i.e., a color-based declaration whose value does not start with `var(`)
  - [x] Apply colors to themes
  - [x] Rename colors and consolidate where able; 
- [ ] Review and reuse core colors where able via variable reference more generic variable
- [ ] Review the variables
  - [x] Can they be better named? there are many cases where there are two or more pieces to a given set of variables, such as bg, color, outline, hover-color, etc. Need a solid naming convention that is consistent
  - [ ] Can any repetition / redundancy be reasonably eliminated? Reduce duplication of colors in the themes, if possible. Allow specialized colors to reference other variables; think of how Kendo will create variables for specific things but will point them to more generic variables
  - [ ] Document the naming conventions in the readme
- [x] // TODO: Decide on the layout and then clean up
- [x] Make sure spell level configuration dialog is dark-mode-enabled
- [x] Make sure spell level configuration dialog is light-mode-enabled
- [x] Get Freeze Key working for floating item card while popped out


## And Also

- [x] Remove the PC, NPC, and Vehicle Border PX options / localization from settings

### Tiny MCE Styles

```css
```

### Tiny MCE Dark Mode Styles

```css
/* This is TinyMCE */
.tox .tox-toolbar-overlord button {
  color: #222;
}

.tox-sidebar-wrap {
  padding: 8px;
  background: var(--t5e-secondary-color);
}
```

## Current Setup

Setting: colorScheme

When colorScheme is "dark", then `tidy5eDark` is added to the html element (😱).
After declaring the setting and its onchange handler, it then checks the setting immediately and applies the dark-mode class to the html element.


## Color Picker Customization

Color Picker Customization is not directly related to the initial dark mode implementation. It is layered on optionally (if colorPickerEnabled is true) during

- `Hooks.on("renderTidy5eNPC", ...)`
- `Hooks.on("renderTidy5eSheet", ...)`
- `Hooks.on("renderTidy5eVehicle", ...)`

It would be best to avoid using this code, if possible.


## Candidate for overlay redux

Try it at https://svelte.dev/repl/


```svelte
<section class="demo">
	<div class="img-container">
		<img src="https://i.pinimg.com/564x/55/b2/3c/55b23c9f184706ed6d7f3b38b2eeeb44.jpg" alt="" />
	</div>
</section>


<style>
	*,
	*::before,
	*::after {
	  box-sizing: border-box;
	}

	img {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		object-fit: contain;
	}
	
	.img-container {
		border-radius: 50%;
		width: 150px;
		height: 150px;
		position: relative;
		overflow: hidden;
	}

	.img-container::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 65%;
		background: rgba(255, 0, 0, 1);
		mix-blend-mode: multiply;
	}
</style>
```