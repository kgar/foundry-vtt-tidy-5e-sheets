## To Do

- [x] Create form application class
- [x] Hook in template
- [x] Create svelte sheet component and hook into activate listeners
- [x] Curate sheet for Svelte mode
  - [x] store store
  - [x] stats store
  - [x] etc. the works
- [x] Scaffold the tabs and their requisite components
  - [x] "attributes" : "Attributes"
  - [x] "cargo" : "Cargo & Crew"
  - [x] "biography" : "Description"
- [x] Add "allow-edit" lock
- [x] Implement the Header
  - [x] Profile
  - [x] Name
  - [x] Origin Summary section
  - [x] Movement
  - [x] AC Shield and Abilities
    - [x] AC Shield is a little different; it has AC while motionless and AC while in motion.
    - [x] Allow for ability check/save single click like with PCs and NPCs
    - [x] the rest
- [x] Implement sheet body sections
  - [x] Attributes
  - [x] Cargo & Crew
  - [x] Effects
  - [x] Description
- [x] Identify problems with the current sheet that make it difficult to understand/use and fix them.
  - [x] Problem: There aren't dedicated buttons for Ability Check and Saving Throw; I don't care if the vehicle cannot be proficient, we want buttons!
- [x] Research the following and note them here:
  - [x] Actions : Ghosts of Saltmarsh
  - [x] Action Stations : Descent into Avernus
  - [x] Action Thresholds : Ghosts of Saltmarsh
  - [x] Mishap
- [x] Resolve SaltyJ Issues
  - [x] Effects tab missing
  - [x] Adding Crew and passengers
  - [x] Headers are not inline with columns
  - [x] Spacing inconsistent and sad

### Action Thresholds

From "Galley" in GoS:

> On its turn, the galley can take **3 actions**, choosing from the options below. It can take only **2 actions if it has fewer than forty crew** and only **1 action if it has fewer than twenty**. It can't take these actions if it has **fewer than three crew**.

So that is

`< 40 < 20 < 3`

It translates to

3 actions when >= 40 : the full crew complement
2 actions when < 40 : mid crew complement
1 action when < 20 : minimum crew complement
0 actions when < 3 : insufficient crew

There has to be a better way to visualize this. Maybe there are some clever paper vehicle sheets out there in the wild?

A ship can have 1-3 actions, and certain sample vehicles will always put the highest number on the far right field, even when there are only 1 or 2 actions.

## SaltyJ's Issue List for Vehicles

Issue #1: Effects tab is missing in Tidy Sheet where it exists in default sheet.

Issue #2: Adding Crew and passengers is varied levels of broken, as of the version i am using, add button does nothing, in previous versions, it let me add them, but did not save changes. (Would love to be able to drop Actors here, but just filling out the lines sould be pretty nice)

Issue #3: Headers are not inline with columns...everywhere.
(KGar Note: it looks like the classic controls spacing in the header row is not being included with classic controls. Should resolve itself with the standard implementation.)

Issue #4: Spacing can be inconsistant and sad.
(KGar Note: This is in reference to the Creature Capacity, Cargo Capacity, etc. section on the Attributes tab on the left side)

Feature Request: AC has a value for when moving, and when stationary. A toggle here so you can swap between the two would be great, not in system, but figured while i have you, see if its an easy implementation. Feel free to ignore this for a future enhancement post release
(KGar Note: dnd5e system should have a vehicle checkbox / data field for 'moving', because in some systems, knowing whether the vehicle is in motion or not is important; in any case, we can have an option to do screwy stuff like swap ACs when a flag-based version of "movement" is turned on, and that can be an opt-in feature.)

