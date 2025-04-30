## Default Sheet bars research

Character HP Bar:
meter sectioned hit-points > progress hit-points

Character Temp HP;
meter sectioned hit-points > tmp

Character Hit Dice Bar:
meter hit-dice progress

Character Encubrance / Character Container Capacity Mini-bar / Container Capacity Bar / NPC Encumbrance Bar / NPC Container Capacity Bar:
meter progress

Character Facility Bar:
facility-progress meter progress

label > (value, separator, max)

### Findings in dnd5e less files

Based on these files, the purpose of the classes are

- 🚫 `.meter-group`:
  - only known examples: Character HP and HD bars
  - this is a Label (with optional Cog on far right) / Bar vertical setup
  - we don't have to pay much attention to this
- ✅ `.meter`:
  - universal, can be the progress bar or a parent to it, if making a more complex bar like the Hit Points bar
  - provides background, shape, border, relative positioning, layout, overflow control
  - we should emulate this
- ✅ `.meter.progress, .meter .progress`:
  - this sets the bar ;)
  - it expects a bar percentage variable, handles absolute positioning and sizing of a `::before` pseudo element
  - Note: I don't know what the clip path is doing. I can't see a noticeable different with character HP / HD, for example.
- ✅ `.meter .label`:
  - Min requirement: lives within `meter`
  - Any text that needs to be in the meter
  - is sized, laid out, padded, colorized
  - supports `hidden` attribute
- ✅ `.meter .label .value`:
  - adds text shadowing
- ✅ `.meter .label .separator`:
  - provides the alternate coloring to diminish attention and reduce noise
- ✅ `.meter .label .max`: 
  - adds text shadowing
- 🤷 `.meter .label .bonus`:
  - handles bonus text like Temp Max HP

```less
// ----------------------------
// apps.less
// ----------------------------

/* ---------------------------------- */
/*  Meters                            */
/* ---------------------------------- */

.meter-group {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;

  + .meter-group {
    margin-block-start: 0.5rem;
  }
}

.meter {
  --meter-background: var(--dnd5e-color-light-gray);
  border: 1px solid var(--dnd5e-color-gold);
  border-radius: 4px;
  background: var(--meter-background);
  font-family: var(--dnd5e-font-roboto);
  font-weight: bold;
  box-shadow: inset 0 0 16px rgb(0 0 0 / 25%);
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;

  &.progress,
  .progress {
    --bar-percentage: 0%;
    --border-width: 3px;
    overflow: hidden;

    &::before {
      content: "";
      position: absolute;
      block-size: 100%;
      inline-size: var(--bar-percentage);
      box-shadow: 0 0 6px var(--dnd5e-shadow-45);
      clip-path: polygon(
        0 0,
        calc(100% + 6px) 0,
        calc(100% + 6px) 100%,
        0 100%
      );
    }
  }

  .label {
    inline-size: 100%;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    position: relative;
    padding-inline-start: 8px;
    padding-inline-end: 12px;
    color: var(--color-text-light-0);

    &[hidden] {
      display: none;
    }
    .value,
    .max {
      text-shadow: 0 0 4px var(--dnd5e-color-gold);
    }
    .separator {
      color: var(--dnd5e-color-gold);
    }
    .bonus {
      margin-inline-start: auto;
      font-size: var(--font-size-14);
      opacity: 0.8;
    }
  }
}

// ----------------------------
// inventory.less
// ----------------------------

// Common meter styles

.meter.progress::before {
  // Becomes more red the closer it is to 100% encumbrance.
  --bar-color-2: color-mix(
    in oklab,
    var(--dnd5e-color-blue),
    var(--dnd5e-color-maroon) var(--bar-percentage)
  );
  --bar-color-1: color-mix(in oklab, var(--bar-color-2), black 33%);
  --bar-color-3: color-mix(in oklab, var(--bar-color-2), black 20%);
  background: linear-gradient(to right, var(--bar-color-1), var(--bar-color-2));
  border-right: var(--border-width) solid var(--bar-color-3);
}

.encumbrance {
  display: flex;
  flex-direction: column;
  width: 230px;

  .meter {
    --encumbrance-low: 33%;
    --encumbrance-high: 66%;
    border-radius: 3px 3px 0 0;
    height: 25px;
    border: none;
    border-bottom: var(--dnd5e-border-gold);

    .label {
      display: flex;
      align-items: center;
      gap: 0.1875rem;

      i {
        font-size: var(--font-size-9);
        margin-right: 0.1875rem;
      }
    }

    // breakpoint styles
  }
}

/* Containers */
.containers {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(39px, max-content));
  gap: 0.5rem;

  .container {
    max-width: 78px;
    max-height: 78px;
    aspect-ratio: 1;
    border: var(--dnd5e-border-gold);
    border-radius: 4px;
    box-shadow: 0 0 6px var(--dnd5e-shadow-45);
    background-color: var(--dnd5e-color-light-gray);

    a {
      display: flex;
      flex-direction: column;
      height: 100%;

      &:hover {
        text-shadow: none;
      }

      .meter {
        flex: 0 0 6px;
        border: none;
        border-radius: 3px 3px 0 0;

        &.progress::before {
          --border-width: 1px;
          box-shadow: none;
          clip-path: none;
        }
      }

      img {
        flex: 1;
        border: none;
        object-fit: cover;
        border-radius: 0 0 3px 3px;
        min-height: 0;
      }
    }
  }
}

// NPC Item capacity - this is inside

/* Capacity */
.item .item-capacity {
  width: 200px;

  .meter {
    width: 100%;
    height: 25px;

    i {
      font-size: var(--font-size-9);
    }
  }
}

// ------------------------------------------

// -------------------------------------
// character.less
// -------------------------------------

/* Hit Points & Hit Dice */
.meter-group {
  padding: 0 0.5rem;

  + .meter-group {
    margin-top: 0.5rem;
  }

  > .label {
    font-size: var(--font-size-11);
    color: var(--dnd5e-color-gold);
    text-shadow: 0 0 6px var(--dnd5e-shadow-45);
    display: flex;
    align-items: center;
    justify-content: space-between;

    > .config-button {
      color: var(--dnd5e-color-gold);
    }
  }
}

```