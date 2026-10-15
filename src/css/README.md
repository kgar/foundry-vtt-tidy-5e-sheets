# Tidy 5e CSS Architecture

Foundry v14's `@layer modules` contains Tidy's CSS above core and dnd5e. We break apart our CSS into purpose-built files specified below. Tidy does not use sub-layers. We try (keyword: try) to keep our styles clean using consistent specificity and a defined import order, instead of relying on conflicting rules and specificity fights.

## `tidy5e.css` import order 

1. **Tokens**: `variables.css`
2. **Resets**: `sheets/reset.css`
3. **Semantics**: `typography.css`, `apps.css`, `forms.css`
4. **Components**: `sheets/components.css`, `sheets/components/*.css`
5. **Sheets, sheet-level components, and dialogs**: `sheets.css`, `tables.css`, `header.css`, `abilities.css`, `actors.css`, `items.css`, sheet-type files, `inventory.css`, `tooltips.css`, `editors.css`, `dialogs.css`
6. **Tabs**: `sheets/sheet-tabs/*.css`
7. **Utilities**: `util.css` (utility classes, including the colour/font/flex utilities, and application-state rules such as `.minimized`)

## Specificity

**Start file-level rules with `.tidy5e-sheet`.**

- Any rules at the file's root level use `:where()` to avoid adding specificity: `.tidy5e-sheet:where(.actor)`, `.tidy5e-sheet:where(.npc, .vehicle)`, `.tidy5e-sheet:where(.application)`, `.tidy5e-sheet:where(.theme-parchment)`.
- `reset.css` has the only zero-weight root
- There are a few exceptions (Coloris picker, `@font-face`, `@keyframes`), but otherwise stick to the above rules.

```css
/* Good. */
.tidy5e-sheet {
  .pill { … }
}
.tidy5e-sheet:where(.application.npc) {
  .sheet-header { … }
}

/* Bad. Too specific, uneven specificity, or not specific to a sheet/component. */
.tidy5e-sheet.application:where(.quadrone) { … }
.tidy5e-sheet.application.quadrone { … }
.tidy5e-sheet:is(.quadrone) { … }
```

- Do use `.application` so that styles don't target context menus and tooltips.
- Keep selectors as short as possible.
- Avoid nesting deeper than 4 levels, or a specificity above (0,6,2). Create a token or variant instead.
- Use one root block per file + a `&:where(…)` if needed.

```css
/* Good. */
.tidy5e-sheet:where(.application.actor) {
  --sidebar-expanded-width: 17.25rem;

  .window-content { … }

  &:where(.theme-parchment) { … }
  &:where(.minimized) { … }
}

/* Bad. Has multiple roots in one file, with split variants. */
.tidy5e-sheet:where(.application.actor) { … }
.tidy5e-sheet:where(.application.actor.theme-parchment) { … }
.tidy5e-sheet:where(.application.actor) { … }
```

- Nest variants with `&:where(.qualifier)`. Avoid the specificity of `&.qualifier`.
- Put a rule's own declarations before any nested rules.
- No `!important` except in a couple cases `util.css`.

## Tokens

- Tidy theme tokens are prefixed with `--t5e-*`
- Tiers
  1. Generic `--t5e-color-palette-*`
  2. Semantic (`--t5e-color-text-*`, `--t5e-theme-color-*`, etc) are swapped by theme
  3. Component (`--t5e-<component>-*`) are specific to components
- Other tokens without a Tidy prefix are overrides of core or system variables.

## Themes

- `.theme-dark` / `.theme-light` rules only set custom properties. Color swaps go in `variables.css`.
- `.theme-basic` and `.theme-parchment` are sheet styles, and may set properties inside a `:where()` block.
- Basic sheets have `.theme-basic` AND `.theme-parchment` (the basic sheets are parchment style + extra styles)
- `:not(.theme-parchment)` matches the default Tidy theme. `:not(.theme-basic)` matches parchment sheets and every dialog, settings app, and tooltip.

## Components

Component styles each have one file with a short list of base tokens.

- The base rule reads tokens with a fallback: `background: var(--t5e-button-background, magenta)`.
- Variants override tokens when possible: `.button-primary { --t5e-button-background: magenta }`.
- Consumers can set token overrides, but we only add a token when it's used in multiple places.
- Something for a component overridden elsewhere and you're adding another override? Time for a new variant or token.

```css
/* Good. */
.tidy5e-sheet {
  .sheet-header-actions {
    --t5e-button-border: var(--t5e-color-palette-gold-62);
  }
}

/* Bad. Just...no. Not if we can at all avoid it. */
.tidy5e-sheet {
  .sheet-header .header-control.button-borderless:not(:disabled):hover i { color: … }
}
```