Side Rant: There is one thing i have been struggling with, and this is not sheet specific, sort of a side rant.
In my naval system, The crew can do actions on the ships turn, with trained skills etc using ship stats.
But on the players turn, they can get on stations like Decent into Avernus style.
Unfortunately there is no way that i know of to automate using their bonuses with vehicle sheet weapons in an automated fasion.
Again, not for you to even really think about, but its my current roadblock. ATM we switch to full zero automation for player turns during naval combat..
And considering the ships have sheets, the crew on deck have sheets, even the mines have sheets.....
(KGar Note: This will take some thought about where Tidy 5e fits into the mix with this particular issue. Of course, there's a great deal that could be done to provide functionality like this, but veering too far from the core data into homebrew territory may multiply complexity of maintaining the sheet. Perhaps a separate module that leverages the API?)

## Refine and Bonus To Do's

- [ ] Remove margin top from ItemTableHeaderRow and require calling components to provide their own gap / spacing between tables.
- [ ] Incapacitated calculation for NPCs and PCs: is it taking temp HP into account?
- [ ] Allow arrow and mouse scroll stepping on a Number-dtype text input. Rules: stepping is ignored if the current value is not numeric, and the event passes through.
- [x] Ensure the action threshold calculations can safely coalesce to 0 when data is not available
- [x] Show current crew count and number of available actions below the threshold settings as the visual
  > Crew Action(s)
  > 42 3 (pretty icon when full complement) (title that reads "Full Complement", "Mid Complement", or "Minimum Complement" when hovering over the label/value container)
- [x] ~~Consider embedding Action calculation into the Action Threshold tooltip~~ : nah, skipped
  - [x] For 0 / null / undefined actions -> Full Complement: 0 Actions, Mid Complement: 0 Actions, Minimum Complement: 0 Actions
  - [x] For 1 action -> Full Complement: 1 Action, Mid Complement: 0 Actions, Minimum Complement: 0 Actions
  - [x] For 2 actions -> Full Complement: 2 Actions, Mid Complement: 1 Action, Minimum Complement: 0 Actions
  - [x] For 3 actions -> Full Complement: 3 Actions, Mid Complement: 2 Actions, Minimum Complement: 1 Action
  - [x] etc., it should be dynamic
- [x] Add vehicular movement in the style of DMspiration, a simple checkbox charm at the top right of the vehicle sheet.
- [x] Consider restoring Cargo tab item quantity and removing the quantity column for items without an editablename. It breaks too much with Tidy's style, and wouldn't it be nice to keep the column space open?
- [x] Add vehicular exhaustion in the style of NPC exhaustion. It will need certain adjustments to the exhaustion level text that will require some localization.
- [x] Use HP bars on the HP column for the vehicle Attributes Tab, and add the juice when adjusting HP amount; make HP tab longer to compensate for Current/Max values (double the current width); consider compressing Threshold tab by making it an icon column with a title that says the actual title, to provide the space needed
- [x] Inventory-Grid: Equipped Background is not showing for KGar edition. Fixit.
- [x] Evolve HP column
  - [x] Should show current / max
  - [x] Have HP Bar that transition animates width
  - [x] Allow current and max to be edited as inline inputs
- [x] Submit dnd5e system request (and quite possibly, a PR) for vehicular exhaustion to be added to vehicle data and to the vehicle sheet.
  - https://github.com/foundryvtt/dnd5e/blob/7ab8cc38e0a7a21969dcb4bb19a1816d99d5e19a/CONTRIBUTING.md
- [ ] Do a PR for vehicular exhaustion
- [x] Ditto dnd5e system vehicle data field for "isMoving", "moving", "movement", "inMotion", or some other more appropriate name
- [ ] Do a PR for the `moving` field.


### Color Severity...

This one is tricky. The calculation is:

```js
static getHPColor(current, max) {
  const pct = Math.clamped(current, 0, max) / max;
  return Color.fromRGB([(1-(pct/2)), pct, 0]);
}
```

This is basically setting this color spectrum in stone. Can I allow the caller to set a CSS variable that specifies HSL for altering this spectrum?

Yes, it is possible to make an HSL offset: https://stackoverflow.com/questions/17433015/change-the-hue-of-a-rgb-color-in-javascript

Tidy HSLA for green bar:       hsla(120, 100%, 39%, 0.6)
Default 5e HSLA for green bar: hsla(90,  100%, 50%, 1) 

a difference of (+30, 0, -11, -0.4)

Can I generate an offset using the current HP bar color and then use that offset against the stock 5e HP color calculation?

I'm sure it can be done. It would just have to be worth it.

Update:
I did some trials using this svelte demo:
```svelte
<script>
	let name = 'world';

	// Changes the RGB/HEX temporarily to a HSL-Value, modifies that value 
// and changes it back to RGB/HEX.

function changeHsl(baseColor, hueShift, saturationShift, luminanceShift) {
    var hsl = rgbToHSL(baseColor);
	let hslBefore = {...hsl};
    hsl.h += hueShift;
    if (hsl.h > 360) {
        hsl.h -= 360;
    }
    else if (hsl.h < 0) {
        hsl.h += 360;
    }

	let s = hsl.s * 100;
		s += saturationShift;
		if (s > 100) {
        s -= 100;
    }
    else if (s < 0) {
        s += 100;
    }
	hsl.s = s / 100;

	let l = hsl.l * 100;
	l += luminanceShift;
	if (l > 100) {
        l -= 100;
    }
    else if (l < 0) {
        l += 100;
    }
	hsl.l = l / 100;
		console.log({
			baseColor,
			hueShift,
			saturationShift,
			luminanceShift,
			hslBefore,
			hsl
		})
	
    return hslToRGB(hsl);
}

// exepcts a string and returns an object
function rgbToHSL(rgb) {
    // strip the leading # if it's there
    rgb = rgb.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if(rgb.length == 3){
        rgb = rgb.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(rgb.substr(0, 2), 16) / 255,
        g = parseInt(rgb.substr(2, 2), 16) / 255,
        b = parseInt(rgb.substr(4, 2), 16) / 255,
        cMax = Math.max(r, g, b),
        cMin = Math.min(r, g, b),
        delta = cMax - cMin,
        l = (cMax + cMin) / 2,
        h = 0,
        s = 0;

    if (delta == 0) {
        h = 0;
    }
    else if (cMax == r) {
        h = 60 * (((g - b) / delta) % 6);
    }
    else if (cMax == g) {
        h = 60 * (((b - r) / delta) + 2);
    }
    else {
        h = 60 * (((r - g) / delta) + 4);
    }

    if (delta == 0) {
        s = 0;
    }
    else {
        s = (delta/(1-Math.abs(2*l - 1)))
    }

    return {
        h: h,
        s: s,
        l: l
    }
}

// expects an object and returns a string
function hslToRGB(hsl) {
    var h = hsl.h,
        s = hsl.s,
        l = hsl.l,
        c = (1 - Math.abs(2*l - 1)) * s,
        x = c * ( 1 - Math.abs((h / 60 ) % 2 - 1 )),
        m = l - c/ 2,
        r, g, b;

    if (h < 60) {
        r = c;
        g = x;
        b = 0;
    }
    else if (h < 120) {
        r = x;
        g = c;
        b = 0;
    }
    else if (h < 180) {
        r = 0;
        g = c;
        b = x;
    }
    else if (h < 240) {
        r = 0;
        g = x;
        b = c;
    }
    else if (h < 300) {
        r = x;
        g = 0;
        b = c;
    }
    else {
        r = c;
        g = 0;
        b = x;
    }

    r = normalize_rgb_value(r, m);
    g = normalize_rgb_value(g, m);
    b = normalize_rgb_value(b, m);

    return rgbToHex(r,g,b);
}

function normalize_rgb_value(color, m) {
    color = Math.floor((color + m) * 255);
    if (color < 0) {
        color = 0;
    }
    return color;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

	let baseColor = '#7fff00';
	let targetColor = '#007800';

	let baseColorHsl = rgbToHSL(baseColor);
	let targetColorHsl = rgbToHSL(targetColor);
		let diffHsl = {
			h: targetColorHsl.h - baseColorHsl.h, 
			s: targetColorHsl.s - baseColorHsl.s, 
			l: targetColorHsl.l - baseColorHsl.l 
		};

	function shiftHslFromDiff(rgbColor) {
		// TODO: Implement this
	}

	// TODO: calculate the current color from 0-100, using the Foundry HP color function

	// TODO: show the calculated color at baseColor
	// TODO: diff the base color and show target color
	
</script>

<h2>Diff HSL</h2>
{JSON.stringify(diffHsl)}

<h2>Base Color</h2>
<div style="width: 300px; height: 150px; background: {baseColor}"></div>
HSL: {JSON.stringify(rgbToHSL(baseColor))}

<h2>Hue Shift</h2>
<input type="number" bind:value={hueShift} />
<h2>Saturation Shift</h2>
<input type="number" bind:value={saturationShift} />
<h2>Luminance Shift</h2>
<input type="number" bind:value={luminanceShift} />

<h2>Shifted</h2>
<div style="width: 300px; height: 150px; background: {changeHsl(baseColor, hueShift, saturationShift, luminanceShift)}"></div>
HSL: {JSON.stringify(rgbToHSL(changeHsl(baseColor, hueShift, saturationShift, luminanceShift)))}

<h2>Target</h2>
<div style="width: 300px; height: 150px; background: #007800"></div>
HSL: {JSON.stringify(rgbToHSL("#007800"))}
```

I determined that the actual offset is:

H: 30, S: 0, L: -26

Unfortunately, that means it's a bit less obvious how to calculate the HSL offset.

Next, I should make a demo where I use the HP color equation and apply the known good offset to it, to see the various colors.